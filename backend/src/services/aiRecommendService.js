const { OpenAI } = require("openai");
const weatherApi = require("@src/api/weatherApi");
const ApiError = require("@src/helpers/apiError");

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

const LAT = process.env.VENUE_LAT || 37.52774918798905;
const LNG = process.env.VENUE_LNG || 126.89613398474555;
const CACHE_DURATION = 30 * 60 * 1000;
const MAX_CACHE_SIZE = 100;
const weatherDataCache = new Map();

const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of weatherDataCache) {
    if (now - value.timestamp > CACHE_DURATION) {
      weatherDataCache.delete(key);
    }
  }
  if (weatherDataCache.size > MAX_CACHE_SIZE) {
    const oldest = [...weatherDataCache.entries()]
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < oldest.length - MAX_CACHE_SIZE; i++) {
      weatherDataCache.delete(oldest[i][0]);
    }
  }
};

const getWeatherAndRecommend = async (weddingDate) => {
  try {
    const now = new Date();
    const currentTime = now.getTime();

    cleanupCache();

    const cached = weatherDataCache.get(weddingDate);
    if (cached && currentTime - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const targetDate = new Date(weddingDate);
    if (isNaN(targetDate.getTime())) {
      throw new ApiError("유효하지 않은 날짜 형식입니다.", 400);
    }

    const diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

    let userMessage = "";
    let weatherData = { temp: null, condition: null };
    let isPrediction = false;

    if (diffDays <= 5 && diffDays >= -1) {
      try {
        const res = await weatherApi("/", { params: { lat: LAT, lon: LNG } });
        weatherData.temp = res.data.main.temp;
        weatherData.condition = res.data.weather[0].main;
        isPrediction = false;
        userMessage = `현재 예보상 기온은 ${weatherData.temp}도이고 날씨는 ${weatherData.condition}이야. 이 날씨에 맞는 코디를 추천해줘.`;
      } catch (err) {
        isPrediction = true;
        userMessage = `${weddingDate} 시기 서울의 평년 날씨를 예측해서 그 날씨 정보와 코디를 추천해줘.`;
      }
    } else {
      isPrediction = true;
      userMessage = `예식일은 ${weddingDate}이야. 아직 예보가 없으니 네가 가진 기후 데이터를 바탕으로 이 시기 서울의 평년 날씨를 예측해서 추천해줘.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `너는 센스 있고 친절한 하객 복장 코디네이터야. 특정 성별(남/녀)을 구분하지 않고, 누구나 참고할 수 있는 젠더리스(Genderless)하고 깔끔한 하객 복장을 추천해줘. 성별 무관 젠더리스룩을 JSON으로 추천해줘. 현재 날씨 정보를 바탕으로 최적의 복장을 추천해줘. 만약 비나 눈이 오거나 기온이 급격히 낮다면, 그에 맞는 준비물(우산, 장갑, 핫팩 등) 정보도 포함해줘. 결과를 반드시 JSON 형식으로만 답해줘. 구조는 { 'top': '', 'bottom': '', 'outer': '', 'acc': '', 'reason': '' } 형식을 유지해줘. (단, 'acc' 항목에는 날씨에 따른 필수 준비물이나 액세서리를 적어줘. 'reason' 형식은 3줄 이내로 적어줘. 모든 내용은 반드시 한국어로 작성해줘.)
          ${
            isPrediction
              ? "통계적 기후 데이터를 바탕으로 해주고, '~할 것으로 예상되는 날씨입니다'라고 해줘."
              : "실시간 예보를 바탕으로 확신있게 말해줘."
          }`,
        },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    });

    const aiAnswer = JSON.parse(completion.choices[0].message.content);
    const result = {
      weddingDate,
      dDay: diffDays,
      isPrediction,
      weather: {
        temp: aiAnswer.temp || weatherData.temp,
        condition: aiAnswer.condition || weatherData.condition,
      },
      recommendation: {
        top: aiAnswer.top,
        bottom: aiAnswer.bottom,
        outer: aiAnswer.outer,
        acc: aiAnswer.acc,
        reason: aiAnswer.reason,
      },
    };
    weatherDataCache.set(weddingDate, { data: result, timestamp: currentTime });
    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("추천 서비스 일시 중단", 500);
  }
};

module.exports = { getWeatherAndRecommend };
