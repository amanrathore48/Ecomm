import { withAuth } from "next-auth/middleware";

/**
 * Protect specific routes and redirect to /signin if unauthenticated
 */
export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};
