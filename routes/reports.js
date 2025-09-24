const express = require('express');
const { 
  createReport, 
  getAllReports, 
  getPendingReports, 
  verifyReport 
} = require('../controllers/reportsController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { reportValidation, verifyReportValidation } = require('../middleware/validation');

const router = express.Router();

// POST /reports - Submit a hazard report (citizen only, auth required)
router.post('/', authMiddleware, reportValidation, createReport);

// GET /reports - Get all approved hazard reports (public access)
router.get('/', getAllReports);

// GET /reports/pending - Get all pending reports (verifier only)
router.get('/pending', authMiddleware, roleMiddleware(['verifier']), getPendingReports);

// PATCH /reports/:id/verify - Verify a hazard report (verifier only)
router.patch('/:id/verify', authMiddleware, roleMiddleware(['verifier']), verifyReportValidation, verifyReport);

module.exports = router;
  