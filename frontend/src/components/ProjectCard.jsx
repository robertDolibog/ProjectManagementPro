/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KbcW9BGM8Tm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function ProjectCard(project) {
  const [priority, setPriority] = useState("High");
  return (
    <Card className="w-full max-w-sm bg-gray-950 rounded-lg shadow-md">
      <CardHeader className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div>
            <CardTitle className="text-lg font-medium">
              {project.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              {project.content}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              priority === "High"
                ? "bg-yellow-900 text-yellow-100"
                : priority === "Medium"
                ? "bg-orange-900 text-orange-100"
                : "bg-red-900 text-red-100"
            }`}
          >
            {priority}
          </div>
          <div className="text-sm text-gray-400">Due: May 15</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Assigned to John Doe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Due: May 15</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-gray-200"
            onClick={() => setPriority("High")}
          >
            <div className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">High Priority</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-gray-200"
            onClick={() => setPriority("Medium")}
          >
            <div className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Medium Priority</span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-gray-200"
            onClick={() => setPriority("Low")}
          >
            <div className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Low Priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
