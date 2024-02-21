const express = require("express");
const User = require("../models/User");
const Report = require("../models/Report");
const Notify = require("../models/Notify");
const router = express.Router();
const { jwtAuth } = require("../middlewares/auth");

router.post("/", jwtAuth, async (req, res) => {
  const { content } = req.body;
  const id = req.user.payload.user._id;
  try {
    const newReport = new Report({
      owner: id,
      content,
    });
    await newReport.save();
    const user = await User.findById(id);
    user.reports.push(newReport._id);
    await user.save();
    res.status(200).json(newReport);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

router.get("/", jwtAuth, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: "owner",
        strictPopulate: false,
      })
      .sort({ createdAt: 1 });

    res.status(200).json(reports);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

router.get("/:id", jwtAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id).populate(
      "owner",
      "name studentId"
    );
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "report not found",
      });
    }
    res.status(200).json({
      success: true,
      report,
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.patch("/:reportId", jwtAuth, async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = await Report.findOne({ _id: reportId });
    if (!report) {
      return res.status(403).json({ message: "cannot find the report" });
    }
    report.status = report.status === "success" ? "pending" : "success";
    await report.save();
    res.status(200).json({ message: "update status successful", report });
  } catch (e) {
    res.status(500).json(e.message);
  }
});


module.exports = router;
