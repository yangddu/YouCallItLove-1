const { prisma } = require("@src/lib/db");
const ApiError = require("@src/middlewares/error");

const getAdminProfile = (user) => {
  return {
    id: user.id,
    username: user.username,
    role: user.role ?? "ADMIN",
    isActive: user.isActive,
    isLoggedIn: user.isLoggedIn,
  };
};

const registerAdmin = async (username, password) => {
  const existingUser = await prisma.adminUser.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw new ApiError("이미 존재하는 사용자입니다", 400);
  }

  const hashedPassword = await authService.hashPassword(password);
  return await prisma.adminUser.create({
    data: { username, password: hashedPassword },
    select: { id: true, username: true },
  });
};

const validateLogin = async (username, password) => {
  const user = await prisma.adminUser.findUnique({ where: { username } });

  if (!user) throw new ApiError("사용자를 찾을 수 없습니다.", 401);
  if (!user.isActive) throw new ApiError("비활성화된 계정입니다.", 403);
  if (user.isLoggedIn) throw new ApiError("이미 로그인된 상태입니다.", 409);

  const isValid = await authService.comparePassword(password, user.password);
  if (!isValid) throw new ApiError("비밀번호가 일치하지 않습니다.", 401);

  return user;
};

const updateLoginState = async (userId, refreshToken) => {
  return await prisma.adminUser.update({
    where: { id: userId },
    data: {
      refreshToken,
      isLoggedIn: true,
      failedLoginAttempts: 0,
      lastLoginAt: new Date(),
    },
  });
};

const clearSession = async (refreshToken) => {
  try {
    const decoded = authService.verifyRefreshToken(refreshToken);
    await prisma.adminUser.updateMany({
      where: { id: decoded.sub, refreshToken },
      data: { isLoggedIn: false, refreshToken: null },
    });
  } catch (e) {
    console.warn("clearSession 에러:", e.message);
  }
};

const refreshSession = async (oldToken) => {
  const decoded = authService.verifyRefreshToken(oldToken);
  const user = await prisma.adminUser.findUnique({
    where: { id: decoded.sub },
  });

  if (!user || user.refreshToken !== oldToken)
    throw new ApiError("유효하지 않거나 만료된 세션입니다.", 403);

  const tokens = authService.generateTokens(user);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return tokens;
};

module.exports = {
  getAdminProfile,
  registerAdmin,
  validateLogin,
  updateLoginState,
  clearSession,
  refreshSession,
};
