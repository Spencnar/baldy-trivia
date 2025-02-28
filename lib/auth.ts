import { getServerSession } from 'next-auth/next';

export async function getCurrentUser() {
  const session = await getServerSession();
  console.log('Current session:', session);
  return session?.user;
}