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

      // Save the session before sending the response
      try {
        await req.session.save();
        console.log("Redirecting to user's projects page with ID:", user.id);
        res.json({ message: "Sign-in successful", redirectUrl: `/projects` });
      } catch (err) {
        console.error("Error saving session:", err);
        res.status(500).json({ message: "Error logging in user" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user" });
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

exports.addUserToProject = async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const result = await databaseController.addUserToProject(userId, projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeUserFromProject = async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const result = await databaseController.removeUserFromProject(
      userId,
      projectId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
