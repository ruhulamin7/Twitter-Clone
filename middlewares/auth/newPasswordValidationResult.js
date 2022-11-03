// dependencies

const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');

const newPasswordValidationResult = (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.render('pages/auth/createNewPassword', {
        error: mappedErrors,
        user: req.body,
      });
    }
  } catch (error) {
    next(createHttpError(500, error));
  }
};

// export
module.exports = newPasswordValidationResult;
