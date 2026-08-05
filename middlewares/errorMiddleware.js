const notFound = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : err.message,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
