"use client";

export const addUserToProject = async (projectId, userId, setError) => {
  try {
    const response = await fetch(`http://localhost:4000/projects/${projectId}/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Could not add user to project.");
    }

    const user = await response.json();
    console.log("User added to project", user);
    return user;
  } catch (err) {
    setError(err.message);
    console.error("Failed to add user to project:", err.message);
  }
};

export const getUsersInProject = async (projectId, setError) => {
  try {
    const response = await fetch(`http://localhost:4000/projects/${projectId}/users`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Could not fetch users in project.");
    }

    const users = await response.json();
    console.log("Users in project:", users);
    return users;
  } catch (err) {
    setError(err.message);
    console.error("Failed to fetch users in project:", err.message);
  }
};

export const removeUserFromProject = async (projectId, userId, setError) => {
  try {
    const response = await fetch(`http://localhost:4000/projects/${projectId}/users`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Could not remove user from project.");
    }

    const user = await response.json();
    console.log("User removed from project", user);
    return user;
  } catch (err) {
    setError(err.message);
    console.error("Failed to remove user from project:", err.message);
  }
};
