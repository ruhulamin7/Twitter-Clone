// dependencies
const { check } = require('express-validator');
const createError = require('http-errors');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

// sign in data validation
const loginDataValidator = () => {
  return [
    //check username or email
    check('email')
      .notEmpty()
      .withMessage('Username or email is required')
      .toLowerCase()
      .trim()
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({
            $or: [{ email: value }, { username: value }],
          });
          if (user) {
            req.email = user.email;
            req.username = user.username;
            req.password = user.password;
            req.userId = user._id;
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        } catch (error) {
          throw createError(500, error);
        }
      })
      .withMessage('User was not found!'),

    //check password
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom(async (password, { req }) => {
        if (!req.password) return true;
        try {
          //check password is valid or not
          const isValidPassword = await bcrypt.compare(password, req.password);
          if (isValidPassword) {
            req.isValidUser = true;
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        } catch (error) {
          throw createError(500, error);
        }
      })
      .withMessage('Wrong password!, Please try again'),
  ];
};

// exports
module.exports = loginDataValidator;
