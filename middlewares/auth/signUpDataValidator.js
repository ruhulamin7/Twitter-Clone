const { check } = require('express-validator');
const User = require('../../models/User');

const signUpDataValidator = () => {
  return [
    // firstName validation
    check('firstName').notEmpty().withMessage('First name is required').trim(),
    // lastName validation
    check('lastName').notEmpty().withMessage('Last name is required').trim(),
    // username validation
    check('username')
      .notEmpty()
      .withMessage('Username is required')
      .trim()
      .toLowerCase()
      .custom(async (value, { req }) => {
        try {
          const username = await User.findOne(
            { username: value },
            { username: 1 }
          );
          if (username) {
            return Promise.reject();
          } else {
            return Promise.resolve();
          }
        } catch (error) {
          next(error);
        }
      })
      .withMessage('Username is already taken'),
    // email validation
    check('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .trim()
      .toLowerCase()
      .custom(async (value, { req }) => {
        try {
          const email = await User.findOne({ email: value }, { email: 1 });
          if (email) {
            return Promise.reject();
          } else {
            return Promise.resolve();
          }
        } catch (error) {
          next(error);
        }
      })
      .withMessage('Email is already in use'),
    // password validation
    check('password').notEmpty().withMessage('Password is required'),
    // .isStrongPassword()
    // .withMessage('Password should be strong'),

    // confirm password validation
    check('confirmPassword')
      .notEmpty()
      .withMessage('Confirm password is required')
      .custom((value, { req }) => {
        const password = req.body.password;

        if (password !== value) {
          return false;
        } else {
          return true;
        }
      })
      .withMessage("Password does't match"),
  ];
};

// exports
module.exports = signUpDataValidator;
