const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth.routes');
const itemsRoutes = require('./routes/items.routes');
const assignmentsRoutes = require('./routes/assignments.routes');
const livestockRoutes = require('./routes/livestock.routes');
const feedsRoutes = require('./routes/feeds.routes');
const usersRoutes = require('./routes/users.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const auditRoutes = require('./routes/audit.routes');

// API routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/items`, itemsRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentsRoutes);
app.use(`${API_PREFIX}/livestock`, livestockRoutes);
app.use(`${API_PREFIX}/feeds`, feedsRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/audit-logs`, auditRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
