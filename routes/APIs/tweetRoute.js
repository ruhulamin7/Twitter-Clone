// dependencies
const express = require('express');
const createTweet = require('../../controllers/APIs/createTweet');
const getAllTweets = require('../../controllers/APIs/getAllTweets');
const uploadTweetImage = require('../../middlewares/APIs/uploadTweetImage');
const authChecker = require('../../middlewares/common/authChecker');

const tweetRoute = express.Router();
require('dotenv').config();

// post the tweet
tweetRoute.post('/', authChecker, uploadTweetImage, createTweet);
// get all tweets
tweetRoute.get('/', authChecker, getAllTweets);

// exports
module.exports = tweetRoute;
