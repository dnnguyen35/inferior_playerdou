import {
    createDonation
} from '../service/donation.service.js';

const createeDonation = async (req, res) => {
    try {
        const {
            sender,
            amount,
            message
        } = req.body;

        if (!sender || typeof sender !== 'string') {
            return res.status(400).json({
                message: 'Sender is required'
            });
        }

        if (sender.length > 100) {
            return res.status(400).json({
                message: 'Sender must not exceed 100 characters'
            });
        }

        if (!Number.isInteger(amount) || amount <= 5000) {
            return res.status(400).json({
                message: 'Amount must be a positive integer greater than 5000 vnd'
            });
        }

        if (message !== undefined && typeof message !== 'string') {
            return res.status(400).json({
                message: 'Message must be a string'
            });
        }

        if (message && message.length > 500) {
            return res.status(400).json({
                message: 'Message must not exceed 500 characters'
            });
        }

        const result = await createDonation({
            sender,
            amount,
            message: message || ''
        });

        return res.status(201).json(result);

    } catch (error) {
        console.error('Create donation error:', error);

        return res.status(500).json({
            message: 'Failed to create donation'
        });
    }
};

export default {
    createeDonation
};
