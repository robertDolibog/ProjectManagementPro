const port = 4000;
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const indexRouter = require("./routes/index");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const socketIo = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const createRedisStore = require("./services/sessionStore");
const setupSocketHandlers = require("./services/socketHandlers");
const notificationService = require("./services/notificationService");
const http = require("http").createServer(app);

const prisma = new PrismaClient();
const io = socketIo(http);

async function createSessionStore() {
  const redisStore = await createRedisStore();
  return redisStore;
}

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

    // Subscribe to Redis Pub/Sub channels with socket.io
    notificationService.subscribe(io);

    // Setup socket handlers
    setupSocketHandlers(io);

    http.listen(port, () => {
      console.log(`Server is listening on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Redis", err);
  });

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const layouts = require("express-ejs-layouts");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const http = require("http");
// const socketIo = require("socket.io");
// const { PrismaClient } = require("@prisma/client");
// const createRedisStore = require("./services/sessionStore");
// const indexRouter = require("./routes/index");
// const notificationService = require("./services/notificationService");

// const app = express();
// const prisma = new PrismaClient();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.set("view engine", "ejs");
// app.use(
//   cors({
//     origin: process.env.FRONTEND_ORIGIN, // Use environment variable
//     credentials: true,
//   })
// );
// app.use(layouts);
// app.use(express.static(path.join(__dirname, "public")));
// app.use(cookieParser());
// app.use(express.json());

// (async () => {
//   const RedisStore = await createRedisStore();
//   app.use(
//     session({
//       store: RedisStore,
//       secret: process.env.SESSION_SECRET,
//       resave: false,
//       saveUninitialized: false,
//       cookie: { secure: process.env.NODE_ENV === "production" },
//     })
//   );

//   app.use("/", indexRouter);

//   io.on("connection", (socket) => {
//     socket.on("submitComment", async (commentData) => {
//       try {
//         const comment = await prisma.comment.create({ data: commentData });
//         notificationService.publishComment(comment);
//       } catch (error) {
//         console.error("Error saving comment: ", error);
//       }
//     });
//   });

//   notificationService.subscribe(io);

//   server.listen(process.env.PORT || 4000, () => {
//     console.log(`Server is listening on port ${process.env.PORT || 4000}`);
//   });
// })();
