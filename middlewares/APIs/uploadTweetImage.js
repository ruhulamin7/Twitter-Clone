const createHttpError = require('http-errors');
const upload = require('multer-uploader');
const path = require('path');

function uploadTweetImage(req, res, next) {
  try {
    const uploadDir = path.join(
      __dirname,
      `../../public/uploads/${req.userId}/tweets`
    );
    const maxFileSize = 1000000;
    const allowedMimeTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
    ];
    const uploadFunction = upload(
      uploadDir,
      maxFileSize,
      allowedMimeTypes
    ).any();

    uploadFunction(req, res, (err) => {
      if (err) {
        // const error = {
        //   multerError: {
        //     msg: err.message,
        //   },
        // };
        // return res.render('pages/home', error);
        console.log(err);
      } else {
        next();
      }
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
}

// exports
module.exports = uploadTweetImage;
