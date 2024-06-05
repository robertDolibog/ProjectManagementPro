const { PrismaClient } = require("@prisma/client");
const notificationService = require("./notificationService");

const prisma = new PrismaClient();

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("submitComment", async (projectId, commentData) => {
      try {
        const comment = await prisma.comment.create({ data: commentData });
        notificationService.publishEvent("comments", projectId, comment);
      } catch (error) {
        console.error("Error saving comment: ", error);
      }
    });

    socket.on("addUserToProject", async (projectId, userId) => {
      try {
        const userProject = await prisma.userProject.create({
          data: { projectId, userId },
        });
        notificationService.publishEvent("userAdded", projectId, userProject);
      } catch (error) {
        console.error("Error adding user to project: ", error);
      }
    });

    socket.on("changeProjectTitle", async (projectId, newTitle) => {
      try {
        const updatedProject = await prisma.project.update({
          where: { id: projectId },
          data: { title: newTitle },
        });
        notificationService.publishEvent(
          "projectTitleUpdated",
          projectId,
          updatedProject
        );
      } catch (error) {
        console.error("Error updating project title: ", error);
      }
    });

    // Other events like task added, file uploaded, etc.
  });
};
