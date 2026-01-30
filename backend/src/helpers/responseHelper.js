const sendSuccess = (res, data, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

const sendError = (res, message = "ServerError", status = 500, data = null) => {
  return res.status(status).json({
    success: false,
    message,
    data,
  });
};

module.exports = { sendSuccess, sendError };
