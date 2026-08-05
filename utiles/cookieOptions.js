const { isProduction } = require('../config/env');

const sevenDays = 7 * 24 * 60 * 60 * 1000;

const authCookieOptions = (expires = new Date(Date.now() + sevenDays)) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  expires,
  path: '/',
});

const clearAuthCookieOptions = () => authCookieOptions(new Date(0));

module.exports = {
  authCookieOptions,
  clearAuthCookieOptions,
};
