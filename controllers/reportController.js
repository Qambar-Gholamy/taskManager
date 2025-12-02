const Report = require('../models/reportModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

exports.getAllReports = catchAsync(async (req, res) => {
  const { date } = req.query;

  let filter = {};
  if (date) {
    const selectedDate = new Date(date);
    const start = new Date(selectedDate.setHours(0, 0, 0, 0));
    const end = new Date(selectedDate.setHours(23, 59, 59, 999));
    filter.date = { $gte: start, $lte: end };
  }

  const reports = await Report.find(filter);

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: { reports },
  });
});

exports.searchReports = catchAsync(async (req, res, next) => {
  // Get the search query from frontend (e.g., ?q=searchText)
  const { q } = req.query;

  if (!q) {
    return next(new AppError('Please provide a search query', 400));
  }

  // Build regex for case-insensitive partial match
  const searchRegex = new RegExp(q, 'i');

  // Search across multiple fields
  const reports = await Report.find({
    $or: [
      { email: searchRegex },
      { user: searchRegex },
      { stack: searchRegex },
      { task: searchRegex },
      { report: searchRegex },
      { signIn: searchRegex },
      { signOut: searchRegex },
    ],
  });
  // .populate({
  //   path: 'user',
  //   match: { name: { $regex: q }, role: 'intern' },
  //   select: 'name email',
  // });

  const search = req.query.search;
  let query = [];

  if (mongoose.Types.ObjectId.isValid(search)) {
    query.push({ user: search });
  }

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: {
      reports,
    },
  });
});

exports.createReport = catchAsync(async (req, res) => {
  const reports = await Report.create(req.body);
  console.log('log report of the request', reports);

  res.status(200).json({
    status: 'success',
    reports,
  });
});

exports.getReport = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new AppError('no report found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: report,
  });
});

exports.updateReport = catchAsync(async (req, res, next) => {
  const newReport = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newReport) {
    return next(new AppError('no document found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: newReport,
    },
  });
});

exports.deleteReport = catchAsync(async (req, res, next) => {
  const doc = await Report.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('no document found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: ' ',
  });
});
