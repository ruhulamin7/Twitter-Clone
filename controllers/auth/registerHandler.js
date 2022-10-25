const createError = require('http-errors');
const User = require('../../models/User');
const hashPassword = require('../../utils/hashPassword');
const sendEmail = require('../../utils/sendEmail');

// register controller
const registerHandler = async (req, res, next) => {
  try {
    if (req.error) {
      res.render('pages/register', { user: req.body, error: req.error });
    } else {
      const userObj = new User({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        userName: req.body.userName,
        email: req.body.email,
        password: await hashPassword(req.body.password),
        userAvatar: req.file?.filename ? req.file.filename : 'No-Image',
        // userAvatar: req.file.filename,
      });
      const user = await userObj.save();
      if (user._id) {
        console.log(user._id);
        sendEmail(
          [user.email],
          {
            subject: 'Verify your email',
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
