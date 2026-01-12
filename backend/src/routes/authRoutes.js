const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Example protected route for testing
router.get('/profile', protect, (req, res) => {
    res.status(200).json(req.user);
});

module.exports = router;
