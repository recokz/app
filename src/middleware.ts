import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|media|fonts|favicon.ico|favicon.png).*)",
      missing: [
        // Exclude Server Actions
        { type: "header", key: "next-action" },
      ],
    },
  ],
};
