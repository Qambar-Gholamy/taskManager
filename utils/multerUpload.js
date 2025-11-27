const multer = require('multer');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image!, upload only images', 400), false);
  }
};
exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter });
