const reportController = require('../controllers/reportController');
const express = require('express');
const Router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');
const authMiddleware = require('../utils/authMiddleware');

Router.use(authMiddleware);

Router.route('/')
  .get(reportController.getAllReports)
  .post(reportController.createReport);

//get report my self has many type of query like date
Router.route('/myreports').get(reportController.myReports);

Router.route('/:id')
  .get(reportController.getReport)
  .delete(reportController.deleteReport)
  .patch(reportController.updateReport);
  
module.exports = Router;
