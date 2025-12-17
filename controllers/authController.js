const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/signToken');
const User = require('../models/userModel');
const { Error } = require('mongoose');

/// sign up and creating account
exports.signup = catchAsync(async (req, res) => {
  const { stack, name, email, password, role } = req.body;

  // 1. Validate input
  if (!stack || !name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  const profilePhoto = req.file
    ? req.file.cloudinary.url
    : `/public/imgs/default.jpeg`;

  try {
    newUser = await User.create({
      name,
      email,
      password,
      profilePhoto,
      stack,
      role,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }
    throw err;
  }

  // 3. Create token
  const token = signToken(newUser);

  // 4. Send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // 1. Check if email and password exist
  if (!email || !password) {
    return res
    .status(400)
    .json({ message: 'Please provide email and password' });
  }
  
  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
 
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  
  // 3. Create token
  const token = signToken(user);

  // 4. Send token
  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});
