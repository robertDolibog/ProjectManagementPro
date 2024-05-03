const databaseController = require("../database/databaseController");


exports.getTasksByProjectId = async (req, res) => {
  let projectId = req.params.projectId;
  console.log("ProjectId:", projectId);

  try {
    // Fetch the tasks for the project from the database
    const tasks = await databaseController.getTasksByProjectId(projectId);

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};