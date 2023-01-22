const { default: mongoose } = require('mongoose');
const Chat = require('../../models/Chat');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

async function getAllChat(req, res, next) {
  const user = await cacheSetAndGet(`users:${req.userId}`, async () => {
    const user = await User.findOne({ _id: req.userId });
    return user;
  });

  let filterObj = {};
  filterObj.users = { $elemMatch: { $eq: mongoose.Types.ObjectId(user._id) } };

  const chatList = await Chat.find(filterObj).sort({ updatedAt: '-1' });
  await User.populate(chatList, { path: 'users' });

  res.send(chatList);
}

module.exports = getAllChat;
