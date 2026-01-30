const express = require("express");
const router = express.Router();
const rsvpController = require("@controllers/rsvpController");
const createXssFilter = require("@src/middlewares/xssFilter");
const createPhoneValidator = require("@src/middlewares/phoneValidator");

router.get("/", rsvpController.getList);

router.post(
  "/",
  createXssFilter(["name", "side"]),
  createPhoneValidator("phone"),
  rsvpController.createOrUpdate,
);

module.exports = router;
