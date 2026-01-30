const isDev = process.env.NODE_ENV === "development";

const errorHandler = (err, req, res, next) => {
  if (isDev) {
    console.error(err);
  } else {
    console.error(`[${err.status || 500}] ${err.message}`);
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 && !isDev ? "서버 오류가 발생했습니다." : err.message,
    data: isDev ? err.stack : null,
  });
};

module.exports = { errorHandler };
