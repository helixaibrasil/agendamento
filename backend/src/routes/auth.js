const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validators = require('../utils/validators');

router.post('/login', validators.login, AuthController.login);
router.get('/me', authMiddleware, AuthController.me);
router.post('/change-password', authMiddleware, AuthController.changePassword);

module.exports = router;
