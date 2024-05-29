/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DQ7Ycstq007
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Component() {
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
                    <Button variant="outline">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload New Picture
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
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

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
