exports.mainPage = (req, res) => {
    // Assuming `req.user` holds the sign-in status (modify according to your auth setup)
    res.render("index", { user: req.user });
  };