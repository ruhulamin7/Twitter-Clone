// dependencies
const createHttpError = require('http-errors');
const User = require('../../models/User');

// get home page
const getHomePage = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    console.log(user);
    return res.render('pages/home', { user: user ? user : {} });
  } catch (error) {
    next(createHttpError(500, error));
  }
};
// exports
module.exports = getHomePage;
