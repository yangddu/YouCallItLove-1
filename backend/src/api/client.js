const axios = require("axios");

const $api = (config = {}) => {
  const client = axios.create({
    timeout: 10000,
    ...config,
  });

  client.interceptors.request.use((config) => {
    console.log(
      `[API Request] ${config.method.toUpperCase()} ${config.baseURL}${
        config.url
      }`,
    );
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(
        `[API Error] ${error.response?.status || "Network Error"}: ${
          error.message
        }`,
      );
      return Promise.reject(error);
    },
  );

  return client;
};

module.exports = $api;
