// dependencies
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const urlencoded = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const {
  notFoundHandler,
  errorHandler,
} = require('./middlewares/common/errorHandlers');

const authRoute = require('./routes/auth/authRoute');
const homeRoute = require('./routes/home/homeRoute');
const emailConfirmationRoute = require('./routes/auth/emailConfirmationRoute');
const resetPasswordRoute = require('./routes/auth/resetPasswordRoute');
const otpRoute = require('./routes/auth/otpRoute');
const logoutRoute = require('./routes/auth/logoutRoute');

// init app
const app = express();
dotenv.config();

// PORT
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(urlencoded({ extended: true })); // handle form data with parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SIGN));

// settings
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// auth routes
app.use(authRoute);
// get home page
app.use(homeRoute);
// email confirmation routes
app.use(emailConfirmationRoute);
// reset password routes
app.use(resetPasswordRoute);
// otp routes
app.use(otpRoute);
// logout routes
app.use(logoutRoute);

// not found handler
app.use(notFoundHandler);
// error handler
app.use(errorHandler);

// listening
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log('DB connection established');
      console.log(`Server listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
