const Tweet = require('../../models/Tweet');
const User = require('../../models/User');
const { cacheSetAndGet, updateCacheData } = require('../../utils/cacheManager');

async function replayController(req, res, next) {
  try {
    const tweetId = req.params.id;
    const userId = req.userId;
    const files = req.files;
    const content = req.body.content;

    const postObj = {
      content,
      images: [],
      tweetedBy: userId,
      likes: [],
      retweetedUsers: [],
      originalTweet: null,
      replayTo: tweetId,
      replayedTweets: [],
    };

    files.forEach((file) => {
      postObj.images.push(file.filename);
    });

    const tweet = await new Tweet(postObj);
    const tweetObj = await tweet.save();

    const replayToTweet = await Tweet.findOneAndUpdate(
      { _id: tweetId },
      {
        $addToSet: { replayedTweets: tweetObj._id },
      },
      { new: true }
    );

    // update new tweets cache data
    updateCacheData(`tweets:${tweetObj._id}`, tweetObj);
    // update existing tweets cache data
    updateCacheData(`tweets:${replayToTweet._id}`, replayToTweet);

    res.send(tweetObj);
  } catch (error) {
    next(error);
  }
}

module.exports = replayController;
