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
    session: async (session, user) => {
      session.accessToken = user.accessToken;
      session.refreshToken = user.refreshToken;
      session.user = {...session.user, ...user};
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
