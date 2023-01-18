// dependencies
const createHttpError = require('http-errors');
const User = require('../../models/User');
const { cacheSetAndGet } = require('../../utils/cacheManager');

// get message page
const getChatPage = async (req, res, next) => {
  try {
    const user = await cacheSetAndGet(`users:${req.userId}`, async () => {
      const user = await User.findOne({ _id: req.userId }, { password: 0 });
      return user;
    });
    const chatId = req.params.chatId;
    // user send to frontend js
    const userJs = JSON.stringify(user);

    return res.render('pages/messages/chat', {
      user: user ? user : {},
      userJs,
      chatId,
    });
  } catch (error) {
    next(createHttpError(500, error));
  }
};
// exports
module.exports = getChatPage;
