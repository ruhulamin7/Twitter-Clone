const User = require('../../models/User');
const hashPassword = require('../../utils/hashPassword');

// register controller
const registerHandler = async (req, res, next) => {
  try {
    if (req.error) {
      res.render('pages/register', { user: req.body, error: req.error });
    } else {
      const user = new User({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        userName: req.body.userName,
        email: req.body.email,
        password: await hashPassword(req.body.password),
        userAvatar: req.file?.filename ? req.file.filename : 'No-Image',
        // userAvatar: req.file.filename,
      })()();
      const result = await user.save();
      res.send(result);
    }
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = registerHandler;
