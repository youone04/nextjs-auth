// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware"

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req, token }) {
        // console.log("token", token)
        // console.log("req", req)
      // `/admin` requires admin role
      if (req.nextUrl.pathname === "/dashboard") {
        return token?.userRole === "admin" || token?.userRole === "user"
      }
      if (req.nextUrl.pathname === "/user") {
        return token?.userRole ===  "user"
      }
      // `/me` only requires the user to be logged in
      return !!token
    },
  },
})



export const config = { matcher: ["/dashboard","/user"] };
