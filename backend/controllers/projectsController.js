const databaseController = require("../database/databaseController");

// projectsController.js

exports.createProject = async (title, content, session) => {
  return await databaseController.createProject(title, content, session);
};

exports.updateProject = async (id, title, content) => {
  return await databaseController.updateProject(id, title, content);
};

exports.deleteProject = async (id) => {
  return await databaseController.deleteProject(id);
};

exports.getProjectsByUserId = async (id) => {
  try {
    // Fetch the projects for the user from the database
    const projects = await databaseController.getProjectsByUserId(id);

    // Send the projects as the response
    return projects || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

exports.getProjectUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const users = await databaseController.getUsersByProjectId(projectId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
