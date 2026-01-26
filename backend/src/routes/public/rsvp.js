const express = require("express");
const router = express.Router();
const rsvpController = require("@controllers/rsvpController");

router.get("/", rsvpController.getList);

router.post("/", rsvpController.createOrUpdate);

module.exports = router;
