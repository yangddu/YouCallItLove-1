const $api = require("@src/api/client");
const { KAKAO_TOKEN_URL, KAKAO_USER_URL } = require("../../config/kakao");

const kakaoAuthApi = $api({
  baseURL: KAKAO_TOKEN_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
});

const kakaoUserApi = $api({
  baseURL: KAKAO_USER_URL,
});

module.exports = {
  kakaoAuthApi,
  kakaoUserApi,
};
