import payOS from '../config/payos.js';
import {
    getDonation,
    markPaid
} from '../service/donation.service.js';
import {
    generateDonationTts
} from '../service/tts.service.js';

const handlePayOSWebhook = (io) => {
    return async (req, res) => {
        try {
            const webhookData = payOS.webhooks.verify(req.body);

            const {
                orderCode,
                amount
            } = webhookData;

            console.log('PayOS webhook:', webhookData);

            const donation = await getDonation(orderCode);

            if (!donation) {
                console.log(`Donation not found: ${orderCode}`);

                return res.status(200).json({
                    message: 'Donation not found'
                });
            }

            if (donation.status === 'PAID') {
                console.log(`Donation already paid: ${orderCode}`);

                return res.status(200).json({
                    message: 'Donation already processed'
                });
            }

            if (Number(donation.amount) !== Number(amount)) {
                console.error(`Amount mismatch: ${orderCode}`);

                return res.status(400).json({
                    message: 'Amount mismatch'
                });
            }

            const paidDonation = await markPaid(orderCode);

            const ttsUrl = await generateDonationTts({
                sender: paidDonation.sender,
                amount: paidDonation.amount,
                message: paidDonation.message
            });

            io.emit('new-donation', {
                sender: paidDonation.sender,
                amount: paidDonation.amount,
                message: paidDonation.message,
                orderCode: paidDonation.orderCode,
                ttsUrl
            });

            console.log('Donation emitted:', paidDonation);

            return res.status(200).json({
                message: 'Webhook processed successfully'
            });

        } catch (error) {
            console.error('PayOS webhook error:', error);

            return res.status(400).json({
                message: 'Invalid webhook'
            });
        }
    };
};

export {
    handlePayOSWebhook
};
