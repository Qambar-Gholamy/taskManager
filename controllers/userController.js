const JWT = require('jsonwebtoken');
const { promisify } = require('util');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const authController = require('./authController');

exports.getAllUsers = (User) =>
  catchAsync(async (req, res, next) => {
    const query = { ...req.body };
    const docs = await User.find(query.id);

    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: docs,
    });
  });

exports.createUser = (User) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getUser = (User, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = User.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('no document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.updateUser = (User) =>
  catchAsync(async (req, res, next) => {
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

exports.deleteUser = (User) =>
  catchAsync(async (req, res, next) => {
    const doc = await User.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('no document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

/// sign up and creating account
exports.signup = (User) =>
  catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    authController.createSendToken(newUser, 201, res);
  });

exports.login = (User) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('please enter an email and password', 400));
    }

    const user = await User.findOne({ email }).select('password');
    console.log(password, user.password);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('incorrect email or password!', 401));
    }

    authController.createSendToken(user, 200, res);
  });

exports.protect = (User) =>
  catchAsync(async (req, res, next) => {
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
        new AppError(
          'you are not logged in please log in to get accessed!',
          401,
        ),
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
