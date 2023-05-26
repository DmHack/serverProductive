const express = require('express');
const router = express.Router();

const { registerUser, loginUser, renewAccessToken, getMe, proverka, exitAkk } = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// POST
router.post('/register', registerUser)
router.post('/login', loginUser)

// GET
router.get('/renewAccessToken', renewAccessToken)
router.get('/getMe', protect, getMe)
router.get('/proverka', protect, proverka)
router.get('/exitAkk', protect, exitAkk)

module.exports = router