const express = require('express');
const router = express.Router();
const { placeBid, getGigBids, hireBid } = require('../controllers/bidController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, placeBid);
router.get('/:gigId', protect, getGigBids);
router.patch('/:bidId/hire', protect, hireBid);

module.exports = router;
