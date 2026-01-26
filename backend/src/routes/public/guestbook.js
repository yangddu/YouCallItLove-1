const express = require("express");
const router = express.Router();
const guestbookController = require("@controllers/guestbookController");

// 방명록 조회
router.get("/", guestbookController.getList);

// 방명록 작성
router.post("/write", guestbookController.write);

module.exports = router;
