// dependencies

const { check } = require('express-validator');

const newPasswordValidator = () => {
  return [
    check('password')
      .notEmpty()
      .withMessage('New password is required')
      .trim()
      .isStrongPassword(),
  ];
};
