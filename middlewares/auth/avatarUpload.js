const upload = require('multer-uploader');
const path = require('path');

function avatarUpload(req, res, next) {
  const uploadDir = path.join(__dirname, '../../temp/');
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
  ).single('profileAvatar');

  uploadFunction(req, res, (err) => {
    if (err) {
      const error = {
        profileAvatar: {
          msg: err.message,
        },
      };
      req.error = error;
      next();
    } else {
      next();
    }
  });
}

// exports
module.exports = avatarUpload;
