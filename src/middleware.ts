import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  // Always allow access to auth API routes
  if (isApiAuth) return;

  // Redirect logged-in users away from login page
  if (isOnLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  // Redirect unauthenticated users to login (except for login page itself)
  if (!isLoggedIn && !isOnLoginPage) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  // Match all routes except static files and images
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
