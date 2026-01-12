const express = require('express');
const router = express.Router();
const { placeBid, getGigBids } = require('../controllers/bidController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, placeBid);
router.get('/:gigId', protect, getGigBids);

module.exports = router;
