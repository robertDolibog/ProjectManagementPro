"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowsUpDown } from "react-icons/fa6";
import { FiInbox } from "react-icons/fi";
import { IoSearch, IoSettingsOutline } from "react-icons/io5";
import { MdDeleteOutline, MdOutlinePostAdd } from "react-icons/md";
import UserNav from "./UserNav";

const Sidebar = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      const response = await fetch("http://localhost:4000/pages", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const pagesData = await response.json();
      setPages(pagesData);
    };

    fetchPages();
  }, []);

  const createPage = async () => {
    const response = await fetch("http://localhost:4000/pages", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "New Page", content: {} }),
    });
    const newPage = await response.json();
    setPages([...pages, newPage]);
  };

  // Example of a delete function
  const deletePage = async (pageId) => {
    console.log("Deleting page with id: ", pageId);
    await fetch(`http://localhost:4000/pages/${pageId}`, {
      method: "DELETE",
      credentials: "include",
    });
    // Update the local state to reflect the change
    setPages(pages.filter((page) => page.id !== pageId));
  };

  return (
    <aside className="w-64 bg-neutral-900 text-gray-100 h-screen">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <UserNav />
          <span className="font-bold">Marlin's Notion</span>
        </div>
        <Button variant="ghost" size="icon">
          <FaArrowsUpDown className="w-5 h-5" />
        </Button>
      </div>
      <nav className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <IoSearch className="w-5 h-5 mr-2" />
          Search
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FiInbox className="w-5 h-5 mr-2" />
          Inbox
        </Button>

        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link href="/my-account">
            <IoSettingsOutline className="w-5 h-5 mr-2" />
            Settings & members
          </Link>
        </Button>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className=" flex justify-between items-center">
          <h2 className="text-xs font-semibold text-gray-400">Shared</h2>
          <Button onClick={createPage}>
            <MdOutlinePostAdd />
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          <div>
            {pages.map((page) => (
              <div key={page.id}>
                <Link href={`/page/${page.id}`}>{page.title}</Link>{" "}
                {/* Link to the page */}
                <Button onClick={() => deletePage(page.id)}>
                  <MdDeleteOutline />
                </Button>{" "}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400">Private</h2>
        <div className="mt-2 space-y-1">
          {[
            "Snipo Notes",
            "Ali's Guide to Life",
            "Tasks",
            "Projects",
            "Personal stuff",
          ].map((item) => (
            <Button key={item} variant="ghost" className="w-full justify-start">
              {item}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
