const User = require('../../models/User');
const { updateCacheData } = require('../../utils/cacheManager');

const updateAvatarController = async (req, res, next) => {
  try {
    const fileName = req.files[0]?.filename;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { userAvatar: fileName },
      { new: true }
    );

    await updateCacheData(`users:${user._id}`, user);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports = updateAvatarController;
