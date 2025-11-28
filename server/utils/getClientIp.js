/**
 * Extract the real client IP address from a request
 * Handles proxies, load balancers, and direct connections
 * 
 * @param {Object} req - Express request object
 * @returns {String} Client IP address
 */
function getClientIp(req) {
  // Check for X-Forwarded-For header (common with proxies/load balancers)
  // Take the first IP if multiple are present (original client)
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    const clientIp = ips[0];
    // Skip if it's just localhost
    if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1' && clientIp !== '::ffff:127.0.0.1') {
      return clientIp;
    }
  }

  // Check for X-Real-IP header (nginx proxy)
  const realIp = req.headers['x-real-ip'];
  if (realIp && realIp !== '::1' && realIp !== '127.0.0.1' && realIp !== '::ffff:127.0.0.1') {
    return realIp;
  }

  // Check for CF-Connecting-IP (Cloudflare)
  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp) {
    return cfIp;
  }

  // Check for True-Client-IP (Cloudflare Enterprise)
  const trueClientIp = req.headers['true-client-ip'];
  if (trueClientIp) {
    return trueClientIp;
  }

  // Check for X-Client-IP
  const xClientIp = req.headers['x-client-ip'];
  if (xClientIp) {
    return xClientIp;
  }

  // Fall back to req.ip (requires trust proxy setting)
  let ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  
  // Convert IPv6 localhost to IPv4 for consistency
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  // Remove IPv6 prefix if present
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  return ip || 'unknown';
}

module.exports = getClientIp;
