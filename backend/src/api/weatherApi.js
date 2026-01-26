const $api = require("@src/api/client");

const weatherApi = $api({
  baseURL: "http://api.openweathermap.org/data/2.5/weather",
  params: {
    appid: process.env.WEATHER_KEY,
    lang: "kr",
    units: "metric",
    q: "Seoul",
  },
  timeout: 50000,
});

module.exports = weatherApi;
