const getRegisterPage = (req, res, next) => {
  try {
    res.render('pages/register', { error: {}, user: {} });
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = getRegisterPage;
