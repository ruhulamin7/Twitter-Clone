const Chat = require('../../models/Chat');
const mongoose = require('mongoose');
const User = require('../../models/User');

const getSingleChat = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.userId;

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(404).send({
        error: 'No chat room exist!',
      });
    }
    const chatData = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    }).populate('users');
    // await User.populate(chatData, { path: 'users' });

    if (!chatData) {
      // check chatId is a userId
      const userData = await User.findById(chatId);
      if (userData) {
        const privateChatData = await Chat.findOneAndUpdate(
          {
            isGroupChat: false,
            users: {
              $size: 2,
              $all: [
                { $elemMatch: { $eq: mongoose.Types.ObjectId(userId) } },
                { $elemMatch: { $eq: mongoose.Types.ObjectId(chatId) } },
              ],
            },
          },
          {
            $setOnInsert: {
              users: [userId, chatId],
              latestMessage: null,
            },
          },
          {
            new: true,
            upsert: true,
          }
        ).populate('users');

        if (privateChatData) {
          return res.send(privateChatData);
        } else {
          return res.status(404).send({
            error: 'No chat room exist!',
          });
        }
      } else {
        return res.status(500).send({
          error: 'Something went wrong!',
        });
      }
    }
    return res.send(chatData);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getSingleChat;
