import { getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';

export async function getSession() {
  return await getServerSession();
}

export async function getCurrentUser() {
  const session = await getSession();
  console.log('Current session:', session);
  return session?.user;
}