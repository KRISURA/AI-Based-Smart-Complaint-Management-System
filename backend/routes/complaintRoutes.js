const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
  saveAiAnalysis,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

// Validation rules for adding complaint
const complaintValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("title").notEmpty().withMessage("Complaint title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("location").notEmpty().withMessage("Location is required"),
];

// @route   GET /api/complaints/search?location=Ghaziabad
// NOTE: This must be BEFORE /:id route to avoid conflict
router.get("/search", searchByLocation);

// @route   POST /api/complaints
router.post("/", complaintValidation, addComplaint);

// @route   GET /api/complaints
router.get("/", getAllComplaints);

// @route   GET /api/complaints/:id
router.get("/:id", getComplaintById);

// @route   PUT /api/complaints/:id
router.put("/:id", protect, updateComplaintStatus);

// @route   DELETE /api/complaints/:id
router.delete("/:id", protect, deleteComplaint);

// @route   PUT /api/complaints/:id/ai-analysis
router.put("/:id/ai-analysis", protect, saveAiAnalysis);

module.exports = router;
