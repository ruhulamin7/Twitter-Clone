// dependencies
const createError = require('http-errors');

// not found handler
function notFoundHandler(req, res, next) {
  // res.status(404).send('404 Not Found');
  next(createError(404, 'Your Requested page was not found'));
}

// error handler
function errorHandler(err, req, res, next) {
  const error =
    process.env.NODE_ENV === 'development' ? err : { message: err.message };

  if (res.headersSent) {
    next(error);
  } else {
    try {
      res.locals.error = error;
      res.status(error.status || 500);
      if (res.locals.html) {
        res.render('pages/error.pug', {
          title: 'Error Occurred',
          error,
        });
      } else {
        res.json(error);
      }
    } catch (error) {
      next(error);
    }
  }
}

// exports
module.exports = {
  errorHandler,
  notFoundHandler,
};
