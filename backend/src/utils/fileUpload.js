const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new Error('Only PNG and JPG files are allowed'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
