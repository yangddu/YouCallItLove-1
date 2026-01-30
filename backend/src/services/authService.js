const qs = require("qs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  KAKAO_TOKEN_URL,
  KAKAO_USER_URL,
  KAKAO_CLIENT_ID,
  KAKAO_CLIENT_SECRET,
  KAKAO_REDIRECT_URI,
} = require("../../config/kakao");
const { kakaoAuthApi, kakaoUserApi } = require("@src/api/kakao");
const ApiError = require("@src/helpers/apiError");

const getKakaoToken = async (code) => {
  try {
    const { data } = await kakaoAuthApi.post(
      "",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }),
    );
    return data.access_token;
  } catch (error) {
    throw new ApiError("카카오 인증 토큰 발급에 실패했습니다.", 502);
  }
};

const getKakaoUser = async (accessToken) => {
  try {
    const { data } = await kakaoUserApi.get(KAKAO_USER_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  } catch (error) {
    throw new ApiError("카카오 사용자 정보를 가져오는데 실패했습니다.", 502);
  }
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      nickname: user.kakao_account.profile.nickname,
      email: user.kakao_account.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      id: decoded.sub,
      name: decoded.nickname,
      email: decoded.email,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError("인증 세션이 만료되었습니다.", 401);
    }
    throw new ApiError("유효하지 않은 인증 정보입니다.", 401);
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ApiError("리프레시 토큰이 유효하지 않습니다.", 401);
  }
};

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

const generateAdminTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, username: user.username, role: "ADMIN" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

module.exports = {
  getKakaoToken,
  getKakaoUser,
  generateTokens,
  generateAdminTokens,
  verifyAccessToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
};
