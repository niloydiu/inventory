// Load environment variables first
require("dotenv").config();

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Import Express API
const express = require("express");
const apiRoutes = require("./server/app");
const expressApp = express();

// Mount API routes at /api/v1
expressApp.use(apiRoutes);

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      // Route API requests and health check to Express
      if (
        parsedUrl.pathname.startsWith("/api/v1") ||
        parsedUrl.pathname === "/health"
      ) {
        console.log(
          `[Server] Routing to Express: ${req.method} ${parsedUrl.pathname}`
        );
        
        // Forward the real client IP to Express
        // This is crucial for audit logging to capture the actual client IP
        if (!req.headers['x-forwarded-for']) {
          const clientIp = req.socket?.remoteAddress || req.connection?.remoteAddress;
          if (clientIp) {
            req.headers['x-forwarded-for'] = clientIp;
          }
        }
        
        return expressApp(req, res);
      }

      // Route everything else to Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`\n🚀 Ready on http://${hostname}:${port}`);
    console.log(`📊 API running on http://${hostname}:${port}/api/v1`);
    console.log(`🏥 Health check: http://${hostname}:${port}/health\n`);
  });
});
