const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const internSchema = new mongoose.Schema({
  /// Full name
  name: {
    type: String,
    required: [true, 'Please provide full name for Internship'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  stack: {
    type: String,
    // required:[true,'please type the the working area or stack'],
    enum: {
      values: [
        'Front-end Developer',
        'Back-end Developer',
        'Full-stack Developer',
        'UX UI designer',
        'Mobile',
        'Media',
      ],
      message:
        'stack are either Front-end Developer,Full-stack Developer, Back-end Developer, UX UI designer, Mobile, and Media',
    },
  },
  profilePhoto: String,
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minlegth: 8,
    select: false,
  },

  // reports: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Report',
  // },

  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      messagge: 'Password should be the same.',
    },
    select: false,
  },
});

internSchema.set('toJSON', { virtuals: true });
internSchema.set('toObject', { virtuals: true });

/// virtual populate
internSchema.virtual('reports', {
  ref: 'Report',
  foreignField: 'intern',
  localField: '_id',
});

internSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

internSchema.methods.correctPassword = async function (
  condidatePassword,
  internPassword,
) {
  return await bcrypt.compare(condidatePassword, internPassword);
};

const Intern = mongoose.model('Intern', internSchema);

module.exports = Intern;
