// lib/auth.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    console.log("Session in getCurrentUser:", session ? JSON.stringify(session) : "No session");
    return session?.user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}