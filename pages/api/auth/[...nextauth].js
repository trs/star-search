import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  debug: true,
  session: {
    jwt: true
  },
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'repo'
    })
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error'
  },
  callbacks: {
    signIn: async (user, account, profile, ...args) => {
      return true;
    },
    session: async (session, user) => {
      session.accessToken = user.accessToken;
      session.refreshToken = user.refreshToken;
      return session;
    },
    jwt: async (token, user, account, profile) => {
      return {
        ...token,
        ...user,
        ...profile,
        ...account,
      };
    }
  }
};

export default (req, res) => NextAuth(req, res, options);
