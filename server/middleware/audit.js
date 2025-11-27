const { AuditLog } = require('../models');

const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      res.send = originalSend;
      
      // Only log successful requests
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const logEntry = {
          user_id: req.user?.user_id || null,
          username: req.user?.username || 'anonymous',
          action,
          entity_type: entityType,
          entity_id: req.params.id || null,
          details: {
            method: req.method,
            path: req.path,
            body: req.body
          },
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('user-agent')
        };

        AuditLog.create(logEntry)
          .catch(err => console.error('Audit log error:', err));
      }

      return res.send(data);
    };

    next();
  };
};

module.exports = auditLog;
