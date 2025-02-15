
import React from 'react';
import { auth } from '../../pages/api/auth/[...nextauth]';
import { type User } from 'next-auth';
export default async function userInfoPage() {
    const session = await auth()

    const SignedIn = ({ user }: { user: User }) => {
        console.log('user', user)
        console.log('username', user.username)
        console.log('username', user.id)
        return <div>Welcome, {user.username}, {user.id} </div>
                
    }

    return (
        <div>
            {!!session?.user ? <SignedIn user={session.user} /> : <div>Please sign in</div>}
        </div>
    )
}