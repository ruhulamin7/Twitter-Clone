// dependencies
const createError = require('http-errors');
const User = require('../../models/User');

// email confirmation function
const emailConfirmation = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { status: 'verified' } },
      { new: true }
    );
    if (result.status === 'verified') {
      res.render('pages/auth/thankyou', { title: 'Thank you' });
    } else {
      next(createError(500, 'Internal Server Error'));
    }
  } catch (error) {
    next(createError(500, 'Internal Server Error'));
  }
};

// export
module.exports = emailConfirmation;
