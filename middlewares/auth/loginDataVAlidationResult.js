// dependencies
const { validationResult } = require('express-validator');
const createError = require('http-errors');

// login data validation result
const loginDataValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  // error formatting to object
  const mappedErrors = errors.mapped();

  //check errors occurred or not
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    try {
      res.render('pages/login', {
        user: req.body,
        error: mappedErrors,
      });
    } catch (error) {
      next(createError(500, 'Internal Server Error'));
    }
  }
};

// export
module.exports = loginDataValidationResult;
