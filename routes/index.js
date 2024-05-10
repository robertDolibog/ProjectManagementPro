const express = require("express");
const router = express.Router();
const db = require("../database/databaseController"); // Import the database connection
const mainController = require("../controllers/mainController"); // Import the main controller

const homeController = require("../controllers/homeController");

const userController = require("../controllers/userController");

const databaseController = require("../database/databaseController");

const projectsController = require("../controllers/projectsController");

const taskController = require("../controllers/tasksController");




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

  console.log(req.session);
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

router.get("/projects", userController.authenticate, async (req, res) => {
  console.log("Received UserId:", req.session.user.id);
  let id = req.session.user.id;

  try {
    // Fetch the projects for the authenticated user
    const projects = await databaseController.getProjectsByUserId(id);

    console.log("retrived projects:", projects);

    // Fetch the users for each project
    const usersPromises = projects.map(project => databaseController.getUsersByProjectId(project.id));
    let users = await Promise.all(usersPromises);

    // Flatten the users array
    users = users.flat();

    // Render the projects page with the fetched projects and users
    res.render("projects", { projects, users, userId: id });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects in index" });
  }
});


// Add a user to a project
router.post("/projects/:projectId/users", async (req, res) => {
  req.body.userId = req.body.userId;
  req.body.projectId = req.params.projectId;
  userController.addUserToProject(req, res);
});

// Remove a user from a project
router.delete("/projects/:projectId/users", async (req, res) => {
  req.body.userId = req.body.userId;
  req.body.projectId = req.params.projectId;
  userController.removeUserFromProject(req, res);
});

// Get all users of a project
router.get("/projects/:projectId/users", async (req, res) => {
  req.params.projectId = req.params.projectId;
  projectsController.getProjectUsers(req, res);
});

router.post("/projects/:projectId/tasks", taskController.createTask);

router.get("/name/:myName", homeController.respondWithName);

router.get("/items/:vegetable", homeController.sendReqParam);

router.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

module.exports = router;
