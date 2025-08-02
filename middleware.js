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
    // Temporarily commenting out checkout protection to troubleshoot authentication issue
    // "/checkout/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};
