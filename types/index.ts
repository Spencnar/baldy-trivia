import 'next-auth';
import { DefaultSession } from 'next-auth';
declare module 'next-auth' {
  interface User {
    id: string;
    isAdmin: boolean;
  }

  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
}