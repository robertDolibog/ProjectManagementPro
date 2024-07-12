const databaseController = require("../database/databaseController");

exports.signup = async (req, res) => {
  try {
    const { name: name, email, password } = req.body;
    //console.log(name, email, password);
    // Create a new user using the databaseController
    const newUser = await databaseController.createUser(name, email, password);

    // If the user is created successfully, store their data in the session
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      // any other user data you want to store in the session
    };

    console.log("Session data:", req.session);

    // Save the session before sending the response
    try {
      await req.session.save();

      res
        .status(201)
        .json({ message: "User created successfully", redirect: "/dashboard" });
    } catch (err) {
      console.error("Error saving session:", err);
      res.status(500).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    req.session.error = error.message;
  }
};
exports.signIn = async (req, res) => {
  try {
    console.log("im here");

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
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          res.status(500).json({ message: "Error logging in user" });
        } else {
          res.json({ message: "Sign-in successful" });
        }
      });
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
      res.status(200).json({ message: "User logged out successfully" });
    }
  });
};

exports.getSession = (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    res.status(200).json({ session: req.session });
  } else {
    res.status(401).json({ message: "No session found" });
  }
};
