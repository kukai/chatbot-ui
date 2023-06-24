import NextAuth from "next-auth"
import GitHubProvider from 'next-auth/providers/github';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if ALLOWED_USERNAMES is set. If not, deny all logins.
      if (!process.env.ALLOWED_USERNAMES) {
        return false;
      }

      const allowedUsernames = process.env.ALLOWED_USERNAMES.split(',');

      // Only check the username if account is not undefined
      if (profile && allowedUsernames.includes(profile.login)) {
        return true;
      }

      // If the username is not allowed or account is undefined, deny the login
      return false;
    },
  },
};

export default NextAuth(authOptions);
