const { validationResult } = require('express-validator');

const singUpDataValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  //   console.log(mappedErrors);
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    req.error ? req.error : {};
    req.error = { ...req.error, ...mappedErrors };
    next();
  }
};

// exports
module.exports = singUpDataValidationResult;
