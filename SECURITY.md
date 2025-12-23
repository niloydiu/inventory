# Security Implementation Guide

## 🔒 Security Measures Implemented

This document outlines the comprehensive security measures implemented to protect the Farm Inventory Management System from common attacks and vulnerabilities.

---

## 1. Authentication Security

### Rate Limiting

- **Auth Endpoints**: Maximum 3 login attempts per 15 minutes
- **General API**: 60 requests per minute (production), 200 req/min (development)
- Automatic blocking with clear error messages

### Account Lockout Protection

- **Failed Login Tracking**: Monitors failed login attempts per user
- **Lockout Threshold**: Account locked after 5 failed attempts
- **Lockout Duration**: 30 minutes automatic lockout
- **Auto-unlock**: Automatically unlocks after lockout period expires
- **Progressive Warnings**: Shows remaining attempts before lockout

**Example:**

```
Failed login → "Invalid credentials. 4 attempt(s) remaining before account lockout."
5th failure → "Account locked for 30 minutes due to multiple failed attempts."
```

### Password Requirements

- Minimum 8 characters
- Must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Maximum 128 characters (prevents buffer overflow)

### Session Management

- **HTTP-only Cookies**: Prevents XSS access to auth tokens
- **Secure Cookies**: HTTPS-only in production
- **SameSite**: Protection against CSRF attacks
- **Token Expiry**: 24-hour JWT expiration

---

## 2. Input Validation & Sanitization

### NoSQL Injection Prevention

- **express-mongo-sanitize**: Removes `$` and `.` characters from user input
- **Validation Middleware**: Server-side validation using express-validator
- **Input Escaping**: HTML escaping to prevent XSS
- **Regex Validation**: Strict username patterns (alphanumeric + underscore/hyphen only)

### Request Body Limits

- **Auth Endpoints**: 1KB limit (prevents flooding with large payloads)
- **General Endpoints**: 10MB limit (reasonable for normal operations)
- **413 Error**: Clear "Request body too large" message

### Field Pollution Protection

- Only allowed fields accepted in login/register
- Extra fields rejected with error message
- Prevents parameter pollution attacks

---

## 3. Security Headers (Helmet.js)

Implemented security headers include:

- **Content-Security-Policy**: Prevents XSS and code injection
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **Strict-Transport-Security**: Forces HTTPS
- **X-XSS-Protection**: Legacy XSS protection

---

## 4. CORS Configuration

- **Development**: Allows all origins for local testing
- **Production**: Should be configured to specific domain
- **Credentials**: Enabled for cookie-based auth
- **Methods**: Restricted to necessary HTTP methods
- **Preflight**: Proper OPTIONS handling

---

## 5. Database Security

### Mongoose Schema Validation

- Type checking on all fields
- Enum validation for role fields
- Required field enforcement
- Unique constraints on username/email

### Password Storage

- **bcrypt Hashing**: Industry-standard password hashing
- **Salt Rounds**: 10 rounds (configurable)
- **Never Returned**: Password hash excluded from all queries by default

---

## 6. Logging & Monitoring

### Security Events Logged

- Failed login attempts with username
- Account lockouts with duration
- Sanitized malicious input attempts
- Rate limit violations
- Request body size violations

### What to Monitor

- Spike in failed login attempts (potential brute force)
- Multiple account lockouts (coordinated attack)
- High rate of sanitization events (injection attempts)
- 413 errors (flooding attempts)

---

## 7. Development vs Production

### Development Mode

- Shows sample credentials in login form placeholders
- More verbose error messages
- Higher rate limits (200 req/min)
- Detailed stack traces

### Production Mode

- No credential placeholders
- Generic error messages
- Stricter rate limits (60 req/min)
- No stack traces exposed
- Secure cookies enforced
- HTTPS required

---

## 🚨 Attack Scenarios & Protections

### 1. Brute Force Attack

**Attack**: Automated attempts to guess passwords

**Protection**:

- Rate limiting (3 attempts per 15 min)
- Account lockout after 5 failures
- Progressive attempt warnings
- 30-minute automatic lockout

---

### 2. NoSQL Injection

**Attack**: `{"username": {"$ne": null}, "password": {"$ne": null}}`

**Protection**:

- express-mongo-sanitize removes `$` operators
- Input validation rejects malformed data
- Mongoose schema validation
- Field pollution protection

---

### 3. Database Flooding

**Attack**: Sending massive payloads to fill database

