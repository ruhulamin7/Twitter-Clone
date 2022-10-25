const getLoginPage = (req, res, next) => {
  try {
    const { title, html } = res.locals;
    res.render('pages/login');
  } catch (error) {
    next(error);
  }
};

// exports
module.exports = getLoginPage;
