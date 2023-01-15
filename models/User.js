const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 1,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 1,
      trim: true,
    },
    username: {
      type: String,
      minLength: 3,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        },
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // validate: {
      //   validator: function (value) {
      //     return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
      //   },
      // },
    },
    userAvatar: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    status: {
      type: String,
      enum: ['unverified', 'verified', 'suspended'],
      default: 'unverified',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
      },
    ],
    retweets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    activeStatus: Boolean,
    lastSeen: Date,
  },
  {
    timestamps: true,
  }
);

const User = new model('User', userSchema);

// exports
module.exports = User;
