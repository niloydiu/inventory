// Vercel Serverless Function for API routes
const app = require('../server/app');

// Vercel serverless function handler
module.exports = (req, res) => {
  // Forward client IP address from Vercel/Next.js to Express
  // This ensures audit logs capture the real client IP, not the proxy IP
  if (!req.headers['x-forwarded-for']) {
    // Get real client IP from Vercel headers or connection
    const clientIp = req.headers['x-real-ip'] || 
                    req.headers['x-vercel-forwarded-for'] ||
                    req.connection?.remoteAddress || 
                    req.socket?.remoteAddress;
    
    if (clientIp) {
      req.headers['x-forwarded-for'] = clientIp;
    }
  }
  
  // Let Express handle the request
  return app(req, res);
};
