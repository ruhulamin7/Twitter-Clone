const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');

// reset password validation result
const resetPasswordValidationResult = (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      try {
        res.render('pages/auth/resetPassword', {
          error: mappedErrors,
          user: req.body,
        });
      } catch (error) {
        next(createError(500, 'Internal Server Error'));
      }
    }
  } catch (error) {
    next(createHttpError(500, error));
  }
};

// exports
module.exports = resetPasswordValidationResult;
