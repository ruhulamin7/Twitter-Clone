const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    tweetedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    retweetedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    originalTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tweet',
    },
    replayTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tweet',
    },
    replayedTweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Tweet = new model('Tweet', tweetSchema);

// exports
module.exports = Tweet;
