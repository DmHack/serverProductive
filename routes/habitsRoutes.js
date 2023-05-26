const express = require('express');
const router = express.Router();

const { addHabits, getHabitsAll, delHabits, checkTs } = require('../controllers/habitsController');

const { protect } = require('../middleware/authMiddleware');

// POST
router.post('/delHabits', protect, delHabits)
router.post('/addHabits', protect, addHabits);


// GET
router.get('/getHabitsAll', protect, getHabitsAll)
router.get('/checkTs', protect, checkTs)


module.exports = router