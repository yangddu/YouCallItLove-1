const axios = require("axios");

const isDev = process.env.NODE_ENV !== "production";

const $api = (config = {}) => {
  const client = axios.create({
    timeout: 10000,
    ...config,
  });

  if (isDev) {
    client.interceptors.request.use((config) => {
      console.log(
        `[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      return config;
    });
  }

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isDev) {
        console.error(
          `[API Error] ${error.response?.status || "Network Error"}: ${error.message}`,
        );
      }
      return Promise.reject(error);
    },
  );

  return client;
};

module.exports = $api;
