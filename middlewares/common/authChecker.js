// dependencies
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');

// authentication check
const authChecker = async (req, res, next) => {
  try {
    if (req?.signedCookies?.access_token) {
      const token = req.signedCookies.access_token.split(' ')[1];
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      const { username, userId } = decode;
      req.username = username;
      req.userId = userId;
      if (req.originalUrl === '/login' || req.originalUrl === '/register') {
        return res.redirect('/');
      }
      next();
    } else {
      if (req.originalUrl === '/register') {
        res.render('pages/register', { user: {}, error: {} });
      } else {
        res.render('pages/login', { user: {}, error: {} });
      }
    }
  } catch (error) {
    if (error.message === 'jwt expired') {
      if (req.originalUrl === '/register') {
        res.render('pages/register', { error: {}, user: {} });
      } else {
        res.render('pages/login', { error: {}, user: {} });
      }
    }
    next(createHttpError(401, error));
  }
};

// exports
module.exports = authChecker;
