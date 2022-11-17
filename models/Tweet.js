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
      // type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Tweet = new model('Tweet', tweetSchema);

// exports
module.exports = Tweet;
