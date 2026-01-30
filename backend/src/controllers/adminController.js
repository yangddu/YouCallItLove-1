const adminService = require("@services/adminService");
const authService = require("@services/authService");
const { sendSuccess, sendError } = require("@src/helpers/responseHelper");
const asyncHelper = require("@src/helpers/asyncHelper");
const ApiError = require("@src/helpers/apiError");

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

const getMe = asyncHelper(async (req, res) => {
  const adminData = adminService.getAdminProfile(req.user);
  return sendSuccess(res, adminData, "관리자 정보 조회에 성공했습니다.");
});

const signup = asyncHelper(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError("사용자명과 비밀번호는 필수입니다.", 400);
  }
  if (password.length < 8) {
    throw new ApiError("비밀번호는 최소 8자 이상이어야 합니다.", 400);
  }

  const newUser = await adminService.registerAdmin(username, password);
  return sendSuccess(res, newUser, "회원가입 완료", 201);
});

const login = asyncHelper(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError("사용자명과 비밀번호는 필수입니다.", 400);
  }

  const user = await adminService.validateLogin(username, password);
  const { accessToken, refreshToken } =
    authService.generateAdminTokens(user);

  await adminService.updateLoginState(user.id, refreshToken);

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return sendSuccess(
    res,
    { user: { id: user.id, username: user.username } },
    "로그인 성공",
  );
});

const logout = asyncHelper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  res.clearCookie("accessToken", { path: "/", httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
  res.clearCookie("refreshToken", { path: "/", httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
  if (refreshToken) {
    await adminService.clearSession(refreshToken);
  }
  return sendSuccess(res, null, "로그아웃 되었습니다.");
});

const refresh = asyncHelper(async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) {
    throw new ApiError("리프레시 토큰이 없습니다.", 400);
  }

  const tokens = await adminService.refreshSession(oldToken);

  res.cookie("accessToken", tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, cookieOptions);

  return sendSuccess(res, null, "토큰 갱신 성공");
});

module.exports = {
  getMe,
  signup,
  login,
  logout,
  refresh,
};
