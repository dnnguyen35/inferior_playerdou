import express from 'express';
import DonationController from '../controller/donation.controller.js';

const router = express.Router();

router.post('/', DonationController.createeDonation);

export default router;