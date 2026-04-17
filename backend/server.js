import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import websiteRoutes from './routes/website.routes.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rateLimit.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ─── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // Allow no-origin requests (curl, Postman, Render health checks)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`[CORS] Blocked: ${origin}`);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,   // required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Admin-Token',   // used by multipart/form-data upload requests
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204,
};

// CORS must be applied before everything, including before preflight OPTIONS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());   // must run before any route that reads req.cookies
app.use('/api/', rateLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/upload',   uploadRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date().toISOString() })
);

// ─── Fallbacks ────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  Server on port ${PORT}  [${process.env.NODE_ENV || 'development'}]`);
  console.log(`🌍  Allowed origins: ${allowedOrigins.join(' | ')}`);
});
