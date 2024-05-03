const databaseController = require("../database/databaseController");

exports.getProjectsByUserId = async (req, res) => {
  let userId = req.params.userId;
  console.log("UserId:", userId);

  try {
    // Fetch the projects for the user from the database
    const projects = await databaseController.getProjectsByUserId(userId);

    // Send the projects as the response
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};
