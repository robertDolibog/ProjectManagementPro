"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import InputField from "@/components/InputField";

export default function LoginForm() {
  const router = useRouter(); // Use Next.js's router

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin
      ? "http://localhost:4000/signin"
      : "http://localhost:4000/signup";
    const body = isLogin
      ? { email, password }
      : { name: username, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log("data response in frontend after signin", data);
      console.log("response in frontend after signin", response);

      if (response.ok ) {
        // Sign-in or sign-up was successful
        // Fetch all pages for the user
        const pagesResponse = await fetch("http://localhost:4000/pages", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const pagesData = await pagesResponse.json();

        if (pagesResponse.ok) {
          // Find the most recent page
          const mostRecentPage = pagesData.reduce((latestPage, currentPage) => {
            const latestDate = new Date(latestPage.createdAt);
            const currentDate = new Date(currentPage.createdAt);
            return currentDate > latestDate ? currentPage : latestPage;
          });

          // Redirect to the most recent page
          router.push(`/pages/${mostRecentPage.id}`);
        } else {
          // Handle error in fetching the pages
          console.log("Error: Unable to fetch the pages", pagesData);
          setError("Unable to fetch the pages.");
        }
      } else {
        // Sign-in or sign-up failed
        // Show an error message
        console.log("Error: Operation not successful!", data);
        setError(data.message);
      }
    } catch (error) {
      console.error("Error making fetch request:", error);
    }
  };

  return (
    <main className="h-screen flex flex-col justify-center items-center bg-black">
      <form
        onSubmit={handleSubmit}
        suppressHydrationWarning={true}
        className="w-auto flex flex-col items-center mt-12"
      >
        <section className="bg-green-900 z-20 flex flex-col w-[35vw] items-center px-20 py-10 rounded-lg">
          <h1 className="text-white text-2xl font-bold">
            {isLogin ? "Login to see your Projects" : "Register for an account"}
          </h1>
          <h2 className="text-white mt-1">Please enter your details</h2>
        </section>
        <div className="-mt-16 flex items-center flex-col p-24 rounded-2xl bg-white">
          {!isLogin && (
            <InputField
              label="Name"
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="name"
            />
          )}
          <InputField
            label="E-Mail"
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <InputField
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-16 py-2 rounded-lg mt-6"
          >
            {isLogin ? "SIGN IN" : "SIGN UP"}
          </button>
          <button
            type="button"
            className="mt-4 text-blue-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {error && <p className="text-red-500">{error}</p>}
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </main>
  );
}

