const express = require('express');
const trainerController = require('../controllers/trainerController');
const internController = require('../controllers/internController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/signup').post(trainerController.signup);
Router.post('/login', trainerController.login);

Router.route('/')
  .get(
    // authController.restrictTo('admin'),
    trainerController.getAllTrainers,
  )
  .post(trainerController.createTrainer);

Router.route('/:id')
  .get(trainerController.protect, trainerController.getTrainer)
  .patch(trainerController.protect, trainerController.updateTrainer)
  .delete(
    // authController.restrictTo('admin'),
    trainerController.protect,
    trainerController.deleteTrainer,
  );

module.exports = Router;
