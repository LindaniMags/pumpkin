import Image from 'next/image'
import React from 'react'

import LPImage from '../../assets/images/Pumpkin 3.png'
import LPImageSM from '../../assets/images/BG - SM.jpg'

function Slider() {
  return (
    <div className=''>
        <Image src={LPImage} width={1280} height={500} className='hidden lg:inline' alt='profile' />
        <Image src={LPImage} width={800} height={200} className=' lg:hidden object-contain' alt='profile' />
    </div>
  )
}

export default Slider