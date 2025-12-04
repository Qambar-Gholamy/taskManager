const jwt = require('jsonwebtoken');

exports.signToken = (user) => {
  // Usually include only unique info like id or email
  return jwt.sign(
    { id: user._id, email: user.email, password: user.password },
    //fix
    /// addition of name: user.name
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }, // token valid for 90 days
  );
};
