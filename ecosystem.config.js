/**
 * PM2 Ecosystem Configuration
 * Manages both Express.js API and Next.js Frontend as separate processes
 * 
 * Usage:
 *   pm2 start ecosystem.config.js        # Start both apps
 *   pm2 stop ecosystem.config.js         # Stop both apps
 *   pm2 restart ecosystem.config.js      # Restart both apps
 *   pm2 delete ecosystem.config.js       # Delete both apps
 *   pm2 logs                             # View logs from both apps
 *   pm2 monit                            # Monitor both apps
 */

module.exports = {
  apps: [
    {
      name: "inventory-api",
      script: "server/index.js",
      instances: 1,
      exec_mode: "fork",
      // Environment variables will be loaded from .env file
      // via dotenv.config() in server/index.js
      error_file: "./logs/api-error.log",
      out_file: "./logs/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
    {
      name: "inventory-frontend",
      script: "next-server.js",
      instances: 1,
      exec_mode: "fork",
      // Environment variables will be loaded from .env file
      // via dotenv.config() in next-server.js
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Wait for Next.js to build
      wait_ready: true,
      listen_timeout: 30000,
    },
  ],
};

