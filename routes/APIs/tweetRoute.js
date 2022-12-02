// dependencies
const express = require('express');
const createTweet = require('../../controllers/APIs/createTweet');
const getAllTweets = require('../../controllers/APIs/getAllTweets');
const likeController = require('../../controllers/APIs/likeController');
const uploadTweetImage = require('../../middlewares/APIs/uploadTweetImage');
const authChecker = require('../../middlewares/common/authChecker');

const tweetRoute = express.Router();
require('dotenv').config();

// post the tweet
tweetRoute.post('/', authChecker, uploadTweetImage, createTweet);
// get all tweets
tweetRoute.get('/', authChecker, getAllTweets);
// tweet like
tweetRoute.put('/like/:id', authChecker, likeController);

// exports
module.exports = tweetRoute;
