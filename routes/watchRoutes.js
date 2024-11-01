const express = require('express');
const router = express.Router();

const { addWatch, getWatchAll, delWatch, } = require('../controllers/watchController');

const { protect } = require('../middleware/authMiddleware');

// POST
router.post('/delWatch', protect, delWatch)
router.post('/addWatch', protect, addWatch);


// GET
router.get('/getWatchAll', protect, getWatchAll)


module.exports = router