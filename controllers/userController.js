const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const docs = await User.find(req.body);

  // let docs;
  // if (req.body.role === 'intern') {
  //   docs = await User.find({ role: 'intern' });
  // } else if (req.body.role === 'trainer') {
  //   docs = await User.find({ role: 'trainer' });
  // }

  res.status(200).json({
    status: 'success',
    result: docs.length,
    data: docs,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const doc = await User.create(req.body);

  // hello worl
  res.status(201).json({
    status: 'success',
    data: doc,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  let query = User.findById(req.params.id);

  if (req.body.role === 'intern')
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
