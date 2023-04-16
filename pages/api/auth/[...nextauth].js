import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { dbConnect } from "../../../config";
import { User } from "../../../models";
import { compare } from "bcryptjs";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      async authorize(credentials, req) {
        await dbConnect().catch((error) => {
          console.error(error);
          throw new Error("DB not connected");
        });

        //check user existance
        const result = await User.findOne({ email: credentials.email });
        if (!result) {
          throw new Error("User not found");
        }

        // compare hash
        const checkPass = await compare(credentials.password, result.password);

        if (!checkPass || result.email !== credentials.email) {
          throw new Error("Username or Password doesn't match");
        }

        return result;
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 10 * 60 * 60,
  },
  jwt: {
    secret: "mytopsecret",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.id = user._id;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
