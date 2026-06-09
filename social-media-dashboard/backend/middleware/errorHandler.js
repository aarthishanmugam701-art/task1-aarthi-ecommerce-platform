exports.errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};
