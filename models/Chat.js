const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    chatImage: {
      type: String,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

const Chat = new model('Chat', chatSchema);

// exports
module.exports = Chat;
