const express = require("express");
const router = express.Router();
const { analyzeComplaint } = require("../controllers/aiController");

// @route   POST /api/ai/analyze
router.post("/analyze", analyzeComplaint);

module.exports = router;
