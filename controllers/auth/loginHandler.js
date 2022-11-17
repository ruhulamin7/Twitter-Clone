// dependencies
const createError = require('http-errors');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// login handler
const loginHandler = async (req, res, next) => {
  try {
    if (req.isValidUser) {
      const token = await jwt.sign(
        {
          username: req.username,
          userId: req.userId,
          email: req.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
      // send cookie
      res.status(200);
      res.cookie('access_token', 'Bearer ' + token, { signed: true });
      res.redirect('/');
    }
  } catch (error) {
    next(createError(500, error));
  }
};

// export
module.exports = loginHandler;
