import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';

import initSocket from './config/socket.js';

import donationRoute from './route/donation.route.js';
import webhookRoute from './route/webhook.route.js';

const app = express();

const httpServer = createServer(app);

const io = initSocket(httpServer);

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        message: 'Server is running'
    });
});

app.use('/api/donations', donationRoute);
app.use('/api/webhooks', webhookRoute(io));

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
