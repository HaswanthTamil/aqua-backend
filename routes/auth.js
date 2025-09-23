const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

const router = express.Router();

// POST /auth/register - Register a new user
router.post('/register', registerValidation, register);

// POST /auth/login - Login user
router.post('/login', loginValidation, login);

module.exports = router;
