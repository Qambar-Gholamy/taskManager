//** eslint-ignore */ 
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const { cloudinary }=require('../utils/imageUpload');
const Report = require('../models/reportModel');
const multer= require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadImage =upload.single('profilePhoto');

exports.cloudinaryUpload= catchAsync(async (req, res, next) => {
  if (!req.file) return next();
   const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "profiles",
        format: "jpg",
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "auto" },
          { quality: "auto", fetch_format: "auto" }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    ).end(req.file.buffer);
  });

  req.file.cloudinary = {
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
  };

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
  let user = await User.findById(req.params.id);

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
