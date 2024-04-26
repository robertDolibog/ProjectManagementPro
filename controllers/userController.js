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
    res.status(500).json({ message: "Error creating user" });
  }
};
exports.signinPage = (req, res) => {
  // Logic for handling the sign-in page route
  res.render("signin");
};
exports.signupPage = (req, res) => {
  // Logic for handling the signup page route

  res.render("signup");
};
