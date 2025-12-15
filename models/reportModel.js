const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
  {
    date: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now,
      get: (val) => val.toISOString().split('T')[0],
    },
    task: {
      type: String,
      required: [true, 'please write the title of your task'],
      trim: true,
      maxlength: [100, 'Task title should hava maximum 100 characters'],
    },
    report: {
      type: String,
      trim: true,
    },

    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      match: { role: 'trainer' },
    },
    signIn: {
      type: String,
      required: [true, 'Please provide the time (hour and minute)'],
      trim: true,
      // optional regex validation
      match: [
        /^(0?[1-9]|1[0-2]):([0-5][0-9])(\s?(AM|PM|am|pm))?$/,
        'Please enter a valid time format (e.g., 2:30 PM)',
      ],
    },
    signOut: {
      type: String,
      required: [true, 'Please provide the time (hour and minute)'],
      trim: true,
      match: [
        /^(0?[1-9]|1[0-2]):([0-5][0-9])(\s?(AM|PM|am|pm))?$/,
        'Please enter a valid time format (e.g., 2:30 PM)',
      ],
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);

reportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    model: 'User',
    select: 'name stack profilePhoto',
  });
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
