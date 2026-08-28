// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import upload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

import { connectMongo } from './db/mongoConnection.js';
import AuthRouter from "./routes/AuthRouter.js";
import PlayersRouter from './routes/PlayersRouter.js';
import CharacterRouter from './routes/CharacterRouter.js';
import WarRouter from './routes/WarRouter.js';
import RatesRouter from './routes/RatesRouter.js';
import EventsRouter from './routes/EventsRouter.js';
import ItemsShopRouter from './routes/ItemsShopRouter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// === Fix __dirname for ES Modules ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Setup ===
dotenv.config();
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://kingdomofsecrets.com',
    'https://www.kingdomofsecrets.com'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed by server'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(upload());

// Serve uploads folder properly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('trust proxy', 1);
const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: "Too many login attempts. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Connect to MongoDB
connectMongo();

// Routes
app.use('/auth', apiRateLimiter, AuthRouter);
app.use('/player', PlayersRouter);
app.use('/char', CharacterRouter);
app.use('/war', WarRouter);
app.use('/rate', RatesRouter);
app.use('/event', EventsRouter);
app.use('/shop', ItemsShopRouter);

app.use(notFound)
app.use(errorHandler)

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
