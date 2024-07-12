// Define a function for each keypress event
export const goToMyAccount = (event, router) => {
  if (event.metaKey && event.key === "a") {
    router.push("/my-account");
  }
};

// Repeat for other shortcuts
export const goToBilling = (event, router) => {
  // Implementation
};

export const goToSettings = (event) => {
  // Implementation
};

export const logOut = (event, handleLogout) => {
  if (event.shiftKey && event.metaKey && event.key === "Q") {
    handleLogout();
  }
};
