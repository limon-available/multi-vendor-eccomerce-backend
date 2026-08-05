const { isProduction } = require('../config/env');

/**
 * Lightweight leveled logger.
 *
 * - error/warn are always emitted (operational signals you want in prod logs).
 * - info/debug are silenced in production to keep logs clean and avoid leaking
 *   request data. Swap the sinks here for Winston/Pino later without touching callers.
 */
const timestamp = () => new Date().toISOString();

const logger = {
  error(...args) {
    console.error(`[${timestamp()}] [error]`, ...args);
  },
  warn(...args) {
    console.warn(`[${timestamp()}] [warn]`, ...args);
  },
  info(...args) {
    if (!isProduction) {
      console.log(`[${timestamp()}] [info]`, ...args);
    }
  },
  debug(...args) {
    if (!isProduction) {
      console.log(`[${timestamp()}] [debug]`, ...args);
    }
  },
};

module.exports = logger;
