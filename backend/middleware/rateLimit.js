const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

const ipStore = new Map();

const rateLimit = (req, res, next) => {
  const now = Date.now();
  const ip = req.ip || req.connection.remoteAddress || "unknown";

  if (!ipStore.has(ip)) {
    ipStore.set(ip, { count: 1, start: now });
    return next();
  }

  const record = ipStore.get(ip);
  const elapsed = now - record.start;

  if (elapsed > WINDOW_MS) {
    ipStore.set(ip, { count: 1, start: now });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    });
  }

  record.count += 1;
  ipStore.set(ip, record);
  next();
};

module.exports = rateLimit;