**Protection**:

- 1KB body limit on auth endpoints
- Input length validation (max 50 chars for username)
- Rate limiting on all write operations
- Request validation before processing

---

### 4. Credential Stuffing

**Attack**: Using leaked credentials from other sites

**Protection**:

- Account lockout mechanism
- Rate limiting
- Strong password requirements
- Monitoring for suspicious patterns

---

### 5. XSS (Cross-Site Scripting)

**Attack**: Injecting malicious scripts

**Protection**:

- Input escaping/sanitization
- HTTP-only cookies
- Content-Security-Policy headers
- Output encoding

---

### 6. CSRF (Cross-Site Request Forgery)

**Attack**: Forcing authenticated users to execute unwanted actions

**Protection**:

- SameSite cookie attribute
- CORS configuration
- Origin checking

---

## 📊 Recommended Additional Measures

### For Production Deployment:

1. **Environment Variables**

   - Use strong, random JWT_SECRET (min 32 chars)
   - Never commit `.env` to version control
   - Rotate secrets regularly

2. **HTTPS**

   - Always use HTTPS in production
   - Redirect HTTP → HTTPS
   - Use HSTS headers

3. **MongoDB Atlas**

   - Enable IP whitelisting
   - Use strong database passwords
   - Enable audit logging
   - Regular backups

4. **Monitoring & Alerts**

   - Set up alerts for:
     - Multiple failed logins
     - Account lockouts
     - Unusual traffic patterns
   - Use logging service (e.g., LogRocket, Sentry)

5. **Change Default Credentials**

   - **IMPORTANT**: Change default admin password immediately
   - Current: `admin` / `admin123`
   - Use strong, unique passwords
   - Consider forcing password reset on first login

6. **Additional Security Layers**

   - Consider implementing 2FA/MFA
   - Add CAPTCHA after 2 failed attempts
   - Implement IP-based blocking
   - Add email verification
   - Session invalidation on password change

7. **Regular Security Audits**
   - Review access logs monthly
   - Update dependencies regularly
   - Security penetration testing
   - Code security reviews

---

## 🔧 Configuration

### Adjust Security Settings

**Rate Limiting** (`server/app.js`):

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Window
  max: 3, // Max attempts
});
```

**Account Lockout** (`server/controllers/auth.controller.js`):

```javascript
const MAX_FAILED_ATTEMPTS = 5; // Failures before lock
const LOCKOUT_DURATION_MINUTES = 30; // Lock duration
```

**Body Size Limits** (`server/app.js`):

```javascript
const authBodyLimit = "1kb"; // Auth endpoints
const generalBodyLimit = "10mb"; // Other endpoints
```

---

## ✅ Security Checklist

- [x] Rate limiting on auth endpoints
- [x] Account lockout mechanism
- [x] Input validation & sanitization
- [x] NoSQL injection protection
- [x] Password strength requirements
- [x] Secure session management
- [x] Security headers (Helmet)
- [x] CORS configuration
- [x] Request body size limits
- [x] Failed login tracking
- [x] Development-only credential hints
- [ ] Change default admin password (production)
- [ ] Configure production CORS origins
- [ ] Set up monitoring/alerts
- [ ] Enable 2FA (recommended)
- [ ] Add CAPTCHA (recommended)

---

## 📝 Security Best Practices

1. **Never expose credentials in production**

   - The placeholder credentials are hidden in production mode
   - `process.env.NODE_ENV === "development"` check implemented

2. **Regular Updates**

   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

3. **Principle of Least Privilege**

   - Users get minimum required permissions
   - Role-based access control
   - Regular permission audits

4. **Defense in Depth**
   - Multiple layers of security
   - No single point of failure
   - Redundant protections

---

## 🆘 Incident Response

If you suspect a security breach:

1. **Immediate Actions**

   - Lock affected accounts
   - Review audit logs
   - Check for unauthorized changes

2. **Investigation**

   - Identify attack vector
   - Assess damage scope
   - Collect evidence

3. **Remediation**

   - Patch vulnerabilities
   - Reset compromised credentials
   - Notify affected users

4. **Prevention**
   - Update security measures
   - Document incident
   - Improve monitoring

---

## 📞 Support

For security concerns or to report vulnerabilities:

- Email: security@farmtech.com
- Create a private security advisory on GitHub

**Do not disclose security vulnerabilities publicly.**

---

Last Updated: December 23, 2025
