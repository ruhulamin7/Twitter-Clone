const createHttpError = require('http-errors');
const Tweet = require('../../models/Tweet');
const User = require('../../models/User');

const createTweet = async (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    // console.log(req.error);
    // console.log(req.userId);
    const tweetObj = {
      content: req.body.content,
      images: [],
      tweetedBy: req.userId,
    };

    [...req.files].forEach((file) => {
      tweetObj.images.push(file.filename);
    });

    const tweet = new Tweet(tweetObj);
    const result = await tweet.save();

    await User.populate(result, {
      path: 'tweetedBy',
      select: '-password',
    });

    res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createTweet;
