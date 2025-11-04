const Intern = require('../models/InternModel');
const userController = require('./userController');

exports.getAllInterns = userController.getAllUsers(Intern);
exports.createIntern = userController.createUser(Intern);
exports.getIntern = userController.getUser(Intern, {
  path: 'reports',
  select: '-intern',
});
exports.updateIntern = userController.updateUser(Intern);
exports.deleteIntern = userController.deleteUser(Intern);
exports.signup = userController.signup(Intern);
exports.login = userController.login(Intern);
exports.protect = userController.protect(Intern);
