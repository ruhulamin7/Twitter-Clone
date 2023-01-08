const Tweet = require('../models/Tweet');
const User = require('../models/User');

async function tweetPopulate(data) {
  await Tweet.populate(data, { path: 'tweetedBy' });
  await Tweet.populate(data, { path: 'replyTo' });
  await User.populate(data, { path: 'replyTo.tweetedBy' });
}

module.exports = {
  tweetPopulate,
};
