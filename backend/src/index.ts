import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { authMiddleware, createAuthRouter, requireProfileComplete } from './auth.js';
import { createApiRouter, createDdjjHandler } from './routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || process.env.BACKEND_PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', createAuthRouter());
app.use('/api', createApiRouter());
app.post('/ddjj', authMiddleware, requireProfileComplete, createDdjjHandler);

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
