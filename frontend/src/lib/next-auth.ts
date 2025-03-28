import { NextAuthOptions } from "next-auth";
import { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import connectMongo from "@/lib/mongo";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    ...(process.env.MONGODB_URI
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER ?? "",
            from: "mail@example.com",
          }),
        ]
      : []),
  ],
  ...(process.env.MONGODB_URI && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-email",
  },
};
