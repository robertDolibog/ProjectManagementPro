import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { LuBriefcase, LuCalendar, LuGrid, LuList } from "react-icons/lu";
import NotificationBell from "./NotificationBell";
import UserNav from "./UserNav";

export default function MyHeader() {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link className="flex items-center gap-2" href="/">
          <LuBriefcase className="w-6 h-6" />
          <span className="text-xl font-bold">Project Manager</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link className="hover:underline" href="/projects">
            Projects
          </Link>
          <Link className="hover:underline" href="/tasks">
            Tasks
          </Link>
          <Link className="hover:underline" href="#">
            Calendar
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="rounded-full lg:hidden"
              size="icon"
              variant="ghost"
            >
              <IoMenu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-4 p-6">
              <Link className="flex items-center gap-2" href="#">
                <LuBriefcase className="w-6 h-6" />
                <span className="text-xl font-bold">Project Manager</span>
              </Link>
              <nav className="grid gap-2">
                <Link
                  className="flex items-center gap-2 hover:underline"
                  href="#"
                >
                  <LuGrid className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  className="flex items-center gap-2 hover:underline"
                  href="#"
                >
                  <LuBriefcase className="w-4 h-4" />
                  Projects
                </Link>
                <Link
                  className="flex items-center gap-2 hover:underline"
                  href="#"
                >
                  <LuList className="w-4 h-4" />
                  Tasks
                </Link>
                <Link
                  className="flex items-center gap-2 hover:underline"
                  href="#"
                >
                  <LuCalendar className="w-4 h-4" />
                  Calendar
                </Link>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <UserNav />
        <NotificationBell />
      </div>
    </header>
  );
}
