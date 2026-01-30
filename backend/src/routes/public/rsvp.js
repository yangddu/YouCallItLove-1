const express = require("express");
const router = express.Router();
const rsvpController = require("@controllers/rsvpController");
const createXssFilter = require("../../../middleware/xssFilter");
const createPhoneValidator = require("../../../middleware/phoneValidator");

router.get("/", rsvpController.getList);

router.post(
  "/",
  createXssFilter(["name", "side"]),
  createPhoneValidator("phone"),
  rsvpController.createOrUpdate,
);

module.exports = router;
