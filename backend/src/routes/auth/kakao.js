const express = require("express");
const router = express.Router();
const authController = require("@controllers/authController");

router.get("/", authController.loginWithKakao);
router.get("/redirect", authController.kakaoCallback);
router.post("/refresh", authController.refresh);

module.exports = router;
