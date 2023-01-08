// dependencies
const express = require('express');
const createTweet = require('../../controllers/APIs/createTweet');
const deleteTweet = require('../../controllers/APIs/deleteTweet');
const getAllTweets = require('../../controllers/APIs/getAllTweets');
const likeController = require('../../controllers/APIs/likeController');
const pinController = require('../../controllers/APIs/pinController');
const replyController = require('../../controllers/APIs/replyController');
const retweetController = require('../../controllers/APIs/retweetController');
const getSingleTweet = require('../../controllers/APIs/singleTweetController');
const getSingleTweetPage = require('../../controllers/singleTweet/getSingleTweetPage');
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
// retweet
tweetRoute.post('/retweet/:id', authChecker, retweetController);
tweetRoute.post('/reply/:id', authChecker, uploadTweetImage, replyController);
// get single tweet page
tweetRoute.get('/:id', authChecker, getSingleTweetPage);
// get single tweet
tweetRoute.get('/single/:id', authChecker, getSingleTweet);
// delete tweet
tweetRoute.delete('/:id', authChecker, deleteTweet);
// pin tweet
tweetRoute.put('/:id/pin', authChecker, pinController);

// exports
module.exports = tweetRoute;
