const { PrismaClient, ContentType } = require("@prisma/client");
const argon2 = require("argon2");
const { request } = require("express");

const prisma = new PrismaClient();

const initialEditorData = [
  {
      "id": "5e1aae1f-639d-426b-9f01-1bcf9ab21514",
      "type": "paragraph",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [
          {
              "type": "text",
              "text": " This is your introduction to the app.",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "bd390fc5-4ef1-4655-a1e3-62ca58c42928",
      "type": "paragraph",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [],
      "children": []
  },
  {
      "id": "fee76e02-074c-4396-9c42-636a256c1d3d",
      "type": "heading",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left",
          "level": 2
      },
      "content": [
          {
              "type": "text",
              "text": "<-- click the list icon to add a new page",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "ca39837b-990c-479f-a662-882b8fc3ad34",
      "type": "heading",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left",
          "level": 2
      },
      "content": [
          {
              "type": "text",
              "text": "<-- click the bin icon to delete a page",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "190b3295-8967-4173-be92-9e8a70e75ff4",
      "type": "paragraph",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [],
      "children": []
  },
  {
      "id": "88f22ca3-03b2-4e08-be13-1e0a6849bb6b",
      "type": "heading",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left",
          "level": 1
      },
      "content": [
          {
              "type": "text",
              "text": "Heading 1",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "b77ced30-09ab-4187-9cbc-800edfce2f86",
      "type": "heading",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left",
          "level": 2
      },
      "content": [
          {
              "type": "text",
              "text": "Heading 2",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "29af3441-2945-4e71-ac76-5b9212cba269",
      "type": "heading",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left",
          "level": 3
      },
      "content": [
          {
              "type": "text",
              "text": "Heading 3",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "bbd00dc2-785a-453d-9f23-528b793a8dfe",
      "type": "paragraph",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [],
      "children": []
  },
  {
      "id": "784ca37f-c43d-4df9-91bc-b9bbfb1e3e9f",
      "type": "heading",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left",
          "level": 3
      },
      "content": [
          {
              "type": "text",
              "text": "Lists:",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "e6e70075-72da-451f-b8b9-7d903d31a14d",
      "type": "numberedListItem",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [
          {
              "type": "text",
              "text": "Item 1",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "4a520cd2-6ca8-4358-8649-526cfa778487",
      "type": "numberedListItem",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [
          {
              "type": "text",
              "text": "Item 2",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "6849a08c-1364-40ab-9bfb-4f3ce3db54cc",
      "type": "numberedListItem",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [
          {
              "type": "text",
              "text": "Item 3",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "e4e68ac5-d3c5-4899-8e89-8180132e4435",
      "type": "bulletListItem",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [
          {
              "type": "text",
              "text": "Item 1",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "f7e3ec4f-b393-44ff-904a-1172b67a8db1",
      "type": "bulletListItem",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [
          {
              "type": "text",
              "text": "Item 2",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "12adbbff-c45d-4398-b8f0-453584639fb6",
      "type": "bulletListItem",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [
          {
              "type": "text",
              "text": "Item 3",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "b10c2500-35c4-4fbe-821e-ae4222e494d6",
      "type": "heading",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left",
          "level": 3
      },
      "content": [
          {
              "type": "text",
              "text": "List:",
              "styles": {}
          }
      ],
      "children": []
  },
  {
      "id": "36698e37-a6fe-4bd5-a5e9-94384f89c399",
      "type": "table",
      "props": {
          "textColor": "default",
          "backgroundColor": "default"
      },
      "content": {
          "type": "tableContent",
          "rows": [
              {
                  "cells": [
                      [],
                      [],
                      []
                  ]
              },
              {
                  "cells": [
                      [],
                      [],
                      []
                  ]
              }
          ]
      },
      "children": []
  },
  {
      "id": "1447da14-0779-4679-82a0-9063b7e89194",
      "type": "paragraph",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [],
      "children": []
  },
  {
      "id": "d4ffa5ee-f17a-4243-8b33-52ccf85af93e",
      "type": "paragraph",
      "props": {
          "textColor": "default",
          "backgroundColor": "default",
          "textAlignment": "left"
      },
      "content": [],
      "children": []
  }
];
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
          editorData: initialEditorData, // Added empty JSON object for editorData
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
      editorData: content,
      users: {
        create: {
          user: {
            connect: { id: userId }
          }
        }
      }
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
  console.log("Deleting page with ID in backend:", pageId);
  const id = parseInt(pageId);

  if (isNaN(id)) {
    console.error("Page ID must be a valid number.");
    return null;
  }

  // Assuming this function is within your databaseController.js or a similar file

  async function deletePageAndChildren(pageId) {
    // First, delete or handle any references to the page in other tables
    // For example, if UserPage references Page, you need to delete those references first
    await prisma.userPage.deleteMany({
      where: {
        pageId: parseInt(pageId), // Ensure pageId is correctly typed
      },
    });

    // After handling references, delete the page itself
    const deletedPage = await prisma.page.delete({
      where: {
        id: parseInt(pageId), // Ensure pageId is correctly typed
      },
    });

    return deletedPage;
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
