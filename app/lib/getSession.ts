'use server'
import { auth } from '../pages/api/auth/[...nextauth]';
import { type User } from 'next-auth';
export default async function getSession() {
    const session = await auth()
    return session?.user
    
    

   
}