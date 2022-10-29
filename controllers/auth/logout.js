// logout function
const Event = require('events');
const myEmitter = new Event();
const logout = (req, res) => {
  res.clearCookie('access_token');
  res.redirect('/');
};

// exports
module.exports = logout;
