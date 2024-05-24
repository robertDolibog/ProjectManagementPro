const port = 4000,
  express = require("express"),
  app = express(),
  path = require("path"),
  indexRouter = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  redis = require("redis"),
  ConnectRedis = require("connect-redis").default,
  socketIo = require("socket.io"),
  { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const http = require("http").createServer(app);
const io = socketIo(http);

const redisClient = redis.createClient({
  url: process.env.REDIS_SESSIONS_URL,
  retry_strategy: function (options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
});

redisClient.on("error", function (err) {
  console.error("Redis error: ", err);
});

const RedisStore = new ConnectRedis({ client: redisClient });

app.use(
  session({
    store: RedisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

io.on("connection", (socket) => {
  socket.on("submitComment", async (commentData) => {
    // Save the comment to the database
    const comment = await prisma.comment.create({
      data: commentData,
    });

    // Publish the comment to the Redis channel
    redisClient.publish("comments", JSON.stringify(comment));
  });
});

redisClient.on("message", (channel, message) => {
  if (channel === "comments") {
    // Emit the comment to all connected clients
    io.emit("newComment", JSON.parse(message));
  }
});

redisClient
  .connect()
  .then(() => {
    http.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Redis", err);
  });
