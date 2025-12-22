const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const validateEnv = require("./config/validateEnv");

// Validate environment variables
validateEnv();

const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy configuration
// In production behind a proxy/load balancer, this should be set to the proxy hop count
// For development with Next.js custom server, we trust the loopback
if (process.env.NODE_ENV === "production") {
  // In production, trust the first proxy (Vercel, Nginx, etc.)
  app.set("trust proxy", 1);
} else {
  // In development, trust loopback for Next.js custom server
  app.set("trust proxy", "loopback");
}

// CORS - MUST BE FIRST, before any other middleware
// Completely open CORS - Allow ALL origins (* equivalent)
// Note: Browser doesn't allow literal '*' with credentials, so we use function that allows all
console.log(
  "🌐 CORS: Completely open - Allowing ALL origins (* equivalent), methods, and headers"
);

// Manual CORS headers as fallback (before CORS middleware)
// This ensures CORS works even if cors middleware fails
app.use((req, res, next) => {
  // Get the origin from request - allow ANY origin (equivalent to *)
  const origin = req.headers.origin;

  // Set CORS headers manually - Allow ALL origins
  // When origin exists, use it (required for credentials)
  // When no origin, use '*' (for non-browser requests)
  if (origin) {
    // Allow this specific origin (effectively allows ALL origins via function)
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // No origin header (non-browser request) - allow all
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, CONNECT, TRACE"
  );
  // Explicitly allow ALL common headers including cache-control
  res.header(
    "Access-Control-Allow-Headers",
    [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Cookie",
      "Set-Cookie",
      "X-Forwarded-For",
      "Cache-Control",
      "Pragma",
      "Expires",
      "If-Modified-Since",
      "If-None-Match",
      "X-Client-IP",
      "User-Agent",
      "Referer",
      "Accept-Language",
      "Accept-Encoding",
      "Connection",
      "Host",
    ].join(", ")
  );
  res.header("Access-Control-Expose-Headers", "*"); // Expose all headers
  res.header("Access-Control-Max-Age", "86400");

  // Log for debugging
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `✅ CORS: Allowing ${origin || "no-origin"} - ${req.method} ${req.path}`
    );
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// CORS middleware - Completely open (allows ALL origins like *)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow ALL origins - equivalent to '*' but works with credentials
      // This function is called for each request and allows any origin
      console.log(`🌐 CORS: Allowing origin: ${origin || "no-origin"}`);
      return callback(null, true); // Allow all origins
    },
    credentials: true, // Allow cookies and credentials
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
      "HEAD",
      "CONNECT",
      "TRACE",
    ],
    // Explicitly list ALL headers - '*' doesn't work in some CORS implementations
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Cookie",
      "Set-Cookie",
      "X-Forwarded-For",
      "Cache-Control", // This was missing!
      "Pragma",
      "Expires",
      "If-Modified-Since",
      "If-None-Match",
      "X-Client-IP",
      "User-Agent",
      "Referer",
      "Accept-Language",
      "Accept-Encoding",
      "Connection",
      "Host",
    ],
    exposedHeaders: "*", // Expose all headers
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Security middleware - Helmet (after CORS, with CORS disabled)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // For Next.js compatibility
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  })
);

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false }, // Disable trust proxy validation warning
});

// More flexible API rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window (shorter, more granular)
  max: process.env.NODE_ENV === "production" ? 60 : 200, // 60 req/min in production, 200 in dev
  message: { success: false, message: "Too many requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  // Skip rate limiting for certain safe endpoints
  skip: (req) => {
    const skipPaths = ["/health", "/api/v1/health"];
    return skipPaths.includes(req.path);
  },
});

// CORS is already configured at the top of the file (before Helmet)
// This section removed - CORS is now at the top for maximum compatibility

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Manual NoSQL injection protection middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
          console.warn(`[Security] Removed potentially malicious key: ${key}`);
        } else if (typeof obj[key] === "object") {
          sanitize(obj[key]);
        }
      });
    }
    return obj;
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
});

// Disable caching for API responses
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const authRoutes = require("./routes/auth.routes");
const itemsRoutes = require("./routes/items.routes");
const assignmentsRoutes = require("./routes/assignments.routes");
const livestockRoutes = require("./routes/livestock.routes");
const feedsRoutes = require("./routes/feeds.routes");
const usersRoutes = require("./routes/users.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const auditRoutes = require("./routes/audit.routes");
const locationsRoutes = require("./routes/locations.routes");
const maintenanceRoutes = require("./routes/maintenance.routes");
const reservationsRoutes = require("./routes/reservations.routes");
const approvalsRoutes = require("./routes/approvals.routes");
const reportsRoutes = require("./routes/reports.routes");
const exportRoutes = require("./routes/export.routes");
const suppliersRoutes = require("./routes/suppliers.routes");
const purchaseOrdersRoutes = require("./routes/purchaseOrders.routes");
const categoriesRoutes = require("./routes/categories.routes");
const stockTransfersRoutes = require("./routes/stockTransfers.routes");
const stockMovementsRoutes = require("./routes/stockMovements.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const productAssignmentsRoutes = require("./routes/productAssignments.routes");
const stockAdjustmentsRoutes = require("./routes/stockAdjustments.routes");
const initSwagger = require("./swagger");

// API routes
const API_PREFIX = "/api/v1";

// Apply rate limiting to auth routes
app.use(`${API_PREFIX}/auth/login`, authLimiter);
app.use(`${API_PREFIX}/auth/register`, authLimiter);

// Apply general rate limiting to all API routes
app.use(API_PREFIX, apiLimiter);

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/items`, itemsRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentsRoutes);
app.use(`${API_PREFIX}/livestock`, livestockRoutes);
app.use(`${API_PREFIX}/feeds`, feedsRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/audit`, auditRoutes);
app.use(`${API_PREFIX}/locations`, locationsRoutes);
app.use(`${API_PREFIX}/maintenance`, maintenanceRoutes);
app.use(`${API_PREFIX}/reservations`, reservationsRoutes);
app.use(`${API_PREFIX}/approvals`, approvalsRoutes);
app.use(`${API_PREFIX}/reports`, reportsRoutes);
app.use(`${API_PREFIX}/export`, exportRoutes);
app.use(`${API_PREFIX}/suppliers`, suppliersRoutes);
app.use(`${API_PREFIX}/purchase-orders`, purchaseOrdersRoutes);
app.use(`${API_PREFIX}/categories`, categoriesRoutes);
app.use(`${API_PREFIX}/stock-transfers`, stockTransfersRoutes);
app.use(`${API_PREFIX}/stock-movements`, stockMovementsRoutes);
app.use(`${API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${API_PREFIX}/product-assignments`, productAssignmentsRoutes);
app.use(`${API_PREFIX}/stock-adjustments`, stockAdjustmentsRoutes);

// Mount Swagger UI (only in non-production by default; enable in production with ENABLE_API_DOCS=true)
initSwagger(app, { apiPrefix: API_PREFIX });

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
