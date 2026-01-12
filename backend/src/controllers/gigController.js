const Gig = require('../models/Gig');
const { createGigSchema } = require('../utils/validationSchemas');

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    const { error } = createGigSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, budget } = req.body;

    try {
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
            status: 'open',
        });

        res.status(201).json(gig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all open gigs
// @route   GET /api/gigs
// @access  Public
const getAllGigs = async (req, res) => {
    try {
        const { title } = req.query;
        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort({ status: 'desc', createdAt: 'desc' });
        res.status(200).json(gigs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createGig,
    getAllGigs,
};
