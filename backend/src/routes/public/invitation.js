const express = require("express");
const router = express.Router();
const invitationController = require("@controllers/invitationController");

// 초대장 정보 조회
router.get("/:slug", invitationController.getInvitation);

module.exports = router;
