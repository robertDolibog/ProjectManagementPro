const express = require("express");
const router = express.Router();
const db = require("../database/databaseController"); // Import the database connection
const mainController = require("../controllers/mainController"); // Import the main controller

const homeController = require("../controllers/homeController");

const userController = require("../controllers/userController");

const databaseController = require("../database/databaseController");

router.use(
  express.urlencoded({
    extended: false,
  })
);

router.use(express.json());

router.use((req, res, next) => {
  console.log(`request made to: ${req.url}`);
  next();
});

// Define routes

router.post("/signup", userController.signup);
router.get("/signup", userController.signupPage);

router.get("/signin", userController.signInPage);
router.post("/signin", userController.signIn);

router.get("/logout", userController.logout);

router.get("/", mainController.mainPage);

router.get("/about", (req, res) => {
  res.send("Hello from the about route!");
});

router.post("/projects", async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId;
  const project = await db.createProject(title, content, req.session);
  res.json(project);
});

router.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const project = await db.updateProject(id, title, content);
  console.log("updateProject", project);
  res.json(project);
});

router.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const project = await db.deleteProject(id);
  res.json(project);
});

router.get(
  "/projects/:userId",
  userController.authenticate,
  async (req, res) => {
    if (!req.params.userId) {
      console.error("UserId parameter is undefined");
      return res.status(400).send("UserId is required");
    }
    console.log("Received UserId:", req.params.userId);
    let id = req.params.userId;

    try {
      // Fetch the projects for the authenticated user
      const projects = await databaseController.getProjectsByUserId(id);

      // Render the projects page with the fetched projects
      res.render("projects", { projects, userId: id });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Error fetching projects in index" });
    }
  }
);
router.get("/projects/:projectId", async (req, res) => {
  const projectId = req.params.projectId;
  try {
      const project = await db.getProjectById(projectId); 
      const tasks = await db.getTasksByProjectId(projectId);
      res.render("tasks", { project: project, tasks: tasks });
  } catch (error) {
      res.status(500).send("Error loading tasks");
  }
});

router.post("/projects/:projectId/tasks", async (req, res) => {
  const { title, content } = req.body;
  const projectId = req.params.projectId;
  try {
      const project = await db.getProjectById(projectId); // Make sure this method exists
      const task = await db.createTask(title, content, project, req.session);
      res.redirect(`/projects/${projectId}/tasks`); // Redirect to view tasks
  } catch (error) {
      console.error("Failed to create task:", error);
      res.status(500).send("Failed to create task");
  }
});



router.get("/projects/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;
  const tasks = await db.getTasksByProjectId(projectId);
  res.json(tasks);
});

router.get("/name/:myName", homeController.respondWithName);

router.get("/items/:vegetable", homeController.sendReqParam);

router.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

module.exports = router;
