// dependencies

const { check } = require('express-validator');

const newPasswordValidator = () => {
  return [
    check('password').notEmpty().withMessage('New password is required').trim(),
    //   .isStrongPassword()
    //   .withMessage('Password should be strong')

    // confirm password
    check('confirmPassword')
      .notEmpty()
      .withMessage('Password is required')
      .trim()
      .custom((value, { req }) => {
        if (!req.body.password) return true;
        if (value === req.body.password) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage('Password does not match'),
  ];
};

// export
module.exports = newPasswordValidator;
