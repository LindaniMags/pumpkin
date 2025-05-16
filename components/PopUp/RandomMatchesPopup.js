"use client"
import React, { useEffect, useState } from 'react'
import Logo from '../../assets/images/logo 1.png'
import Image from 'next/image'
import Button from '../UI/Button/Button'
import { useCookies } from 'next-client-cookies'
import { useRouter } from 'next/navigation'
import { setCookie } from 'cookies-next'
import { BiHeart, BiX } from 'react-icons/bi'

function RandomMatchesPopup() {
    const cookies = useCookies()
    const router = useRouter()
    const [showPopup, setShowPopup] = useState(false)
    
    // Messages to show randomly
    const messages = [
        "Looking for love? Check out your matches!",
        "Someone special might be waiting for you!",
        "New matches are waiting to connect with you!",
        "Don't miss out on potential connections!",
        "Find your perfect match today!"
    ]
    
    // Randomly select a message
    const [message, setMessage] = useState("")

    useEffect(() => {
        // Get the last time the popup was shown
        const lastShown = cookies.get('lastMatchesPopupShown')
        const now = new Date().getTime()
        
        // Only show popup if it hasn't been shown in the last 30 minutes (1800000 ms)
        // or if it's never been shown before
        if (!lastShown || (now - parseInt(lastShown)) > 1800000) {
            // Random chance (20%) to show the popup
            if (Math.random() < 0.2) {
                // Select a random message
                const randomMessage = messages[Math.floor(Math.random() * messages.length)]
                setMessage(randomMessage)
                setShowPopup(true)
                
                // Update the last shown time
                setCookie('lastMatchesPopupShown', now.toString())
            }
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
            <div className="bg-white flex-col flex items-center px-6 py-8 space-y-6 rounded-2xl shadow-sm max-w-md w-full mx-4 relative">
                <button 
                    onClick={closePopUp}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <BiX className="text-2xl" />
                </button>
                
                <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full">
                    <BiHeart className="text-3xl text-pink-500" />
                </div>
                
                <div className='flex items-center flex-col text-center'>
                    <p className='text-xl font-bold'>Find Your Match!</p>
                    <p className='text-sm text-gray-700 mt-2'>
                        {message}
                    </p>
                </div>
                
                <div className='flex w-full'>
                    <Button label={"Go to Matches"} variant={'primary'} onClick={goToMatches} />
                </div>
            </div>
        </div>
    )
}

export default RandomMatchesPopup
