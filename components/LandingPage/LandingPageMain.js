'use client'
import Image from 'next/image'
import React from 'react'

import LPImage from '../../assets/images/LP-Image.png'
import LPImageSM from '../../assets/images/BG - SM.jpg'
import Button from '../UI/Button/Button'
import { useRouter } from 'next/navigation'

function LandingPageMain() {
    const router = useRouter();

    return (
        <div className="relative items-center justify-center flex h-full w-full ">
            <div className="lg:grid grid-cols-12 items-center">
                <div className='hidden lg:inline col-span-6'>
                    <div className="  col-span-6 flex-col space-y-3 text-white flex  items-start px-12 ">
                        <div className="text-white flex justify-start flex-col items-start font-bold space-y-2 text-6xl">
                            <p>Welcome</p>
                            <p>To Pumpkin</p>
                        </div>
                            <p className=''>Where true love meets fortune</p>
                        <div className='pt-12'>
                            <Button label="Create Account" variant={"secondary"} onClick={()=> {
                                router.push('../../signup')
                            }} />
                        </div>
                    </div>
                </div>
                <div className="  col-span-6">
                    <Image src={LPImage} width={1200} height={500} className='hidden lg:inline' alt='profile'/>
                    <Image src={LPImageSM} width={1200} height={500} className='lg:hidden ' alt='profile'/>
                </div>
            </div>
            <span className='absolute z-50 top-[30vh]'>
                <div className='lg:hidden'>
                    <div className="  col-span-6 flex-col space-y-3 text-white flex  items-center px-4 ">
                        <div className="text-white flex justify-center flex-col items-center font-bold space-y-0 text-4xl">
                            <p>Welcome</p>
                            <p>To Pumpkin</p>
                        </div>
                        <p className=''>Where true love meets fortune</p>
                        <div className='pt-12 space-y-4 flex items-center justify-center flex-col'>
                            <Button label="Create Account" variant={"secondary"}  onClick={()=> {
                                router.push('../../signup')
                            }}  />
                            <Button label="Log In" variant={"primary"}  onClick={()=> {
                                router.push('../../login')
                            }}  />
                        </div>
                    </div>
                </div>
            </span>
        </div>
    )
}

export default LandingPageMain