const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/score', auth, userController.getScore);
router.post('/submit-exam', auth, userController.submitExam);

module.exports = router;