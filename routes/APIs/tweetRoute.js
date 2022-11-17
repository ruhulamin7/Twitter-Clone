// dependencies
const express = require('express');
const createTweet = require('../../controllers/APIs/createTweet');
const uploadTweetImage = require('../../middlewares/APIs/uploadTweetImage');
const authChecker = require('../../middlewares/common/authChecker');

const tweetRoute = express.Router();
require('dotenv').config();

// post tweet
tweetRoute.post('/', authChecker, uploadTweetImage, createTweet);

// exports
module.exports = tweetRoute;
