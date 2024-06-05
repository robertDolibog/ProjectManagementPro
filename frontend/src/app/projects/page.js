"use client";

import {
  addUserToProject,
  getUsersInProject,
  removeUserFromProject,
} from "@/components/MyProjectUserService";
import { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:4000/projects", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        console.log("fetched projects:", data);

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch projects.");
        }

        setProjects(data);

        // Set the first project as the selected project by default
        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, []);

  // Use socket hook
  const { notifications, emitEvent } = useSocket(
    "http://localhost:4000",
    selectedProjectId
  );

  const deleteProject = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not delete project.");
      }

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const addProject = async () => {
    try {
      console.log("add project function start");

      const response = await fetch("http://localhost:4000/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newProjectName,
          content: newProjectDescription,
        }),
      });

      const data = await response.json();

      console.log("response", data);

      if (!response.ok) {
        throw new Error(data.message || "Could not add project.");
      }

      setProjects((prevProjects) => [...prevProjects, data]);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
  };

  const updateProjectTitle = async (id, newTitle) => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update project title.");
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id ? { ...project, title: newTitle } : project
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async (projectId) => {
    const users = await getUsersInProject(projectId, setError);
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, users } : project
      )
    );
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center flex-col">
      <h1>Projects</h1>

      <div>
        <h2>Notifications</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{JSON.stringify(notification)}</li>
          ))}
        </ul>
      </div>

      {projects.map((project) => (
        <div key={project.id}>
          <input
            type="text"
            value={project.title}
            onChange={(e) => updateProjectTitle(project.id, e.target.value)}
            className="text-white bg-black"
          />
          <p>{project.content}</p>
          <button onClick={() => deleteProject(project.id)}>Delete</button>
          <div>
            <input
              type="text"
              placeholder="User ID"
              onChange={(e) => setUserId(e.target.value)}
              className="text-white bg-black"
            />
            <button
              onClick={() => addUserToProject(project.id, userId, setError)}
            >
              Add User
            </button>
          </div>
          <div>
            <button onClick={() => fetchUsers(project.id)}>Show Users</button>
            {project.users &&
              project.users.map((user) => (
                <div key={user.id}>
                  <span>
                    {user.id}
                    {user.name}
                  </span>
                  <br />
                  <button
                    className="font-bold"
                    onClick={() =>
                      removeUserFromProject(project.id, user.id, setError)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

      <div>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
          className="text-black"
        />
        <input
          type="text"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="New project description"
          className="text-black"
        />
        <button onClick={addProject}>Add Project</button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
