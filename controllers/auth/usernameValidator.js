const User = require('../../models/User');

async function usernameValidator(req, res, next) {
  const username = req.params.username;
  const user = await User.find({ username: username });
  res.send(user);
}

module.exports = usernameValidator;
