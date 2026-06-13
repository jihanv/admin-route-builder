import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const isAdminRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/:locale/dashboard(.*)",
]);

const isApiRoute = createRouteMatcher(["/api(.*)", "/trpc(.*)"]);

const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) await auth.protect();

  if (isApiRoute(request)) return;

  return intlMiddleware(request);
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/__clerk/(.*)"],
};
