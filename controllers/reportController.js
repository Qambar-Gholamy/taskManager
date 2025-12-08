const Report = require('../models/reportModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReports = catchAsync(async (req, res, next) => {
  // for pagination
  const page = parseInt(req.query?.page) || 1;
  const limit = parseInt(req.query?.limit) || 10;
  const skip = (page - 1) * limit;

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
        let: { internId: '$intern' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$internId'] } } },
          { $project: { name: 1, stack: 1, profilePhoto: 1 } },
        ],
        as: 'intern',
      },
    },
    { $unwind: '$intern' },

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

    {
      $match: {
        $or: [
          { 'intern.name': { $regex: s, $options: 'i' } },
          { 'intern.stack': { $regex: s, $options: 'i' } },
          { 'intern.profilePhoto': { $regex: s, $options: 'i' } },
          { 'trainer.name': { $regex: s, $options: 'i' } },
          { task: { $regex: s, $options: 'i' } },
          { report: { $regex: s, $options: 'i' } },
          { signIn: { $regex: s, $options: 'i' } },
          { signOut: { $regex: s, $options: 'i' } },
          { date: { $regex: s, $options: 'i' } },
        ],
      },
    },

    {
      $facet: {
        reports: [{ $sort: { date: -1 } }, { $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const reports = result[0].reports;
  const total = result[0].totalCount[0]?.count || 0;

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: { reports },
    page,
    limit,
    total,
  });
});

exports.myReports = catchAsync(async (req, res, next) => {
  const { date } = req.query;

  let filter = { intern: req.intern.id };
  if (date) {
    const selectedDate = new Date(date);
    const start = new Date(selectedDate.setHours(0, 0, 0, 0));
    const end = new Date(selectedDate.setHours(23, 59, 59, 999));
    filter.date = { $gte: start, $lte: end };
  }

  const reports = await Report.find(filter).populate('trainer', 'name');

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: { reports },
  });
});

exports.createReport = catchAsync(async (req, res) => {
  const internId = req.intern.id;
  req.body.intern = internId;
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
  const doc = await Report.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('no document found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: ' ',
  });
});
