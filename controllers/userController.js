const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const sharp = require('sharp');
const { upload } = require('../utils/multerUpload');

exports.uploadImage = upload.single('profilePhoto');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `img-${parseInt(Math.random() * 1000000)}-${new Date().toISOString().split('T')[0]}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/${req.file.filename}`);

  next();
});

exports.getAllInterns = catchAsync(async (req, res, next) => {
  docs = await User.find({ role: 'intern' });

  res.status(200).json({
    status: 'success',
    result: docs.length,
    data: docs,
  });
});

exports.getAllTrainers = catchAsync(async (req, res, next) => {
  docs = await User.find({ role: 'trainer' });

  res.status(200).json({
    status: 'success',
    result: docs.length,
    data: docs,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const users = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  let query = await User.findById(req.params.id);

  if (req.params.role === 'intern')
    query = query.populate({
      path: 'reports',
      select: '-intern',
    });

  const user = await query;

  if (!user) {
    return next(new AppError('no user found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('no document found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('no document found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
