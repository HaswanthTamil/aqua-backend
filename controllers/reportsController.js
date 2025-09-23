const { validationResult } = require('express-validator');
const HazardReport = require('../models/HazardReport');

const createReport = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { latitude, longitude, address, hazardType, severity, description } = req.body;

    const report = new HazardReport({
      latitude,
      longitude,
      address,
      hazardType,
      severity,
      description,
      createdBy: req.user._id
    });

    await report.save();
    await report.populate('createdBy', 'username role');

    res.status(201).json({
      message: 'Hazard report created successfully',
      report
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllReports = async (req, res) => {
  try {
    // Only return approved reports for public access
    const reports = await HazardReport.find({ status: 'approved' })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Approved hazard reports retrieved successfully',
      reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPendingReports = async (req, res) => {
  try {
    const reports = await HazardReport.find({ status: 'pending' })
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Pending hazard reports retrieved successfully',
      reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Get pending reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyReport = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be either "approved" or "rejected"' 
      });
    }

    const report = await HazardReport.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Hazard report not found' });
    }

    if (report.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Report has already been processed' 
      });
    }

    report.status = status;
    await report.save();
    await report.populate('createdBy', 'username role');

    res.json({
      message: `Report ${status} successfully`,
      report
    });
  } catch (error) {
    console.error('Verify report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getPendingReports,
  verifyReport
};
