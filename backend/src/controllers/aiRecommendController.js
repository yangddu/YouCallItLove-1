const aiRecommendService = require("@services/aiRecommendService");
const { sendSuccess } = require("@src/helpers/responseHelper");
const asyncHelper = require("@src/helpers/asyncHelper");
const ApiError = require("@src/helpers/apiError");

const getAiRecommend = asyncHelper(async (req, res) => {
  const { weddingDate } = req.query;
  if (!weddingDate) {
    throw new ApiError("예식일 파라미터가 누락되었습니다.", 400);
  }
  if (isNaN(new Date(weddingDate).getTime())) {
    throw new ApiError("유효하지 않은 날짜 형식입니다.", 400);
  }

  const result = await aiRecommendService.getWeatherAndRecommend(weddingDate);
  return sendSuccess(res, result, "AI 추천 코디를 가져왔습니다.");
});

module.exports = {
  getAiRecommend,
};
