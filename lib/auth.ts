import { auth } from '@clerk/nextjs/server';

export const getAuth = () => {
  return auth();
};
