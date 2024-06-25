'use client'
import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Footer({ user, type='desktop' }: FooterProps) {
    const router = useRouter();
    const handleLogout = async () => {
        const loggedOut = await logoutAccount();
        loggedOut && router.push('/sign-in');
    }

    return (
        <footer className='footer'>
            <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
                <p className='text-xl font-bold text-gray-700'>
                    {user?.firstName[0]}
                </p>
            </div>

            <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
                <h1 className='text-14 truncate text-gray-700 font-semibold'>
                    {user?.firstName}
                </h1>
                <p className='text-14 truncate font-name text-gray-600'>
                    {user.email}
                </p>
            </div>

            <div className='footer_image' onClick={handleLogout}>
                <Image 
                    src={'icons/logout.svg'}
                    fill
                    alt='jsm'
                />
            </div>
        </footer>
    )
}
