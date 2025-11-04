const Trainer = require('../models/trainerModel');
const userController = require('./userController');

exports.getAllTrainers = userController.getAllUsers(Trainer);
exports.createTrainer = userController.createUser(Trainer);
exports.getTrainer = userController.getUser(Trainer);
exports.updateTrainer = userController.updateUser(Trainer);
exports.deleteTrainer = userController.deleteUser(Trainer);
exports.signup = userController.signup(Trainer);
exports.login = userController.login(Trainer);
exports.protect = userController.protect(Trainer);
