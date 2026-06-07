import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/:locale/admin(.*)"]);

const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware((_auth, request) => {
  return intlMiddleware(request);
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)", "/__clerk/(.*)"],
};
