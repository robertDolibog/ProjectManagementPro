const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

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

router.post("/signin", userController.signIn);

// New getSession route
router.get("/session", userController.getSession);

router.get("/logout", userController.logout);

router.get("/", (req, res) => {
  res.send("Hello from the Backend!");
});

router.post("/projects", async (req, res) => {
  const { title, content } = req.body;
  const session = req.session;
  console.log(session);
  const project = await projectsController.createProject(
    title,
    content,
    session
  );
  res.json(project);
});

// When a project is updated, emit an event with the updated project data
router.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const project = await projectsController.updateProject(id, title, content);

  // Emit the 'projectNameUpdated' event
  io.emit("projectNameUpdated", project);

  res.json(project);
});

router.patch("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const project = await projectsController.updateProject(id, title, content);
  res.json(project);
});

router.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const project = await projectsController.deleteProject(id);
  res.json(project);
});

router.get("/projects", async (req, res) => {
  const id = req.session.user.id;
  try {
    const projects = await projectsController.getProjectsByUserId(id);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects in index" });
  }
});

// Add a user to a project
router.post("/projects/:projectId/users", async (req, res) => {
  const userId = req.body.userId;
  const projectId = req.params.projectId;
  const user = await projectsController.addUserToProject(userId, projectId);
  res.json(user);
});

// Remove a user from a project
router.delete("/projects/:projectId/users", async (req, res) => {
  const userId = req.body.userId;
  const projectId = req.params.projectId;

  const user = await projectsController.removeUserFromProject(userId, projectId);
  res.json(user);
});

// Get all users of a project
router.get("/projects/:projectId/users", async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const users = await projectsController.getProjectUsers(projectId);
    //console.log("Backend Index Users Flag: " + JSON.stringify(users.json));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users in index" });
  }
});

router.post("/projects/:projectId/tasks", taskController.createTask);

router.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

module.exports = router;
