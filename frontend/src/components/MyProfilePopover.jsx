"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyProfilePopover() {
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <Avatar className="h-10 w-10">
            <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="flex-col flex justify-center items-center gap-5">
            <h4 className="font-medium leading-none">Username</h4>
            <button onClick={handleLogout} className="text-sm text-gray-500">
              Logout
            </button>
            <Link href="/my-account" className="text-sm text-gray-500">
              My Account
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
