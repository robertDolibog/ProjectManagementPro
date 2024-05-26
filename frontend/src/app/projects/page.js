"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:4000/projects");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch projects.");
        }

        setProjects(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, []);

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

  return (
    <div className="flex w-screen h-screen justify-center items-center flex-col">
      <h1>Projects</h1>

      {projects.map((project) => (
        <div key={project.id}>
          <input
            type="text"
            value={project.title}
            onChange={(e) => updateProjectTitle(project.id, e.target.value)}
            className=" text-white bg-black"
          />
          <p>{project.content}</p>
        </div>
      ))}

      <div>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
          className=" text-black"
        />
        <input
          type="text"
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="New project description"
          className=" text-black"
        />
        <button onClick={addProject}>Add Project</button>
      </div>
    </div>
  );
}
