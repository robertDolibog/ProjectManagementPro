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

exports.getProjectUsers = async (projectId) => {
  try {
    const users = await databaseController.getUsersByProjectId(projectId);
    //console.log("Backend projectController: Users Flag: " + JSON.stringify(users.json));
    return users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

exports.addUserToProject = async (userId, projectId) => {
  try {
    const user = await databaseController.addUserToProject(userId, projectId);

    // Use the updated notificationService to publish the event
    notificationService.publishEvent("userAdded", projectId, {
      type: "USER_ADDED_TO_PROJECT",
      projectId: projectId,
      userId: userId,
    });

    return user;
  } catch (error) {
    console.error("Error adding user to project:", error);
    return null;
  }
};

exports.removeUserFromProject = async (userId, projectId) => {
  try {
    const user = await databaseController.removeUserFromProject(
      userId,
      projectId
    );
    return user;
  } catch (error) {
    console.error("Error removing user from project:", error);
    return null;
  }
};
