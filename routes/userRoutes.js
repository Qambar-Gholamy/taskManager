const express = require('express');
const userController = require('../controllers/userController');
const reportRoutes = require('./reportRoutes');
const authController = require('../controllers/authController');
const authMiddleware = require('../utils/authMiddleware');

const Router = express.Router();

Router.route('/signup').post(authController.signup);
Router.post('/login', authController.login);

Router.use(authMiddleware);
Router.use('/:UserId/reports', reportRoutes);
Router.route('/').post(userController.createUser);
Router.route('/interns').get(userController.getAllInterns);
Router.route('/trainers').get(userController.getAllTrainers);
Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.restrictTo('trainer'), userController.deleteUser);

module.exports = Router;
