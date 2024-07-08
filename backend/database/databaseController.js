const { PrismaClient, ContentType } = require("@prisma/client");
const argon2 = require("argon2");
const { request } = require("express");

const prisma = new PrismaClient();

async function createContentBlock(pageId, type, data) {
  const newContentBlock = await prisma.contentBlock.create({
    data: {
      type,
      data,
      pageId,
    },
  });

  return newContentBlock;
}
async function createUser(username, email, password) {
  const hashedPassword = await argon2.hash(password);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          name: username,
          email: email,
          password: hashedPassword,
        },
      });

      console.log("New User Created:", newUser);

      const initialPage = await prisma.page.create({
        data: {
          title: "Getting Started",
          users: {
            create: [
              {
                user: {
                  connect: { id: newUser.id },
                },
              },
            ],
          },
          editorData: {}, // Added empty JSON object for editorData
        },
        include: {
          contentBlocks: true,
        },
      });
      console.log("Initial Page Created:", initialPage);

      return newUser; // Assuming you only need to return the newUser
    });

    console.log("Transaction Successful:", result);
    return result;
  } catch (error) {
    console.error("Transaction Failed:", error);
    throw error;
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
      contentBlocks: {
        create: content.map((block) => ({
          type: block.type,
          data: block.data,
        })),
      },
      users: {
        connect: { id: userId },
      },
      parentId,
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
    include: {
      contentBlocks: true,
    },
  });

  return page;
}

async function getAllPages(userId) {
  const pages = await prisma.page.findMany({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      contentBlocks: true,
    },
  });

  return pages;
}

// Function to fetch all child pages of a given page
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
async function updatePage(pageId, updateData) {
  const pageIdnum = parseInt(pageId);

  console.log("updateData in DB COntroller: ", updateData);

  const updatedPage = await prisma.page.update({
    where: {
      id: pageIdnum,
    },
    data: {
      ...updateData,
      // If contentBlocks needs to be updated differently, handle it here
      // For example, if updateData contains contentBlocks, you might need to process it
      // This is commented out for simplicity, assuming editorData is directly updated
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
  getAllPages,
  getChildPages,
  updatePage,
  deletePage,
};
