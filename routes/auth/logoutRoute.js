// dependencies
const logoutRoute = require('express').Router();
const logout = require('../../controllers/auth/logout');

// logout current user
logoutRoute.get('/logout', logout);

// export
module.exports = logoutRoute;
