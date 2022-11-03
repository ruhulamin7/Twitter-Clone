const createHttpError = require('http-errors');

const getResetPasswordPage = (req, res, next) => {
  try {
    res.render('pages/auth/resetPassword', { error: {}, user: {} });
  } catch (error) {
    next(createHttpError(500, error));
  }
};
// export
module.exports = getResetPasswordPage;
