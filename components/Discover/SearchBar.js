'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { BiFilter, BiImageAdd, BiSearch } from 'react-icons/bi'
import Image01 from '../../assets/images/User-Ex.jpg'
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies'
import { setCookie } from 'cookies-next';

export default function SearchBar() {
  const cookies = useCookies();
  const router = useRouter()
  const [selectedUserData, setSelectedUserData] = useState(null)
  const [users, setUsers] = useState([])
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestionBox, setShowSuggestionBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("")

  useEffect(() => {
    const _id = cookies.get('selectedUserProfile')
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
      })
  }, [cookies])

  useEffect(() => {
    if (searchQuery && searchQuery.length === 0) {
      setShowSuggestionBox(false);
    }
    const filteredUsers = users.filter((user) =>
      user && user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSuggestedUsers(filteredUsers);
  }, [searchQuery, users]);

  const handleSearch = (e) => {
    setShowSuggestionBox(true);
    setSearchQuery(e.target.value);
  };

  function calculateAge(dateString) {
    if (!dateString) return 0;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  function getSurnameInitials(surname) {
    if (!surname) return '';
    const surnameWords = (surname || '').trim().split(' ');
    const initials = surnameWords.map(word => word.charAt(0).toUpperCase());
    const initialsString = initials.join('');
    return initialsString;
  }

  return (
    <div>
      <div className='flex w-full flex-col space-y-8 py-12 lg:py-24 lg:px-6 px-4 lg:items-center'>
        <p className='font-extrabold text-2xl lg:text-5xl lg:pb-6'>Discover Potential Dates</p>
        <div className='space-x-4 relative flex items-center'>
          <input
            placeholder='Search people...'
            className='placeholder-black py-4 px-16 text-lg rounded-md w-full lg:w-[40vw]'
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className='hidden lg:inline'>
            <BiFilter className='cursor-pointer hover:scale-105 text-5xl' />
          </div>
          <span className='absolute text-3xl left-5 '>
            <BiSearch />
          </span>
          <span className={`absolute top-[115%] max-h-[50vh] overflow-auto z-[100] rounded-xl -left-4 w-full lg:w-[40vw] bg-white ${showSuggestionBox ? 'block' : 'hidden'}`}>
            {suggestedUsers.map((suggestedUser, index) => (
              <div key={index} className='lg:px-6 px-4 py-6 flex space-x-4 border-b border-gray-100 w-full cursor-pointer' onClick={() => {
                router.push('../../../user-profile')
                setCookie('selectedUserProfile', suggestedUser._id)
              }}>
              {suggestedUser.profilePicture ?
                <Image src={suggestedUser.profilePicture} width={50} height={50} className='rounded-full' alt='profile' />
                : <div onClick={() => setShowCropper(true)} className='bg-gray-300 flex items-center justify-center  h-[50px] w-[50px] rounded-full '>
                    <BiImageAdd className='opacity-60 cursor-pointer active:scale-105' />
                </div>
            }
                <div className='flex flex-col space-y-1'>
                  <div className='flex font-bold  space-x-4'>
                    <p>{suggestedUser.name}</p>
                    <p>{getSurnameInitials(suggestedUser.surname)}</p>
                    <p>{calculateAge(suggestedUser.dob)}</p>
                  </div>
                  <div className='text-gray-500 flex text-sm space-x-4'>
                    <div className='space-x-2 flex '>
                      <p className='font-bold'>{suggestedUser.pumpkins}</p>
                      <p>Pumpkins</p>
                    </div>
                    <div className='space-x-2 flex '>
                      <p className='font-bold'>{suggestedUser.hickies}</p>
                      <p>Hickies</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
            <div className='w-full items-center justify-center'>
              <div className='space-x-2 flex items-center justify-center py-2 text-gray-500 '>
                <p className='font-bold'>{suggestedUsers.length}</p>
                <p>Result(s)</p>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  )
}