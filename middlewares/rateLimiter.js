const rateLimit = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests, please try again later',
} = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const current = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (current.resetAt <= now) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    hits.set(key, current);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(max - current.count, 0));

    if (current.count > max) {
      return res.status(429).json({ error: message });
    }

    return next();
  };
};

module.exports = rateLimit;
