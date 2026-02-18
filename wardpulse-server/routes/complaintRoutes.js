const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");

// 🔹 Create Complaint (AI Integrated)
router.post("/", complaintController.createComplaint);

// 🔹 Get All Complaints
router.get("/", complaintController.getAllComplaints);

// 🔹 Dashboard Stats
router.get("/dashboard", complaintController.getDashboardStats);

// 🔹 Hotspot Detection
router.get("/hotspots", complaintController.getHotspots);

// 🔹 Update Complaint Status
router.patch("/:id", complaintController.updateComplaintStatus);

module.exports = router;
