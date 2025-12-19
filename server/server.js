// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import upload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectMongo } from './db/mongoConnection.js';
import AuthRouter from "./routes/AuthRouter.js";
import PlayersRouter from './routes/PlayersRouter.js';
import CharacterRouter from './routes/CharacterRouter.js';
import WarRouter from './routes/WarRouter.js';
import RatesRouter from './routes/RatesRouter.js';
import EventsRouter from './routes/EventsRouter.js';
import ItemsShopRouter from './routes/ItemsShopRouter.js';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';

// === Fix __dirname for ES Modules ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Setup ===
dotenv.config();
const app = express();

app.use(cors({credentials: true , origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(upload());

// ✅ Serve uploads folder properly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect to MongoDB
connectMongo();

// ✅ Routes
app.use('/auth', AuthRouter);
app.use('/player', PlayersRouter);
app.use('/char', CharacterRouter);
app.use('/war', WarRouter);
app.use('/rate', RatesRouter);
app.use('/event', EventsRouter);
app.use('/shop', ItemsShopRouter);

app.use(notFound)
app.use(errorHandler)

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
