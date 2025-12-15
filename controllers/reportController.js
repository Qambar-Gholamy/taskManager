const Report = require('../models/reportModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReports = catchAsync(async (req, res, next) => {
  // for pagination
  // const paquery?ge = parseInt(req.query?.page) || 1;
  // const limit = parseInt(req..limit) || 10;
  // const skip = (page - 1) * limit;

  // date filter
  const { date } = req.query;
  let selectedDate;
  let filter = {};

  if (date) {
    selectedDate = new Date(date);
  } else {
    selectedDate = new Date();
  }

  const start = new Date(selectedDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(selectedDate);
  end.setHours(23, 59, 59, 999);
  filter.date = { $gte: start, $lte: end };

  const s = (req.query.s || '').toString();

const result = await Report.aggregate([
  {
    $lookup: {
      from: 'users',
      let: { creatorId: '$creator' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$creatorId'] } } },
        { $project: { name: 1, stack: 1, profilePhoto: 1 } },
      ],
      as: 'creator',
    },
  },
  { $unwind: { path: '$creator', preserveNullAndEmptyArrays: true } },

  {
    $lookup: {
      from: 'users',
      let: { trainerId: '$trainer' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$trainerId'] } } },
        { $project: { name: 1 } },
      ],
      as: 'trainer',
    },
  },
  { $unwind: { path: '$trainer', preserveNullAndEmptyArrays: true } },

  { $match: filter },
  { $sort: { date: -1 } },

  {
    $match: {
      $or: [
        { 'creator.name': { $regex: s, $options: 'i' } },
        { 'creator.stack': { $regex: s, $options: 'i' } },
        { 'trainer.name': { $regex: s, $options: 'i' } },
        { task: { $regex: s, $options: 'i' } },
        { report: { $regex: s, $options: 'i' } },
        { signIn: { $regex: s, $options: 'i' } },
        { signOut: { $regex: s, $options: 'i' } },
      ],
    },
  },
]);

  // const reports = result[0].reports;
  // const total = result[0].totalCount[0]?.count || 0;

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: { result },
    // page,
    // limit,
    // total,
  });
});

exports.myReports = catchAsync(async (req, res, next) => {
  const { date } = req.query;
   const dateSort = {date: -1  };

  let filter = { creator: req.user.id };
  if (date) {
    const selectedDate = new Date(date);
    const start = new Date(selectedDate.setHours(0, 0, 0, 0));
    const end = new Date(selectedDate.setHours(23, 59, 59, 999));
    filter.date = { $gte: start, $lte: end};
  }

  const reports = await Report.find(filter).sort(dateSort).populate('trainer');

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: { reports },
  });
});

exports.createReport = catchAsync(async (req, res) => {
  const creatorId = req.user.id;
  req.body.creator = creatorId;
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
  req.body.intern = req.intern;
  const newReport = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('trainer', 'name');

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
  const doc = await Report.findOneAndDelete({
    _id: req.body.id,
    creator: req.user.id
  });

  if (!doc) {
    return next(new AppError('no document found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: ' ',
  });
});
