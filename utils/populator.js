const Tweet = require('../models/Tweet');
const User = require('../models/User');

async function tweetPopulate(data) {
  await User.populate(data, { path: 'tweetedBy' });
  await Tweet.populate(data, { path: 'replayTo' });
  await User.populate(data, { path: 'replayTo.tweetedBy' });
}

module.exports = {
  tweetPopulate,
};
