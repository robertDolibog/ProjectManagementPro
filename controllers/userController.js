const databaseController = require("../database/databaseController");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user using the databaseController
    const newUser = await databaseController.createUser(
      username,
      email,
      password
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    req.session.error = error.message;
    res.redirect("/signin");
  }
};
exports.signInPage = (req, res) => {
  // Get the error message from the query parameters
  const error = req.session.error;

  // Pass the error message to the template
  res.render("signIn", { error });
};

exports.signupPage = (req, res) => {
  // Logic for handling the signup page route

  res.render("signUp");
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Attempting to authenticate user with email: ${email}`);

    // Authenticate the user using the databaseController
    const user = await databaseController.authenticateUser(email, password);

    if (user) {
      console.log(`User with email: ${email} authenticated successfully`);

      // If the user is authenticated, store their data in the session
      req.session.user = {
        id: user.id,
        email: user.email,
        // any other user data you want to store in the session
      };

      console.log("Session data:", req.session);

      // Save the session before redirecting
      await req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          res.render("login", { error: "Error logging in user" });
        } else {
          // Redirect the user to their unique projects route
          console.log("Redirecting to user's projects page with ID:", user.id);
          res.redirect(`/projects`);
        }
      });
    } else {
      res.render("signIn", { error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.render("login", { error: "Error logging in user" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out user:", err);
      res.status(500).json({ message: "Error logging out user" });
    } else {
      res.redirect("/signIn");
    }
  });
};

exports.authenticate = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/signIn");
  }
};
