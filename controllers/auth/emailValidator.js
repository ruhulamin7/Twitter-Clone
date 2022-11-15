const User = require('../../models/User');

async function emailValidator(req, res, next) {
  const email = req.params.email;
  const user = await User.find({ email: email });
  res.send(user);
}

module.exports = emailValidator;
