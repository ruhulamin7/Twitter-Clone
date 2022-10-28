// dependencies
const createError = require('http-errors');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

// login handler
const testLoginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.render('pages/login', {
        error: { userError: 'Username or email is required' },
      });
    }
    if (!password) {
      res.render('pages/login', {
        user: req.body,
        error: { passwordError: 'Password is required' },
      });
    }

    if (email && password) {
      const result = await User.findOne({
        $or: [{ email: email }, { username: email }],
      });
      if (result) {
        const isValidPassword = await bcrypt.compare(password, result.password);
        if (
          isValidPassword &&
          result.status === 'verified' &&
          (result.email === email || result.username === email)
        ) {
          res.send('Login successful!');
        } else {
          res.render('pages/login', {
            user: req.body,
            error: { passwordError: 'Wrong password!' },
          });
        }
      } else {
        res.render('pages/login', {
          user: req.body,
          error: { userError: 'User not found' },
        });
      }
    } else {
      next(createError(500, 'Internal Server Error'));
    }
  } catch (error) {
    next(createError(500, error));
  }
};

// export
module.exports = testLoginHandler;
