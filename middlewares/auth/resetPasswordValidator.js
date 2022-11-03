const { check } = require('express-validator');
const createHttpError = require('http-errors');
const User = require('../../models/User');

const resetPasswordValidator = () => {
  return [
    check('email')
      .notEmpty()
      .withMessage('Username or email is required')
      .trim()
      .toLowerCase()
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne(
            { $or: [{ username: value }, { email: value }] },
            { email: 1 }
          );
          if (user) {
            req.email = user.email;
            req.userId = user._id;
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        } catch (error) {
          throw createHttpError(500, error);
        }
      })
      .withMessage('User not found'),
  ];
};

// exports
module.exports = resetPasswordValidator;
