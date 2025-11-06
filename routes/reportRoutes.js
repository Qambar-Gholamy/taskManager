const reportController = require('../controllers/reportController');
const express = require('express');
const Router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');

Router.route('/')
  .get(reportController.getAllReports)
  .post(authController.protect, reportController.createReport);

Router.get('/:id', authController.protect, reportController.getReport);

Router.route('/:id').patch(
  authController.protect,
  reportController.updateReport,
);
Router.route('/:id').delete(
  authController.protect,
  reportController.deleteReport,
);
module.exports = Router;
