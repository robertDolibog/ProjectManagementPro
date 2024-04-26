const port = 3000,
  express = require("express"),
  app = express(),
  path = require("path"),
  indexRouter = require("./routes/index"),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts");

app.set("view engine", "ejs");

app.use(layouts);

app.use(express.static(path.join(__dirname, "public")));

//routes traffic
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(
    `The Express.js server has started and is listening on port number: ${port}`
  );
});
