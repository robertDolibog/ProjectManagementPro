require("dotenv").config();

const port = 3000,
  express = require("express"),
  app = express(),
  path = require("path"),
  indexRouter = require("./routes/index"),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(layouts);

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

//routes traffic
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(
    `The Express.js server has started and is listening on port number: ${port}`
  );
});
