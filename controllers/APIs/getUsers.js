const User = require('../../models/User');

const getUsers = async (req, res, next) => {
  const searchText = req.query.searchText;
  let filterObj = {};

  if (searchText) {
    filterObj = {
      $or: [
        { firstName: { $regex: new RegExp(searchText, 'ig') } },
        { lastName: { $regex: new RegExp(searchText, 'ig') } },
        { username: { $regex: new RegExp(searchText, 'ig') } },
        { email: searchText },
      ],
    };
  }
  const user = await User.find(filterObj, { password: 0 });
  res.send(user);
};

module.exports = getUsers;
