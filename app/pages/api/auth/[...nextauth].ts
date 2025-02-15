'use server'
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "../../../lib/actions";

interface User {
  id: string;
  username: string;
  password: string;
}


export const { auth, signIn, signOut } =NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<string, unknown>>): Promise<Omit<User, "password"> | null> {
        console.log('authorize function', credentials.username, credentials.password )
        if (!credentials?.username || !credentials?.password) {
          console.error("Missing username or password");
          return null;
        }

        try {
          const username = String(credentials.username);
          const password = String(credentials.password);

          // Fetch user from database
          const user = await getUserByUsername(username);
          console.log(user)
          // const user: User | undefined = result?.[0];

          if (!user) {
            console.error(`User with username ${username} not found.`);
            return null;
          }

          // Compare hashed password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          // Return user data without password
          return { id: user.id, username: user.username };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,

  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log('token1', token);
      // console.log('user1', user);

      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      // console.log('token2', token);
      // console.log('user2', user);
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {} as any;
      }
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      console.log('session', session);
      return session;
    },
  },
  
  secret: process.env.AUTH_SECRET,
});

