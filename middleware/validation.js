const { body } = require('express-validator');

const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['citizen', 'verifier'])
    .withMessage('Role must be either "citizen" or "verifier"')
];

const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const reportValidation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),
  
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
  
  body('address')
    .isLength({ min: 1, max: 500 })
    .withMessage('Address must be between 1 and 500 characters'),
  
  body('hazardType')
    .isLength({ min: 1, max: 100 })
    .withMessage('Hazard type must be between 1 and 100 characters'),
  
  body('severity')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Severity must be either "low", "medium", or "high"'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
];

const verifyReportValidation = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either "approved" or "rejected"')
];

module.exports = {
  registerValidation,
  loginValidation,
  reportValidation,
  verifyReportValidation
};
