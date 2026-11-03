
import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://event-8-server.onrender.com',

  plugins: [
    jwtClient()
  ]
});

export const {
  signIn,
  signUp,
  signOut,
  useSession
} = authClient;
