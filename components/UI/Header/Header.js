'use client'
import React from 'react'

import Logo from '../../../assets/images/logo 1.png'
import Pumpkin from '../../../assets/images/Pumpkin.svg'
import Image from 'next/image'
import Button from '../Button/Button'
import { useRouter } from 'next/navigation'

function Header() {
    const router = useRouter()
    return (
        <div className="relative w-full 
             bg-white/5 bg-opacity-20 backdrop-blur-lg flex lg:justify-between justify-center px-8 py-4 ">
            <div className="flex justify-between space-x-3 items-center ">
                <Image src={Logo} width={50} height={50}  className='hidden lg:inline pr-4' />
                <Image src={Pumpkin} width={100} height={80} className='lg:scale-125' />
            </div>
            <div className='hidden lg:inline'>
                <div className="flex justify-between space-x-3 items-center "	>
                    <div>
                        <Button label="Log In" variant={"primary"}  onClick={()=> {
                            router.push('../../login')
                        }}  />
                    </div>
                    <div>
                        <Button label="Sign Up" variant={"secondary"}  onClick={()=> {
                            router.push('../../signup')
                        }}  />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header