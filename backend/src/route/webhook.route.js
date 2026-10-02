import express from 'express';
import { handlePayOSWebhook } from '../controller/webhook.controller.js';

const createWebhookRoute = (io) => { 
    const router = express.Router();
    router.post( '/payos', handlePayOSWebhook(io) );
    return router; 
};

export default createWebhookRoute;