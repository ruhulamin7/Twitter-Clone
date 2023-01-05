const createHttpError = require('http-errors');
const upload = require('multer-uploader');
const path = require('path');

function updateCoverPhoto(req, res, next) {
  try {
    const uploadDir = path.join(
      __dirname,
      `../../public/uploads/${req.userId}/cover/`
    );
    const maxFileSize = 10000000;
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
        next(err);
      } else {
        next();
      }
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
}

// exports
module.exports = updateCoverPhoto;
