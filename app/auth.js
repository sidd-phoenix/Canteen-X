import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectMongo from './mongoose'; // Import Mongoose connection
import User from '../models/usermodel'; // Import User model

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account}) {
      await connectMongo(); // Connect to MongoDB

      // Check if user exists in the database
      const existingUser = await User.findOne({ email: user.email });

      // If user does not exist, create a new entry
      if (!existingUser) {
        await User.create({
          googleId: account.id, // Store Google ID if available
          name: user.name,
          email: user.email,
          role: 'customer', // Default role, can be changed as needed
        });
        user.role = 'customer'; // Set role for new user
      } else {
        user.role = existingUser.role; // Get role from existing user
      }
      console.log("signIn",user.role)
      
      return true; // Allow sign-in
    },
    async jwt({ token, user }) {
      // Add user role to the token
      if (user) {
        token.role = user.role; // Add role to the token
        console.log("jwt",token.role)
      }
      return token;
    },
    async session({ session, token }) {
      // Add user role to the session
      if (token) {
        session.user.role = token.role; // Set user role in session
        console.log("session",session)
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
