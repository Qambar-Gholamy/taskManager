const reportController = require('../controllers/reportController');
const internController = require('../controllers/internController');
const trainerController = require('../controllers/trainerController');
const express = require('express');
const Router = express.Router({ mergeParams: true });

Router.route('/')
  .get(reportController.getAllReports)
  .post(internController.protect, reportController.createReport);

Router.get('/:id', internController.protect, reportController.getReport);

Router.route('/:id').patch(
  internController.protect,
  reportController.updateReport,
);
Router.route('/:id').delete(
  internController.protect,
  reportController.deleteReport,
);
module.exports = Router;
