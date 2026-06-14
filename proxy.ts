import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Function checks whether the current request is trying to visit an admin dashboard route
const isAdminRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/:locale/dashboard(.*)",
]);

// Function checks whether the current request is trying to api or trpc
const isApiRoute = createRouteMatcher(["/api(.*)", "/trpc(.*)"]);

//Build a language-routing handler using supported locales.
const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) await auth.protect();

  //If this is an API route, stop here and do not run next-intl.
  if (isApiRoute(request)) return;

  return intlMiddleware(request);
});

//Tells Next.js which requests should run through proxy.ts.
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/__clerk/(.*)"],
};
