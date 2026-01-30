const { sendError } = require("@src/helpers/responseHelper");

/**
 * @param {Object.<string, number>} limits { fieldName: maxLength }
 */
const createInputLengthLimit = (limits = {}) => {
  return function inputLengthLimit(req, res, next) {
    try {
      for (const [field, maxLen] of Object.entries(limits)) {
        const value = req.body?.[field];
        if (value == null) continue;

        if (typeof value === "string" && value.length > maxLen) {
          // return res.status(400).json({
          //   message: `${field}은(는) 최대 ${maxLen}자까지 입력 가능합니다.`,
          // });
          return sendError(
            res,
            `${field}은(는) 최대 ${maxLen}자까지 입력 가능합니다.`,
            400,
          );
        }
      }
      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports = createInputLengthLimit;
