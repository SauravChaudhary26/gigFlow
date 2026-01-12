const express = require('express');
const router = express.Router();
const { createGig, getAllGigs } = require('../controllers/gigController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createGig);
router.get('/', getAllGigs);

module.exports = router;
