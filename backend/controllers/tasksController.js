// Description: This file contains the tasks controller.

const databaseController = require("../database/databaseController");

exports.createTask = async (title, content, projectId) => {
  databaseController
    .createTask(title, content, projectId)
    .then(() => res.status(201).send("Task created successfully"))
    .catch((err) =>
      res.status(500).send("Error creating task: " + err.message)
    );
};

exports.getTasksByProjectId = (projectId) => {
  databaseController
    .getTasksByProjectId(projectId)
    .then((tasks) => res.status(200).json(tasks))
    .catch((err) =>
      res.status(500).send("Error fetching tasks: " + err.message)
    );
}

exports.updateTask = (id, title, content) => {
  databaseController
    .updateTask(id, title, content)
    .then(() => res.status(200).send("Task updated successfully"))
    .catch((err) =>
      res.status(500).send("Error updating task: " + err.message)
    );
};

exports.deleteTask = (id) => {
  databaseController
    .deleteTask(id)
    .then(() => res.status(200).send("Task deleted successfully"))
    .catch((err) =>
      res.status(500).send("Error deleting task: " + err.message)
    );
};
