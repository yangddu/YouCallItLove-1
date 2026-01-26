const sendSuccess = (res, data, message = "Sucess", status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

module.exports = { sendSuccess };
