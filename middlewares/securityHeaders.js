const { isProduction } = require('../config/env');

// This service is a JSON API (it does not render HTML), so a tight CSP that
// disallows any embedded resources is safe and acts as defense-in-depth.
const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  // This API is consumed by separate frontend/dashboard origins, so the
  // response must be readable cross-origin. ('same-site' would break those
  // credentialed CORS requests.)
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // Hide the Express fingerprint.
  res.removeHeader('X-Powered-By');

  // Only advertise HSTS over HTTPS in production to avoid breaking local http.
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

module.exports = securityHeaders;
