/**
 * @param {string} field
 */
const createPhoneValidator = (field = "phone") => {
  return function phoneValidator(req, res, next) {
    try {
      let raw = req.body?.[field];

      if (raw == null || raw === "") {
        return next();
      }

      if (typeof raw !== "string") {
        raw = String(raw);
      }

      const digits = raw.replace(/\D/g, "");

      if (digits.length < 9 || digits.length > 11) {
        return res.status(400).json({
          message: "전화번호 형식이 올바르지 않습니다.",
        });
      }

      req.body[field] = digits;

      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports = createPhoneValidator;
