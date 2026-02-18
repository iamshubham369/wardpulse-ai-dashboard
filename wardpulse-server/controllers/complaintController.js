const Complaint = require("../models/Complaint");
const axios = require("axios");

// 🔥 CREATE COMPLAINT WITH AI INTEGRATION
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, areaDensity, location } = req.body;

    // Prepare AI input
    const aiInput = {
      category: category,
      areaDensity: areaDensity,
      descriptionLength: description.length,
      previousCount: 2, // temporary fixed logic
      daysOpen: 0
    };

    console.log("Calling AI with:", aiInput);

    // Call AI service
    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/predict",
      aiInput
    );

    console.log("AI Response:", aiResponse.data);

    const predictedPriority = aiResponse.data.predictedPriority;

    // Save complaint with predicted priority
    const complaint = new Complaint({
      title,
      description,
      category,
      areaDensity,
      location,
      predictedPriority
    });

    const savedComplaint = await complaint.save();

    res.status(201).json(savedComplaint);

  } catch (error) {
    console.error("Error in createComplaint:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// 🔥 GET ALL COMPLAINTS
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔥 UPDATE STATUS
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;

    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    }

    const updatedComplaint = await complaint.save();

    res.json(updatedComplaint);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔥 DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const complaints = await Complaint.find();

    const total = complaints.length;

    const pending = complaints.filter(c => c.status === "Pending").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    const highPriority = complaints.filter(c => c.predictedPriority === "High").length;
    const mediumPriority = complaints.filter(c => c.predictedPriority === "Medium").length;
    const lowPriority = complaints.filter(c => c.predictedPriority === "Low").length;

    // Average resolution time (in hours)
    const resolvedComplaints = complaints.filter(c => c.status === "Resolved" && c.resolvedAt);

    let avgResolutionTime = 0;

    if (resolvedComplaints.length > 0) {
      const totalTime = resolvedComplaints.reduce((sum, c) => {
        const diff = new Date(c.resolvedAt) - new Date(c.createdAt);
        return sum + diff;
      }, 0);

      avgResolutionTime = (totalTime / resolvedComplaints.length) / (1000 * 60 * 60); // convert ms to hours
    }

    // Category counts
    const categoryCounts = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    res.json({
      total,
      pending,
      inProgress,
      resolved,
      highPriority,
      mediumPriority,
      lowPriority,
      avgResolutionTime: avgResolutionTime.toFixed(2),
      categoryCounts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 🔥 HOTSPOT DETECTION
exports.getHotspots = async (req, res) => {
  try {
    const complaints = await Complaint.find();

    const clusters = {};

    complaints.forEach(c => {
      const [lng, lat] = c.location.coordinates;

      // Round coordinates to group nearby points
      const key = `${lat.toFixed(3)}_${lng.toFixed(3)}`;

      if (!clusters[key]) {
        clusters[key] = {
          lat,
          lng,
          count: 0
        };
      }

      clusters[key].count += 1;
    });

    // Only return clusters with 2+ complaints
    const hotspots = Object.values(clusters).filter(c => c.count >= 2);

    res.json(hotspots);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
