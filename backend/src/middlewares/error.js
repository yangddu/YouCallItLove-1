const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "ServerError",
    data: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = { errorHandler };
