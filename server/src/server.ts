import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { connectMongoDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'KisanSetu AR Intelligence Engine',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    supportedCrops: ['Tomato', 'Potato', 'Corn', 'Rice'],
    offlineFallbackActive: true
  });
});

// Mount Routes
app.use('/api', apiRouter);

// Start server and connect DB
app.listen(PORT, async () => {
  console.log(`🌿 KisanSetu AR Intelligence Server running at http://localhost:${PORT}`);
  console.log(`📡 API Endpoints active at http://localhost:${PORT}/api`);
  await connectMongoDB();
});
