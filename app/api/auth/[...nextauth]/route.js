import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password, token } = credentials;

        try {
          const user =  await fetch('https://dummyjson.com/auth/login',{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'kminchelle',
              password: '0lelplR',
            })
          })
          const data = await user.json()
          // console.log("user", data)
          if (data?.message === 'Invalid credentials') {
            return null;
          }
        data.name = data.username
        data.userRole = 'user'
        return data
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // console.log('calbacks',user)
      // token.userRole = user.userRole
      if (user) {
        token.userRole = user.userRole
        token.jwtToken = user.token
      }
      // token.jwtToken = user?.token
      return token
    },
    async session({ session, token }) {
      // console.log("token session", token)
      session.user.userRole = token.userRole
      session.user.jwtToken = token.jwtToken
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7200, // 2 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

