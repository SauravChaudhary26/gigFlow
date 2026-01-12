const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const { placeBidSchema } = require('../utils/validationSchemas');

// @desc    Place a bid on a gig
// @route   POST /api/bids
// @access  Private
const placeBid = async (req, res) => {
    const { error } = placeBidSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { gigId, message, bidPrice } = req.body;

    try {
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.status !== 'open') {
            return res.status(400).json({ message: 'Gig is not open for bidding' });
        }

        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot bid on your own gig' });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            bidPrice,
        });

        res.status(201).json(bid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all bids for a specific gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner only)
const getGigBids = async (req, res) => {
    try {
        const { gigId } = req.params;
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
        }

        const bids = await Bid.find({ gigId }).populate('freelancerId', 'name email');
        res.status(200).json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Hire a freelancer for a bid
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
const hireBid = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bidId } = req.params;

        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Bid not found' });
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Gig not found' });
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Not authorized to hire for this gig' });
        }

        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Gig is already assigned' });
        }

        // Update chosen bid status
        bid.status = 'hired';
        await bid.save({ session });

        // Update gig status
        gig.status = 'assigned';
        await gig.save({ session });

        // Reject other bids
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bidId } },
            { status: 'rejected' }
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        // Emit notification to freelancer
        const io = req.app.get('io');
        if (io) {
            io.to(bid.freelancerId.toString()).emit('hired_notification', {
                message: `You have been hired for ${gig.title}!`,
                gigId: gig._id,
                gigTitle: gig.title
            });
        }

        res.status(200).json({
            message: 'Freelancer hired successfully',
            bid,
            gig
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    placeBid,
    getGigBids,
    hireBid,
};
