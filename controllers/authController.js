const { promisify } = require('util');
const JWT = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const createToken = require('../utils/createToken');
const User = require('../models/userModel');

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError('you don not have the permission', 403));
    }
    next();
  };

/// sign up and creating account
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please enter an email and password', 400));
  }

  const user = await User.findOne({ email }).select('password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    console.log('password:', password, 'user.password: ', user.password);
    return next(new AppError('incorrect email or password!', 401));
  }

  createToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  /// getting token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('you are not logged in please log in to get accessed!', 401),
    );
  }

  /// verifiction of the token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  /// check user exitence
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'the person that the token belongs to does no longer exist.',
        401,
      ),
    );
  }

  /// grant access
  req.user = currentUser;

  next();
});
