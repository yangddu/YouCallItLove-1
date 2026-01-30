const XSS_PATTERN = /<\s*script|javascript:|onerror\s*=|onload\s*=/i;
const URL_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

/**
 * @param {string[]} fields
 */
const createXssFilter = (fields = []) => {
  return function xssFilter(req, res, next) {
    try {
      for (const field of fields) {
        const value = req.body?.[field];
        if (typeof value !== "string") continue;

        if (XSS_PATTERN.test(value)) {
          return res.status(400).json({
            message: `입력값에 허용되지 않는 스크립트 패턴이 포함되어 있습니다. (field: ${field})`,
          });
        }

        if (URL_PATTERN.test(value)) {
          return res.status(400).json({
            message: `입력값에 URL이 포함되어 있습니다. (field: ${field})`,
          });
        }
      }

      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports = createXssFilter;
