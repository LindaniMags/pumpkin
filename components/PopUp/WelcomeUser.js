"use client"
import React, { useEffect, useState } from 'react'
import Logo from '../../assets/images/logo 1.png'
import Image from 'next/image'
import Button from '../UI/Button/Button'
import { useCookies } from 'next-client-cookies'
import { useRouter } from 'next/navigation'
import { setCookie } from 'cookies-next'

function WelcomeUserPopUp() {
    const cookies = useCookies()
    const router = useRouter()
    const [showPopup, setShowPopup] = useState(false)
    const [loginCount, setLoginCount] = useState(0)

    useEffect(() => {
        // Get the current login count from cookies or set to 1 if it doesn't exist
        const currentLoginCount = parseInt(cookies.get('loginCount') || '0')
        const newLoginCount = currentLoginCount + 1
        
        // Only show popup for the first 3 logins
        if (newLoginCount <= 3) {
            setShowPopup(true)
            setLoginCount(newLoginCount)
            // Update the login count in cookies
            setCookie('loginCount', newLoginCount.toString())
        } else {
            setShowPopup(false)
        }
    }, [])

    function closePopUp() {
        setShowPopup(false)
    }

    function goToMatches() {
        setShowPopup(false)
        router.push('../../matches')
    }

    // If popup shouldn't be shown, return null
    if (!showPopup) {
        return null
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white flex-col flex items-center px-6 py-8 space-y-8 rounded-2xl shadow-sm max-w-md w-full mx-4">
                <div>
                    <Image src={Logo} width={100} height={100} className='' alt='Pumpkin logo' />
                </div>
                <div className='flex items-center flex-col text-center'>
                    <p className='text-2xl font-bold'>Welcome to Pumpkin!</p>
                    <p className='text-sm text-gray-700 mt-2'>
                        Where true love meets fortune. We're excited to have you join our community!
                    </p>
                    <p className='text-sm text-gray-700 mt-4'>
                        Check out your potential matches and start connecting with people who share your interests.
                    </p>
                </div>
                <div className='flex w-full flex-col space-y-3'>
                    <Button label={"Go to Matches"} variant={'primary'} onClick={goToMatches} />
                    <Button label={"Close"} variant={'secondary'} onClick={closePopUp} />
                </div>
                <div className='text-xs text-gray-500'>
                    {loginCount === 1 ? 'First time welcome!' : 
                     loginCount === 2 ? 'Welcome back!' : 
                     'Final welcome reminder!'}
                </div>
            </div>
        </div>
    )
}

export default WelcomeUserPopUp
