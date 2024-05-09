// Description: This file contains the tasks controller.

const databaseController = require("../database/databaseController");

exports.createTask = (req, res) => {
  const { title, description } = req.body;
  const projectId = req.params.projectId;

  databaseController
    .createTask(title, description, projectId)
    .then(() => res.status(201).send("Task created successfully"))
    .catch((err) =>
      res.status(500).send("Error creating task: " + err.message)
    );
};
