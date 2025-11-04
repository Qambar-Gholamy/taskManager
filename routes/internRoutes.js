const express = require('express');
const internController = require('../controllers/internController');
const reportRoutes = require('./roportRoutes');
const authController = require('../controllers/authController');

const Router = express.Router();

/// for creating account
Router.route('/signup').post(internController.signup);
Router.post('/login', internController.login);

Router.use('/:internId/reports', reportRoutes);

Router.route('/')
  .get(
    // authController.restrictTo('admin'),

    internController.getAllInterns,
  )
  .post(internController.createIntern);

Router.route('/:id')
  .get(internController.protect, internController.getIntern)
  .patch(internController.protect, internController.updateIntern)
  .delete(
    // authController.restrictTo('admin'),
    internController.protect,
    internController.deleteIntern,
  );

module.exports = Router;
