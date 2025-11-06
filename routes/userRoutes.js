const express = require('express');
const userController = require('../controllers/userController');
const reportRoutes = require('./reportRoutes');
const authController = require('../controllers/authController');

const Router = express.Router();

/// for creating account
Router.route('/signup').post(authController.signup);
Router.post('/login', authController.login);

Router.use('/:UserId/reports', reportRoutes);

Router.route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

Router.route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(
    authController.restrictTo('trainer'),
    authController.protect,
    userController.deleteUser,
  );

module.exports = Router;
