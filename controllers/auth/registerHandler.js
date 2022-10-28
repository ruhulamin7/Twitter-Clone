const createError = require('http-errors');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../../utils/sendEmail');

// register controller
const registerHandler = async (req, res, next) => {
  console.log(process.env.HASH_ROUNDS);
  try {
    if (Object.keys(req.error ? req.error : {}).length !== 0) {
      res.render('pages/register', { user: req.body, error: req.error });
    } else {
      const userObj = new User({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        userAvatar: req.file?.filename ? req.file.filename : 'No-Image',
        // userAvatar: req.file.filename,
      });
      const user = await userObj.save();
      if (user._id) {
        sendEmail(
          [user.email],
          {
            subject: 'Verify your twitter-clone account',
            template: `Verification link:${process.env.APP_URL}/emailConfirmation/${user._id}`,
            attachments: [],
          },
          (err, info) => {
            if (!err && info) {
              return res.render('pages/auth/confirmation', {
                email: user.email,
                title: `Confirmation - ${process.env.APP_NAME}`,
              });
            } else {
              next(createError(500, 'Internal Server Error!'));
            }
          }
        );
      }
      //   res.send(user);
    }
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = registerHandler;
