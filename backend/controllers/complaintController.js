const Complaint = require("../models/Complaint");
const { validationResult } = require("express-validator");

// @desc    Add a new complaint
// @route   POST /api/complaints
// @access  Public
const addComplaint = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, title, description, category, location } = req.body;

  try {
    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      submittedBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    console.error("Add complaint error:", error.message);
    res.status(500).json({ message: "Server error while adding complaint" });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public
const getAllComplaints = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get complaints error:", error.message);
    res.status(500).json({ message: "Server error while fetching complaints" });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (error) {
    console.error("Get complaint error:", error.message);
    res.status(500).json({ message: "Server error while fetching complaint" });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaintStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error.message);
    res.status(500).json({ message: "Server error while updating complaint" });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Delete complaint error:", error.message);
    res.status(500).json({ message: "Server error while deleting complaint" });
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=Ghaziabad
// @access  Public
const searchByLocation = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: "Location query parameter is required" });
  }

  try {
    const complaints = await Complaint.find({
      location: { $regex: location, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json({
      complaints,
      total: complaints.length,
    });
  } catch (error) {
    console.error("Search complaint error:", error.message);
    res.status(500).json({ message: "Server error while searching complaints" });
  }
};

// @desc    Save AI analysis result to complaint
// @route   PUT /api/complaints/:id/ai-analysis
// @access  Private
const saveAiAnalysis = async (req, res) => {
  const { urgency, department, autoResponse, summary } = req.body;

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { aiAnalysis: { urgency, department, autoResponse, summary } },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "AI analysis saved successfully",
      complaint,
    });
  } catch (error) {
    console.error("Save AI analysis error:", error.message);
    res.status(500).json({ message: "Server error while saving AI analysis" });
  }
};

module.exports = {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
  saveAiAnalysis,
};
