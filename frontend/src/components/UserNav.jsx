"use client";

import useLogout from "@/hooks/useLogout"; // Ensure this path matches your project structure
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const UserNav = () => {
  const { handleLogout } = useLogout(); // Destructure the handleLogout function from the hook
  const router = useRouter(); // Use Next.js useRouter hook for navigation

  const logoutAndRedirect = async () => {
    try {
      await handleLogout();
      console.log("Logging out and redirecting");
      router.refresh(); // Refresh the page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <img
            src="/next.svg"
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutAndRedirect}>
          Logout
        </DropdownMenuItem>{" "}
        {/* Use logoutAndRedirect function here */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
