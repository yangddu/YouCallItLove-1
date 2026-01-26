const { OpenAI } = require("openai");
const fetch = require("node-fetch");
const weatherApi = require("@src/api/weatherApi");
const ApiError = require("@src/helpers/apiError");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  fetch: fetch,
});
const LAT = 37.52774918798905;
const LNG = 126.89613398474555;
const CACHE_DURATION = 30 * 60 * 1000;
let cachedData = null;
let lastFetchTime = 0;

const getWeatherAndRecommend = async () => {
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData;
  }
  try {
    const weatherResponse = await weatherApi("/", {
      params: { lat: LAT, lon: LNG },
    });

    if (!weatherResponse.data || !weatherResponse.data.main) {
      throw new ApiError("날씨 정보를 가져오는 데 실패했습니다.", 502);
    }

    const temp = weatherResponse.data.main.temp;
    const condition = weatherResponse.data.weather[0].main;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "너는 센스 있고 친절한 하객 복장 코디네이터야. 특정 성별(남/녀)을 구분하지 않고, 누구나 참고할 수 있는 젠더리스(Genderless)하고 깔끔한 하객 복장을 추천해줘. 현재 날씨 정보를 바탕으로 최적의 복장을 추천해줘. 만약 비나 눈이 오거나 기온이 급격히 낮다면, 그에 맞는 준비물(우산, 장갑, 핫팩 등) 정보도 포함해줘. 결과를 반드시 JSON 형식으로만 답해줘. 구조는 { 'top': '', 'bottom': '', 'outer': '', 'acc': '', 'reason': '' } 형식을 유지해줘. (단, 'acc' 항목에는 날씨에 따른 필수 준비물이나 액세서리를 적어줘. 'reason' 형식은 4줄 이내로 적어줘.)",
        },
        {
          role: "user",
          content: `현재 기온은 ${temp}도이고 날씨는 ${condition}이야. 적절한 하객룩을 추천해줘.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    let aiAnswer;
    try {
      aiAnswer = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error("AI 응답 파싱 실패:", parseError);
      throw new ApiError(
        "AI 추천 데이터를 처리하는 중 오류가 발생했습니다.",
        500,
      );
    }

    const result = {
      weather: { temp, condition },
      recommendation: aiAnswer,
    };
    cachedData = result;
    lastFetchTime = now;

    return result;
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) throw error;
    throw new ApiError("추천 서비스 오류가 발생했습니다.", 500);
  }
};

module.exports = {
  getWeatherAndRecommend,
};
