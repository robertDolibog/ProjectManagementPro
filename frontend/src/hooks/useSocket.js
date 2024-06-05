import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = (url, projectId) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socketInstance = io(url);
    setSocket(socketInstance);

    // Connect and subscribe to project notifications
    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      socketInstance.emit("subscribeToProject", projectId);
    });

    // Listen for various events
    socketInstance.on("newComment", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    socketInstance.on("userAdded", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    socketInstance.on("projectTitleUpdated", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    // Handle unauthorized access
    socketInstance.on("unauthorized", (message) => {
      console.error("Unauthorized:", message);
    });

    // Clean up on unmount
    return () => {
      socketInstance.off("newComment");
      socketInstance.off("userAdded");
      socketInstance.off("projectTitleUpdated");
      socketInstance.disconnect();
    };
  }, [url, projectId]);

  // Function to emit events
  const emitEvent = (eventName, data) => {
    if (socket) {
      socket.emit(eventName, data);
    }
  };

  return { notifications, emitEvent };
};

export default useSocket;
