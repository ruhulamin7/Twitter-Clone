const createError = require('http-errors');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../../utils/sendEmail');
const fs = require('fs');
const path = require('path');
// require('dotenv').config();

// register controller
const registerHandler = async (req, res, next) => {
  try {
    if (Object.keys(req.error ? req.error : {}).length !== 0) {
      res.render('pages/register', { user: req.body, error: req.error });
    } else {
      const userObj = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        userAvatar: req.file?.filename ? req.file.filename : '',
        status: 'unverified',
        likes: [],
        retweets: [],
      });
      const user = await userObj.save();
      if (user.userAvatar) {
        fs.mkdirSync(
          path.join(__dirname, `../../public/uploads/${user._id}/profile/`),
          {
            recursive: true,
          }
        );

        fs.renameSync(
          path.join(__dirname, `../../temp/${user.userAvatar}`),
          path.join(
            __dirname,
            `../../public/uploads/${user._id}/profile/${user.userAvatar}`
          )
        );
      }

      // send email to user for email confirmation
      if (user._id) {
        sendEmail(
          [user.email],
          {
            subject: 'Verify your twitty account',
            template: `Verification link:${process.env.APP_URL}/email-confirmation/${user._id}`,
            attachments: [],
          },
          (err, info) => {
            if (!err && info) {
              return res.render('pages/auth/emailConfirmation', {
                email: user.email,
                title: `Confirmation - ${process.env.APP_NAME}`,
              });
            } else {
              next(createError(500, err));
            }
          }
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = registerHandler;
