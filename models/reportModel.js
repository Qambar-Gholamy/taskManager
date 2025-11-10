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
      minlength: [10, 'Task title should have at least 5 characters'],
    },
    report: {
      type: String,
      trim: true,
      // required: [true, 'A task should have a description'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A task should have a user id'],
    },
    // trainer: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Report',
    //   required: [true, 'please enter the name of the mentor'],
    // },
    signIn: {
      type: String,
      required: [true, 'Please provide the time (hour and minute)'],
      trim: true,
      // optional regex validation
      match: [
        /^([0-1]?[0-2]):[0-5][0-9](\s?(AM|PM|am|pm))?$/,
        'Please enter a valid time format (e.g., 2:30 PM)',
      ],
    },
    signOut: {
      type: String,
      required: [true, 'Please provide the time (hour and minute)'],
      trim: true,
      match: [
        /^([0-1]?[0-2]):[0-5][0-9](\s?(AM|PM|am|pm))?$/,
        'Please enter a valid time format (e.g., 2:30 PM)',
      ],
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  },
);
// Auto populate intern name and stack
reportSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name stack',
  });
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
