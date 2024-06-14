import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();

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

      if (response.ok) {
        // Sign-out was successful
        // Reload the /signin page
        router.push("/signin");
      }
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return { handleLogout };
};

export default useLogout;
