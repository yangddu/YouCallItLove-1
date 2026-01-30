const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const guestbookController = require("@controllers/guestbookController");
const createXssFilter = require("@src/middlewares/xssFilter");
const createInputLengthLimit = require("@src/middlewares/inputLengthLimit");

const writeRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  message: { success: false, message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
});

// 방명록 조회
router.get("/", guestbookController.getList);

// 방명록 작성 (XSS 필터 + 길이 제한 + Rate Limiting)
router.post(
  "/write",
  writeRateLimiter,
  createXssFilter(["name", "message"]),
  createInputLengthLimit({ name: 20, message: 300, password: 20 }),
  guestbookController.write,
);

module.exports = router;
