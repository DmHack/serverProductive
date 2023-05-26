const express = require('express');
const router = express.Router();

const { addTasks, getTasksAll, delTask, checkTs } = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');

// POST
router.post('/addTasks', protect, addTasks)
router.post('/delTask', protect, delTask)


// GET
router.get('/getTasksAll', protect, getTasksAll)
router.get('/checkTs', protect, checkTs);

module.exports = router