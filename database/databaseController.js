const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const { request } = require("express");

const prisma = new PrismaClient();

async function createUser(username, email, password) {
  const hashedPassword = await argon2.hash(password);

  const newUser = await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: hashedPassword,
    },
  });

  return newUser;
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

  const projects = await prisma.project.findMany({
    where: {
      userId: parsedUserId,
    },
  });

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

  const userId = session.user.userId;
  const email = session.user.email;

  const project = await prisma.project.create({
    data: {
      title: title,
      content: content,
      userId: userId,
      author: {
        connect: {
          id: userId,
          email: email,
        },
      },
    },
  });
  return project;
}

async function updateProject(id, title, content) {
  id = Number(id);
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
  const project = await prisma.project.delete({
    where: { id },
  });
  return project;
}

module.exports = {
  createUser,
  authenticateUser,
  getProjectsByUserId,
  createProject,
  updateProject,
  deleteProject,
};
