import payOS from '../config/payos.js';
import redis from '../config/redis.js';

const DONATION_TTL = 30 * 60;

const getDonationKey = (orderCode) => {
    return `donation:${orderCode}`;
};

const createDonation = async ({ sender, amount, message }) => {
    const orderCode = Date.now();

    const paymentData = {
        orderCode,
        amount,
        description: `DONATE ${orderCode}`,
        items: [
            {
                name: 'Donation',
                quantity: 1,
                price: amount
            }
        ],
        returnUrl: "https://youtube.com",
        cancelUrl: "https://youtube.com"
    };

    const paymentLink = await payOS.paymentRequests.create(paymentData);

    const donation = {
        orderCode,
        sender,
        amount,
        message,
        status: 'PENDING',
        createdAt: new Date().toISOString()
    };

    await redis.set(
        getDonationKey(orderCode),
        donation,
        {
            ex: DONATION_TTL
        }
    );

    return {
        orderCode,
        amount,
        checkoutUrl: paymentLink.checkoutUrl,
        qrCode: paymentLink.qrCode
    };
};

const getDonation = async (orderCode) => {
    return await redis.get(getDonationKey(orderCode));
};

const markPaid = async (orderCode) => {
    const donation = await getDonation(orderCode);

    if (!donation) {
        return null;
    }

    donation.status = 'PAID';

    await redis.set(
        getDonationKey(orderCode),
        donation,
        {
            ex: DONATION_TTL
        }
    );

    return donation;
};

export {
    createDonation,
    getDonation,
    markPaid
};
