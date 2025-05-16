'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import LPImage from '../../assets/images/LP-Image.png'
import LPImageSM from '../../assets/images/BG - SM.jpg'
import Button from '../UI/Button/Button'
import TextInput from '../UI/Text Input/TextInput'
import { setCookie } from 'cookies-next'
import Link from 'next/link'
import Loader from '../UI/Loader'
import WelcomeUserPopUp from '../PopUp/WelcomeUser'

function LoginHome() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [users, setUsers] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [loader, setLoader] = useState(false)
    const [showWelcomePopup, setShowWelcomePopup] = useState(false)

    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        setLoader(true);
        const timer = setTimeout(() => setLoader(false), 1000);
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    useEffect(() => {
        fetch('/api/auth')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data)
            })
    }, [])

    if (loader) {
        return (
            <div className="relative items-center justify-center flex h-full w-full">
                <Loader />
            </div>
        );
    }


    function handleSubmitThirdForm(e) {
        e.preventDefault();
        setLoader(true)
        const selectedUser = users.find(
            (user) => user.email === email
        );
        setCookie('email', email)
        setCookie('userData', selectedUser)

        if (!selectedUser) {
            setErrorMessage('Account not found. Please try again')
            setLoader(false)
        } else {
            if (selectedUser.password === password) {
                // Show welcome popup after successful login
                setShowWelcomePopup(true)

                // Navigate to appropriate page
                if (!selectedUser.profilePicture) {
                    router.push('../../profile')
                } else {
                    router.push('../../feed')
                }
            } else {
                setPasswordErrorMessage("Incorrect Email/Password!")
                setLoader(false)
            }
        }
    }

    return (
        <div className="relative items-center justify-center flex h-full w-full">
            {showWelcomePopup && <WelcomeUserPopUp />}
            <div className="lg:grid grid-cols-12 items-center">
                <div className='hidden lg:inline col-span-6'>
                    <div className="  col-span-6 flex-col space-y-3 text-white flex  items-start px-12 ">
                        <div className="text-white flex justify-start flex-col items-start font-bold space-y-2 text-8xl">
                            <p>Welcome</p>
                            <p>To Pumpkin</p>
                        </div>
                        <p className='text-xl'>Where true love meets fortune</p>
                        <div className='pt-12'>
                            <Button label="Create Account" variant={"secondary"} />
                        </div>
                    </div>
                </div>
                <div className="  col-span-6">
                    <Image src={LPImage} width={1200} height={500} className='hidden lg:inline' alt='profile' />
                    <Image src={LPImageSM} width={1200} height={500} className='lg:hidden ' alt='profile' />
                </div>
            </div>
            <span className='absolute z-50 bottom-0 rounded-t-full lg:top-[30vh] lg:left-[30%]'>
                <div className=' lg:max-w-[100px] rounded-t-full'>
                    <div className=" bg-white/5 rounded-3xl bg-opacity-20 py-8 lg:py-12  space-y-4 backdrop-blur-lg w-screen   col-span-6 flex-col  text-white flex  items-center px-6 lg:max-w-[500px]">
                        <div className='flex flex-col space-y-4 items-start w-full'>
                            <p className='lg:text-4xl text-2xl font-bold '>Sign Up</p>
                            <div className='text-red-600'>
                                <p>{errorMessage}</p>
                                <p>{passwordErrorMessage}</p>
                            </div>
                        </div>
                        <div className='w-full space-y-6'>
                            <TextInput label={'Email'} value={email} onChange={(e) => setEmail(e.target.value)} />
                            <TextInput type={'password'} label={'Password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <div className='flex space-x-2 text-sm'>
                                <p>Don&apos;t have an account yet? </p>
                                <Link href={'../../signup'}>
                                    <p className='font-bold text-blue-600 hover:underline active:scale-105 cursor-pointer'>Sign Up</p>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <Button loader={loader} label="Login" variant={"primary"} onClick={handleSubmitThirdForm} />
                        </div>
                    </div>
                </div>
            </span>
            <span className='absolute z-40 -'>
                <div className='bg-black h-screen w-screen opacity-60' />
            </span>
        </div>
    )
}

export default LoginHome