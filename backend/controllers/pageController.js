// pageController.js

const databaseController = require("../database/databaseController");

// Create a page
exports.createPage = async (title, content, userId, parentId = null) => {
  return await databaseController.createPage(title, content, userId, parentId);
};
// Read a page by ID
exports.getPage = async (pageId) => {
  const page = await databaseController.getPage(pageId);
  const children = await databaseController.getChildPages(pageId);
  //console.log("page in backend", page);
  return { ...page, children };
};

// Read all pages
exports.getAllPages = async (userId) => {
  return await databaseController.getAllPages(userId);
};

// Update a page by ID
exports.updatePage = async (pageId, title, content) => {
  return await databaseController.updatePage(pageId, title, content);
};

// Delete a page by ID
exports.deletePage = async (pageId) => {
  return await databaseController.deletePage(pageId);
};
