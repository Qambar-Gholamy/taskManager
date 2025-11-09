const reportController = require('../controllers/reportController');
const express = require('express');
const Router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const authMiddleware = require('../utils/authMiddleware');

Router.use(authMiddleware);

Router.route('/')
  .get(reportController.getAllReports)
  .get(reportController.getReportsByDate)
  .post(reportController.createReport);

Router.route('/:id')
  .patch(reportController.updateReport)
  .get(reportController.getReport)
  .delete(reportController.deleteReport);
module.exports = Router;
