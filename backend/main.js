const port = 4000;
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const indexRouter = require("./routes/index");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const Ably = require("ably");

const createRedisStore = require("./services/sessionStore");

const http = require("http").createServer(app);

async function createSessionStore() {
  const redisStore = await createRedisStore();
  return redisStore;
}
const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
async function createAblyConnection() {
  // For the full code sample see here: https://github.com/ably/quickstart-js

  await ably.connection.once("connected");
  console.log("Connected to Ably!");
}

createAblyConnection();
// get the channel to subscribe to
const channel = ably.channels.get("quickstart");

/*
  Subscribe to a channel.
  The promise resolves when the channel is attached
  (and resolves synchronously if the channel is already attached).
*/
async function subscribeToChannel() {
  await channel.subscribe("greeting", (message) => {
    console.log("Received a greeting message in realtime: " + message.data);
  });
}

async function publishMessage() {
  await channel.publish("greeting", "Hello, World!");
}

subscribeToChannel();
publishMessage();

createSessionStore()
  .then((store) => {
    app.use(
      session({
        store: store,
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === "production" },
      })
    );

    app.set("view engine", "ejs");
    app.use(
      cors({
        origin: "http://localhost:3000", // replace with your frontend origin
        credentials: true,
      })
    );

    app.use(layouts);
    app.use(express.static(path.join(__dirname, "public")));
    app.use("/", indexRouter);

    http.listen(port, () => {
      console.log(`Server is listening on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Redis", err);
  });
