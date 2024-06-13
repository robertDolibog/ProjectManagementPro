const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const { request } = require("express");
const { createTask, getTasksByProjectId, updateTask } = require("../controllers/tasksController");

const prisma = new PrismaClient();

async function createUser(username, email, password) {
  const hashedPassword = await argon2.hash(password);

  try {
    const newUser = await prisma.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    console.log("Error instance: ", error.constructor.name); // Logs the actual instance of the error
    console.log("Error code: ", error.code); // Logs the actual error code
    throw new Error("A user account with this email already exists.");
  }
}

async function authenticateUser(email, password) {
  // Find the user with the given email
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    // If the user is found, compare the provided password with the stored password
    const passwordMatch = await argon2.verify(user.password, password);

    if (passwordMatch) {
      // If the passwords match, return the user
      return user;
    }
  }

  // If the user is not found or the passwords don't match, return null
  return null;
}
async function getProjectsByUserId(userId) {
  const parsedUserId = parseInt(userId);

  if (isNaN(parsedUserId)) {
    // userId cannot be converted to an integer
    return [];
  }

  const userProjects = await prisma.userProject.findMany({
    where: {
      userId: parsedUserId,
    },
    include: {
      project: true,
    },
  });

  // Extract the projects from the userProjects array
  const projects = userProjects.map((userProject) => userProject.project);

  return projects || [];
}

async function createProject(title, content, session) {
  if (!title || !content) {
    console.error(
      "Title, content, and userId are required. Received:",
      title,
      content
    );
  }

  console.log(session);

  const userId = session.user.id;

  const project = await prisma.project.create({
    data: {
      title: title,
      content: content,
      users: {
        create: {
          userId: userId,
        },
      },
    },
  });
  return project;
}

async function updateProject(id, title, content) {
  id = Number(id);
  console.log("props in update project", id, title, content);
  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      content,
    },
  });
  return project;
}

async function deleteProject(id) {
  id = Number(id);

  try {
    // Delete the associated users from the UserProject table
    await prisma.userProject.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Delete the project
    const project = await prisma.project.delete({
      where: {
        id: id,
      },
    });

    return project;
  } catch (error) {
    console.error("Error in deleteProject:", error);
    throw new Error("Failed to delete project.");
  }
}

// Create a new task
async function createTask(title, content, projectId) {
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        content,
        project: {
          connect: {
            id: Number(projectId),
          },
        },
      },
    });

    return newTask;
  } catch (error) {
    console.error("Error in createTask:", error);
    throw new Error("Failed to create task.");
  }
}

// Get tasks by project ID
async function getTasksByProjectId(projectId) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
    });

    return tasks;
  } catch (error) {
    console.error("Error in getTasksByProjectId:", error);
    throw new Error("Failed to get tasks by project.");
  }
}

// Update a task
async function updateTask(id, title, content) {
  try {
    const task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
      },
    });

    return task;
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw new Error("Failed to update task.");
  }
}

// Delete a task
async function deleteTask(id) {
  try {
    const task = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    return task;
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw new Error("Failed to delete task.");
  }
}


async function addUserToProject(userId, projectId) {
  try {
    const newUserProject = await prisma.userProject.create({
      data: {
        userId: Number(userId),
        projectId: Number(projectId),
      },
    });

    return newUserProject;
  } catch (error) {
    console.error("Error in addUserToProject:", error);
    throw new Error("Failed to add user to project.");
  }
}

async function removeUserFromProject(userId, projectId) {
  try {
    const deleteUserProject = await prisma.userProject.delete({
      where: {
        userId_projectId: {
          userId: Number(userId),
          projectId: Number(projectId),
        },
      },
    });

    return deleteUserProject;
  } catch (error) {
    console.error("Error in removeUserFromProject:", error);
    throw new Error("Failed to remove user from project.");
  }
}

async function getUsersByProjectId(projectId) {
  try {
    const users = await prisma.user.findMany({
      where: {
        projects: {
          some: {
            projectId: Number(projectId),
          },
        },
      },
    });
    //console.log(users.json);

    return users;
  } catch (error) {
    console.error("Error in getUsersByProjectId:", error);
    throw new Error("Failed to get users by project.");
  }
}

module.exports = {
  createUser,
  authenticateUser,
  getProjectsByUserId,
  createProject,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  getUsersByProjectId,
  createTask,
  getTasksByProjectId,
  updateTask,
  deleteTask,
};
