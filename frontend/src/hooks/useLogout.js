const useLogout = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("data response in frontend logout", data);
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error; // Rethrow to be caught in the calling function
    }
  };

  return { handleLogout };
};

export default useLogout;
