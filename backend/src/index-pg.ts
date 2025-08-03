import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/pool';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes with PostgreSQL
import authRoutesPg from './routes/auth-pg';
import roadmapRoutesPg from './routes/roadmap-pg';
import progressRoutesPg from './routes/progress-pg';

// Health check endpoint
app.get('/health', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', timestamp: new Date().toISOString(), database: 'disconnected' });
  }
});

// API routes
app.use('/api/auth', authRoutesPg);
app.use('/api/roadmap', roadmapRoutesPg);
app.use('/api/progress', progressRoutesPg);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🐘 Using PostgreSQL directly (no Prisma)`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await pool.end();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});