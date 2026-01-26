const adminService = require("@services/adminService");
const { sendSuccess } = require("@src/helpers/responseHelper");
const asyncHelper = require("@src/helpers/asyncHelper");

const getMe = asyncHelper(async (req, res) => {
  const adminData = adminService.getAdminProfile(req.user);
  return sendSuccess(res, adminData, "관리자 정보 조회에 성공했습니다.");
});

const signup = asyncHelper(async (req, res) => {
  const { username, password } = req.body;
  const newUser = await adminService.registerAdmin(username, password);
  return sendSuccess(res, newUser, "회원가입 완료", 201);
});

const login = asyncHelper(async (req, res) => {
  const { username, password } = req.body;
  const user = await adminService.validateLogin(username, password);
  const { accessToken, refreshToken } = authService.generateTokens(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendSuccess(
    res,
    { accessToken, user: { id: user.id, username: user.username } },
    "로그인 성공",
  );
});

const logout = asyncHelper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  res.clearCookie("refreshToken", { path: "/" });
  if (refreshToken) {
    await adminService.clearSession(refreshToken);
  }
  return sendSuccess(res, null, "로그아웃 되었습니다.");
});

const refresh = asyncHelper(async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) return sendError(res, "토큰이 없습니다.", 400);
  const tokens = authService.generateTokens(user);
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
  });
  return sendSuccess(
    res,
    { accessToken: tokens.accessToken },
    "토큰 갱신 성공",
  );
});

module.exports = {
  getMe,
  signup,
  login,
  logout,
  refresh,
};
