const KAKAO_CLIENT_ID = process.env.KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL  = 'https://kapi.kakao.com/v2/user/me';

module.exports = {
    KAKAO_CLIENT_ID,
    KAKAO_REDIRECT_URI,
    KAKAO_CLIENT_SECRET,
    KAKAO_AUTH_URL,
    KAKAO_TOKEN_URL,
    KAKAO_USER_URL,
}