const emailConfirmation = require('../../controllers/auth/emailConfirmation');

// dependencies
const emailConfirmationRoute = require('express').Router();
// email confirmation handler

emailConfirmationRoute.get('/email-confirmation/:id', emailConfirmation);

// export
module.exports = emailConfirmationRoute;
