const express = require("express");
const router = express.Router();
const aiRecommendController = require("@controllers/aiRecommendController");

router.get("/recommend", aiRecommendController.getAiRecommend);

module.exports = router;
