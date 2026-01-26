const aiRecommendService = require("@services/aiRecommendService");
const { sendSuccess } = require("@src/helpers/responseHelper");
const asyncHelper = require("@src/helpers/asyncHelper");

const getAiRecommend = asyncHelper(async (req, res) => {
  const result = await aiRecommendService.getWeatherAndRecommend();
  return sendSuccess(res, result, "AI 추천 코디를 가져왔습니다.");
});

module.exports = {
  getAiRecommend,
};
