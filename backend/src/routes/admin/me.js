const express = require("express");
const router = express.Router();
const adminController = require("@src/controllers/adminController");
const { requireAuth } = require("@src/middlewares/auth");

router.get("/me", requireAuth, adminController.getMe);

module.exports = router;
