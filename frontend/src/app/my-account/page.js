"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploader } from "@/components/Utils/FileUploader";

export default function MyAccount() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="text-lg font-semibold">Jared Palmer</div>
            <div className="text-sm text-gray-400">@jaredpalmer</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link className="hover:underline" href="#">
            Account
          </Link>
          <Link className="hover:underline" href="#">
            Logout
          </Link>
          <Button size="icon" variant="outline">
            <UploadIcon className="h-5 w-5" />
            <span className="sr-only">Upload profile picture</span>
          </Button>
        </nav>
      </header> */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Email Address</h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    defaultValue="jared@example.com"
                    id="email"
                    type="email"
                  />
                </div>
                <Button className="ml-auto">Save</Button>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Password</h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <Button className="ml-auto">Save</Button>
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Profile Picture</h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage alt="@shadcn" src="/placeholder-avatar.jpg" />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                  <FileUploader />{" "}
                  {/* FileUploader component implemented through Uploadcare */}
                </div>
                <Button className="ml-auto">Save</Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
