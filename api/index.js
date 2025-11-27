// Vercel Serverless Function for API routes
const app = require('../server/app');

// Vercel serverless function handler
module.exports = (req, res) => {
  // Let Express handle the request
  return app(req, res);
};
