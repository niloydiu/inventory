const pool = require('../config/database');

const auditLog = (action, resourceType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      res.send = originalSend;
      
      // Only log successful requests
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const logEntry = {
          user_id: req.user?.user_id || null,
          action,
          resource_type: resourceType,
          resource_id: req.params.id || null,
          details: JSON.stringify({
            method: req.method,
            path: req.path,
            body: req.body
          }),
          ip_address: req.ip || req.connection.remoteAddress
        };

        pool.query(
          `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [logEntry.user_id, logEntry.action, logEntry.resource_type, logEntry.resource_id, logEntry.details, logEntry.ip_address]
        ).catch(err => console.error('Audit log error:', err));
      }

      return res.send(data);
    };

    next();
  };
};

module.exports = auditLog;
