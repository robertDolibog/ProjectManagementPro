import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Exclude the sign-in and sign-up pages from the authentication check
  if (pathname === "/signin" || pathname === "/signup") {
    try {
      // Perform the authentication check
      const res = await fetch("http://app:4000/session", {
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie"), // Forward cookies to backend
        },
        credentials: "include", // Include credentials (cookies) in the request
      });

      const data = await res.json();

      if (res.status === 200) {
        console.log("response arriving in middleware", data.session);
        console.log(request.url, "req url");
        return NextResponse.redirect(new URL("/", request.url));
      } else {
        return NextResponse.next();
      }
    } catch (err) {
      console.error("Error checking session:", err);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  try {
    // Perform the authentication check
    const res = await fetch("http://app:4000/session", {
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie"), // Forward cookies to backend
      },
      credentials: "include", // Include credentials (cookies) in the request
    });

    const data = await res.json();

    if (res.status === 200) {
      console.log("response arriving in middleware", data.session);
      return NextResponse.next();
    } else {
      console.log(request.url, "req url");
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch (err) {
    console.error("Error checking session:", err);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

// Define the routes where the middleware should be applied

export const config = {
  matcher: [
    "/((?!api|_next|static|placeholder.svg|favicon.ico|public|.*\\.map).*)",
  ],
};
