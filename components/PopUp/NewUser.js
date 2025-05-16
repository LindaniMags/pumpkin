"use client"
import React, { useEffect, useState } from 'react'
import Logo from  '../../assets/images/logo 1.png'
import Image from 'next/image'
import Button from '../UI/Button/Button'
import { useCookies } from 'next-client-cookies'

function NewUserPopUp() {
    const cookies = useCookies()
    const [showUserData, setShowUserData] = useState(false)

    useEffect(() => {
        try {
            // Get the userData cookie and check if it exists
            const userDataCookie = cookies.get('userData');

            // Only proceed if we have a valid cookie value
            if (!userDataCookie || userDataCookie === "undefined") {
                console.log('No valid userData cookie found');
                setShowUserData(false);
                return;
            }

            try {
                // Parse the userData cookie
                const userData = JSON.parse(userDataCookie);

                // Check if the user needs to complete their profile
                if (!userData.profilePicture || !userData.bio ||
                    (userData.hobbies && userData.hobbies.length < 1) ||
                    (userData.passions && userData.passions.length < 1)) {
                    setShowUserData(true);
                } else {
                    setShowUserData(false);
                }
            } catch (parseError) {
                console.error('Error parsing userData JSON:', parseError);
                setShowUserData(false);
            }
        } catch (error) {
            console.error('Error accessing userData cookie:', error);
            setShowUserData(false);
        }
    }, [])

    function closePopUp() {
        setShowUserData(false)
    }

  return (
    <div className={`bg-white flex-col flex items-center px-6 py-8 space-y-8 rounded-2xl shadow-sm ${showUserData ? 'inline' : 'hidden'}`}>
        <div>
            <Image src={Logo} width={100} height={100} className='' alt='profile' />
        </div>
        <div className='flex items-center flex-col'>
            <p className='text-xl font-bold'>Welcome to Pumpkin</p>
            <p className='text-sm text-gray-700'>We need you to complete your profile to get started</p>
            <p></p>
        </div>
        <div className='flex w-full'>
            <Button label={"Close"}  variant={'primary'} onClick={closePopUp}/>
        </div>
    </div>
  )
}

export default NewUserPopUp