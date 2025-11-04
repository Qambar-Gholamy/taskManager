const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const trainerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your full name'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minlength: 8,
    select: false,
  },

  // passwordConfirm: {
  //   type: String,
  //   required: [true, 'please confirm your password.'],
  //   validate: {
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     messagge: 'Password should be the same.',
  //   },
  //   select: false,
  // },
});

trainerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

trainerSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
