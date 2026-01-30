const jwt = require("jsonwebtoken");
const authService = require("@services/authService");
const { sendSuccess } = require("@src/helpers/responseHelper");
const asyncHelper = require("@src/helpers/asyncHelper");
const ApiError = require("@src/helpers/apiError");

const {
  KAKAO_AUTH_URL,
  KAKAO_CLIENT_ID,
  KAKAO_REDIRECT_URI,
} = require("../../config/kakao");

const isProduction = process.env.NODE_ENV === "production";

const loginWithKakao = (req, res) => {
  const scope = encodeURIComponent(
    "profile_nickname,profile_image,account_email",
  );
  return res.redirect(
    `${KAKAO_AUTH_URL}?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&scope=${scope}&prompt=login`,
  );
};

const kakaoCallback = asyncHelper(async (req, res) => {
  const { code } = req.query;
  const kakaoAccessToken = await authService.getKakaoToken(code);
  const kakaoUser = await authService.getKakaoUser(kakaoAccessToken);
  const { accessToken, refreshToken } = authService.generateTokens(kakaoUser);

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    throw new ApiError("FRONTEND_URL 환경변수가 설정되지 않았습니다.", 500);
  }
  return res.redirect(`${frontendUrl}/auth/callback`);
});

const refresh = asyncHelper(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new ApiError("리프레시 토큰이 없습니다.", 401);

  const decoded = authService.verifyRefreshToken(refreshToken);
  const accessToken = jwt.sign({ sub: decoded.sub }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return sendSuccess(res, { accessToken });
});

const getMe = asyncHelper(async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return sendSuccess(res, null, "비로그인 상태입니다.");
  }
  try {
    const userData = authService.verifyAccessToken(token);
    return sendSuccess(res, userData, "내 정보 조회 성공");
  } catch (error) {
    res.clearCookie("accessToken", {
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    throw error;
  }
});

module.exports = { loginWithKakao, kakaoCallback, refresh, getMe };
