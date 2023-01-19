import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";
const client_id = 'ddd142437d40434c85be1ec116120b83'
const client_secret = '2832627dd6fe497dbbb3302383412835'

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  try {
    const url =
      "https://accounts.spotify.com/api/token?" +
      new URLSearchParams({
        clientId: client_id,
        clientSecret: client_secret,
        grant_type: "refresh_token" as string,
        refresh_token: token.refreshToken as string,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
 
    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: client_id,
      clientSecret: client_secret,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,user-read-email,streaming,user-read-private,user-library-read,user-library-modify,user-read-playback-state,user-modify-playback-state,user-read-recently-played,user-follow-read" as string,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token as any,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if ((Date.now() < token.accessTokenExpires) as unknown) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
});
