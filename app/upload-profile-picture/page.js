'use client'
import React from 'react'
import SimpleImageUpload from '@/components/ImageUpload/SimpleImageUpload'
import MainHeader from '@/components/UI/Header/MainHeader'

export default function UploadProfilePicturePage() {
  return (
    <main className="flex justify-center h-screen w-full overflow-auto bg-gradient-to-l from-[#FFFFFF] to-[#FFFFFF] z-[-1]">
      <span className='absolute z-50 w-full'>
        <MainHeader />
      </span>
      <div className='flex items-center justify-center w-full'>
        <SimpleImageUpload type="profile" />
      </div>
    </main>
  )
}
