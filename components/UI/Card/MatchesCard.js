import React from 'react'
import UserImage from '../../../assets/images/User01.png'
import Image from 'next/image'

function MatchesCard() {
    return (
        <div className='shadow-lg relative'>
            <span className=' absolute bottom-0  bg-gradient-to-t from-black/80 to-black/0 h-[10vh] lg:h-[15vh]   rounded-b-[12px] px-2 lg:px-6'>
                <div className='lg:space-y-2 -space-y-1  pt-8'>
                    <div className='flex font-bold text-white text-xl lg:text-3xl space-x-3'>
                        <p>Thaisa</p>
                        <p>X</p>
                        <p>25</p>
                    </div>
                    <div className='flex text-white lg:text-xl  space-x-2'>
                        <p>42 Pumkins</p>
                        <p>-</p>
                        <p>8 Hickies</p>
                    </div>
                    <div className='flex pt-2'>
                        <div className='flex font-bold lg:text-lg text-xs  bg-white text-blue-600 rounded-full lg:px-4 px-2 py-1 flex-wrap '>
                            <p>New</p>
                        </div>
                    </div>
                </div>
            </span>
            <Image src={UserImage} width={400} height={200} />
        </div>
    )
}

export default MatchesCard