const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { updateCacheData, cacheSetAndGet } = require('../../utils/cacheManager');

const createTweet = async (req, res, next) => {
  try {
    const tweetObj = {
      content: req.body.content,
      images: [],
      tweetedBy: req.userId,
      likes: [],

      retweetedBy: [],
      originalTweet: null,
    };

    // insert images into tweet
    [...req.files].forEach((file) => {
      tweetObj.images.push(file.filename);
    });

    const tweet = new Tweet(tweetObj);
    const result = await tweet.save();

    await User.populate(result, {
      path: 'tweetedBy',
      select: '-password',
    });

    // update cache data
    updateCacheData(`tweets:${result._id}`, result);

    // will add more logic later
    res.send(result);
  } catch (error) {
    next(createHttpError(500, error));
  }
};

module.exports = createTweet;
