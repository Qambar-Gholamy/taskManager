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
