const reportController = require('../controllers/reportController');
const express = require('express');
const Router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const authMiddleware = require('../utils/authMiddleware');

Router.use(authMiddleware);

Router.route('/')
  .get(reportController.getAllReports)
  .post(reportController.createReport);

Router.get('/search', reportController.searchReports);

Router.route('/:id')
  .get(reportController.getReport)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);
module.exports = Router;
