const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");
const { request } = require("express");
const {
  createTask,
  getTasksByProjectId,
  updateTask,
} = require("../controllers/tasksController");

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

async function createPage(title, content, userId, parentId = null) {
  const newPage = await prisma.page.create({
    data: {
      title,
      userId,
      parentId,
      contentBlocks: {
        create: {
          type: "TEXT",
          data: content,
        },
      },
    },
  });

  return newPage;
}

// Function to fetch a single page by its ID
async function getPage(pageId) {
  const id = parseInt(pageId);

  if (isNaN(id)) {
    console.error("Page ID must be a valid number.");
    return null;
  }

  const page = await prisma.page.findUnique({
    where: {
      id,
    },
  });

  return page;
}

async function getChildPages(pageId) {
  const id = parseInt(pageId);

  if (isNaN(id)) {
    console.error("Page ID must be a valid number.");
    return null;
  }

  const children = await prisma.page.findMany({
    where: {
      parentId: id,
    },
  });

  return children;
}

async function updatePage(pageId, title, content) {
  const updatedPage = await prisma.page.update({
    where: {
      id: pageId,
    },
    data: {
      title,
      content,
    },
  });

  return updatedPage;
}

async function deletePage(pageId) {
  const id = parseInt(pageId);

  if (isNaN(id)) {
    console.error("Page ID must be a valid number.");
    return null;
  }

  // Recursive function to delete a page and its child pages
  async function deletePageAndChildren(pageId) {
    // Find child pages
    const children = await prisma.page.findMany({
      where: {
        parentId: pageId,
      },
    });

    // Recursively delete each child page
    for (const child of children) {
      await deletePageAndChildren(child.id);
    }

    // Delete the current page
    await prisma.page.delete({
      where: {
        id: pageId,
      },
    });
  }

  // Start the cascade delete from the specified page
  await deletePageAndChildren(id);

  return { message: "Page and subpages deleted successfully." };
}

module.exports = {
  createUser,
  authenticateUser,
  createPage,
  getPage,
  getChildPages,
  updatePage,
  deletePage,
};
