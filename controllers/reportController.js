const Report = require('../models/reportModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReports = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.internId) filter = { intern: req.params.internId };

  const reports = await Report.find(filter);

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: { reports },
  });
});

exports.getReportsByDate = catchAsync(async (req, res, next) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a date in the query, e.g. ?date=2025-01-12',
    });
  }

  // Parse and normalize the date
  const selectedDate = new Date(date);

  if (isNaN(selectedDate)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid date format. Please use YYYY-MM-DD format.',
    });
  }

  // Define start and end of that day
  const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

  // Fetch reports within that date range
  const reports = await Report.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  });

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
