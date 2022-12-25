const User = require('../../models/User');
const { cacheSetAndGet, updateCacheData } = require('../../utils/cacheManager');

async function followController(req, res, next) {
  try {
    const followingUserId = req.params.id;
    const loggedInUserId = req.userId;

    const user = await cacheSetAndGet(`users:${req.userId}`, async () => {
      const user = await User.findOne({ _id: req.userId });
      return user;
    });

    const isFollowing =
      user.following && user.following.includes(followingUserId);
    const option = isFollowing ? '$pull' : '$addToSet';

    // update follower user
    const modifiedLoggedInUser = await User.findOneAndUpdate(
      { _id: loggedInUserId },
      { [option]: { following: followingUserId } },
      { new: true }
    );

    // update follower user's cache
    updateCacheData(`users:${loggedInUserId}`, modifiedLoggedInUser);

    // update following user
    const modifiedFollowingUser = await User.findOneAndUpdate(
      { _id: followingUserId },
      { [option]: { followers: loggedInUserId } },
      { new: true }
    );

    // update follower user's cache
    updateCacheData(`users:${followingUserId}`, modifiedFollowingUser);

    res.send(modifiedFollowingUser);
  } catch (error) {
    console.log(error);
  }
}

module.exports = followController;
