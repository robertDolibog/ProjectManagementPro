const express = require("express");
const router = express.Router();
const db = require("../db"); // Import the database connection
const mainController = require("../controllers/mainController"); // Import the main controller

const homeController = require("../controllers/homeController");

const userController = require("../controllers/userController");

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


router.get("/signin", userController.signinPage);

router.get("/", mainController.mainPage);

router.get("/about", (req, res) => {
  res.send("Hello from the about route!");
});

router.get("/projects", (req, res) => {
  res.send("This is the projects route");
});

router.get("/name/:myName", homeController.respondWithName);

router.get("/items/:vegetable", homeController.sendReqParam);

router.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

module.exports = router;
