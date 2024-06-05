const { PrismaClient } = require("@prisma/client");
const createPubSubRedisClient = require("./redisPubSubClient");

const prisma = new PrismaClient();

async function publishEvent(eventType, projectId, eventData) {
  const redisClient = await createPubSubRedisClient();
  const message = JSON.stringify({ projectId, eventData });
  redisClient.publish(`${eventType}_${projectId}`, message);
}

async function subscribe(io) {
  const redisClient = await createPubSubRedisClient();

  io.on("connection", (socket) => {
    socket.on("subscribeToProject", async (projectId) => {
      const userProjects = await prisma.userProject.findMany({
        where: { userId: socket.user.id },
        select: { projectId: true },
      });

      const userProjectIds = userProjects.map((up) => up.projectId);
      if (userProjectIds.includes(projectId)) {
        const channels = [
          `comments_${projectId}`,
          `userAdded_${projectId}`,
          `taskAdded_${projectId}`,
          `fileUploaded_${projectId}`,
          `projectTitleUpdated_${projectId}`,
        ];

        channels.forEach((channel) => {
          redisClient.subscribe(channel);
          redisClient.on("message", (channel, message) => {
            const [eventType] = channel.split("_");
            socket.emit(eventType, JSON.parse(message));
          });
        });
      } else {
        socket.emit("unauthorized", {
          message:
            "You are not authorized to subscribe to this project's notifications.",
        });
      }
    });
  });
}

module.exports = {
  publishEvent,
  subscribe,
};
