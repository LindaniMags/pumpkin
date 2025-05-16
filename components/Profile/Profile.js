'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Button from '../UI/Button/Button'
import { useRouter } from 'next/navigation'
import { getCookie, setCookie } from 'cookies-next'
import { useCookies } from 'next-client-cookies'
import { BiImageAdd, BiPlus, BiUserPlus } from 'react-icons/bi'
import Loader from '../UI/Loader'
import ProfilePictureEditor from '../ProfilePicture/ProfilePictureEditor'


function ProfileHome() {
    const cookies = useCookies();
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [bio, setBio] = useState()
    const [hobby, setHobby] = useState()
    const [hobbies, setHobbies] = useState([])
    const [passion, setPassion] = useState()
    const [passions, setPassions] = useState([])
    const [setshowEditBox, setSetshowEditBox] = useState(false)
    const [DOB, setDOB] = useState()
    const [userPosts, setUserPosts] = useState([])
    const [posts, setPosts] = useState([])
    const [incomeRange, setIncomeRange] = useState("")
    const [incomeRangeMatch, setIncomeRangeMatch] = useState("")
    const [facebookLink, setFacebookLink] = useState("")
    const [instagramLink, setInstagramLink] = useState("")
    const [twitterLink, setTwitterLink] = useState("")
    const [isProfilePictureEditorOpen, setIsProfilePictureEditorOpen] = useState(false)
    function handleSubmit(e) {
        e.preventDefault();

        let res = fetch("/api/edit-profile", {
            method: "PUT",
            body: JSON.stringify({
                "email": user.email,
                "dob": DOB,
                "bio": bio,
                "hobbies": hobbies,
                "passions": passions,
            }),
        }).then(async (response) => {
            const result = await response.json();
            ("Profile Updated")
            setSetshowEditBox(false)
            const selectedUser = users.find(
                (used) => used.email === user.email
            );
            console.log(selectedUser);
            setCookie('userData', selectedUser)
            setUser(selectedUser)
        });

    }

    useEffect(() => {
        const email = cookies.get('email');

        fetch('/api/auth')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                const selectedUser = data.find(
                    (user) => user.email === email
                );
                console.log(selectedUser);
                if (selectedUser) {
                    setUser(selectedUser);
                }
            })
            .catch((error) => {
                console.error("Error fetching auth data:", error);
            });

        fetch('/api/post-image')
            .then((res) => res.json())
            .then((data) => {
                const selectedPosts = data.filter(
                    (post) => post.email === email
                );
                console.log(selectedPosts);
                if (selectedPosts.length > 0) {
                    setUserPosts(selectedPosts);
                }
            })
            .catch((error) => {
                console.error("Error fetching post data:", error);
            });

    }, [cookies]);

    useEffect(() => {
        console.log("userPosts", userPosts);
    }, [userPosts]);



    function formatDate(dateString) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const monthIndex = date.getMonth();
        const month = months[monthIndex];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    // Example usage
    const dateString = "1990-01-01";
    const formattedDate = formatDate(dateString);
    console.log(formattedDate); // Output: "01 January 1990"

    function calculateAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Example usage
    const dateOfBirth = "1990-01-01";
    const age = calculateAge(dateOfBirth);
    console.log(`Your age is ${age} years.`); // Output: Your age is 33 years.


    if (user) {
        return (
            <div className=' relative bg-gradient-to-b space-y-6 bg-slate-100 lg:py-16 py-2 px-6 lg:px-16'>

                <div className='flex flex-col lg:flex-row items-center lg:space-y-0 space-y-6 lg:space-x-12'>
                    <div className='relative'>
                        {user.profilePicture ? (
                            <div className="relative group">
                                <Image
                                    src={user.profilePicture}
                                    width={100}
                                    height={100}
                                    className='rounded-full object-cover w-[100px] h-[100px]'
                                    alt='profile'
                                    unoptimized={true}
                                    priority={true}
                                    loader={({ src }) => src}
                                    onError={(e) => {
                                        console.error("Error loading profile image:", e);
                                        e.target.src = "https://via.placeholder.com/100?text=Profile";
                                    }}
                                />
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => setIsProfilePictureEditorOpen(true)}
                                >
                                    <BiImageAdd className='text-white text-2xl' />
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => setIsProfilePictureEditorOpen(true)}
                                className='bg-gray-300 flex items-center justify-center h-[100px] w-[100px] rounded-full p-6 cursor-pointer hover:bg-gray-400 transition-colors'
                            >
                                <BiImageAdd className='text-4xl active:scale-105' />
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col items-center lg:items-start space-y-2'>
                        <div className='flex font-bold text-xl space-x-2 lg:space-x-4 lg:text-2xl'>
                            <p className=''>{user.name}</p>
                            <p className=''>{user.surname}</p>
                            {user.dob ?
                                <p>{calculateAge(user.dob)}</p>
                                :
                                <p></p>
                            }
                        </div>

                        <div className='flex flex-col lg:flex-row lg:space-y-0 space-x-0 lg: lg:space-x-2 items-center justify-center  text-base  '>
                            <p className='text-gray-600'>@{user.username}</p>
                            {user.dob ?
                                <p>Born {formatDate(user.dob)}</p>
                                :
                                <p ></p>
                            }
                        </div>
                    </div>
                </div>
                <div className='flex space-y-16 lg:space-y-0  flex-col lg:flex-row items-center lg:justify-between w-full'>
                    <div className='flex items-center space-x-4'>
                        <div className='flex  space-x-2 '>
                            <p className='font-bold'>{user.posts.length}</p>
                            <p>Posts</p>
                        </div>
                        <div className='flex  space-x-2 '>
                            <p className='font-bold'>{user.pumpkins ? user.pumpkins : 0}</p>
                            <p>Pumkins</p>
                        </div>
                        <div className='flex  space-x-2 '>
                            <p className='font-bold'>{user.hickies ? user.hickies : 0}</p>
                            <p>Hickies</p>
                        </div>
                    </div>

                    <div className='flex lg:space-x-16  lg:flex-row   items-center space-y-6 flex-col lg:space-y-0 '>
                        <div className='flex space-x-12 text-blue-600 '>
                            <p className='hover:scale-105 cursor-pointer active:bg-gray-200' onClick={() => router.push('../../upload-cover-picture')}>Add Cover Picture</p>
                            <p className='hover:scale-105 cursor-pointer active:bg-gray-200' onClick={() => setSetshowEditBox(true)}>Edit Profile</p>
                        </div>
                        <div>
                            <Button label={"Post"} variant={"primary"} onClick={() => {
                                router.push('../../post')
                            }} />
                        </div>
                    </div>
                </div>

                <div className=' grid grid-rows-2 lg:grid-cols-2 lg:grid-flow-row grid-flow-col'>
                    <div className='space-y-12'>
                        <div className='space-y-4'>
                            <div className='font-bold text-xl'>
                                <p>Bio</p>
                            </div>
                            <div className=' max-w-[400px] lg:text-lg'>
                                <p>
                                    {user.bio}
                                </p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='font-bold text-xl'>
                                <p>Hobbies</p>
                            </div>
                            <div className=" flex space-x-2">
                                {user.hobbies.map((hobbie, index) => (
                                    <p key={index} className='bg-[#D9D9D9] max-w-64 flex-nowrap  px-4 py-1 rounded-full font-semibold'>{hobbie}</p>
                                ))}
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='font-bold text-xl'>
                                <p>Passions</p>
                            </div>
                            <div className="flex space-x-2 ">
                                {/* Use overflow-x-auto to enable horizontal scrolling */}
                                {user.passions.map((passion, index) => (
                                    <p key={index} className='bg-[#D9D9D9] flex-wrap max-w-64 px-4 py-1 rounded-full font-semibold'>
                                        {passion}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='space-y-6 pt-12'>
                        <div className='font-bold text-2xl'>
                            <p>Posts</p>
                        </div>
                        <div className='grid grid-cols-3 gap-3 items-center'>
                            {userPosts.length > 0 ? (
                                userPosts.map((post, index) => (
                                    <Image
                                        key={index}
                                        id={post._id}
                                        src={post.imagePost}
                                        width={200}
                                        height={200}
                                        className='object-cover w-full h-auto aspect-square rounded-md'
                                        alt={`Post ${index + 1}`}
                                        unoptimized={true}
                                        loader={({ src }) => src}
                                        onError={(e) => {
                                            console.error("Error loading post image:", e);
                                            e.target.src = "https://via.placeholder.com/200?text=Post";
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-8 text-gray-500">
                                    No posts yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <span className={`fixed z-20  h-screen flex  bg-black/10 py-12 items-center justify-center px-4 top-0 left-0 w-full  ${setshowEditBox ? 'block' : 'hidden'} `}>
                    <div className={`    bg-white py-6 lg:py-12 px-4 lg:px-8 rounded-xl   lg:w-6/12 w-full  `}>
                        <div className='flex justify-between py-6'>
                            <p className='font-bold text-2xl'>Edit Profile</p>
                            <BiPlus onClick={() => setSetshowEditBox(false)} className='rotate-45 text-3xl cursor-pointer' />
                        </div>
                        <div className='space-y-8'>
                            <div className='space-y-6'>
                                <div>
                                    <div className='flex space-x-2'>
                                        <input type='date' value={DOB} onChange={(e) => setDOB(e.target.value)} placeholder='Add/Edit Date of Birth' className='w-full outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                        <button className='bg-blue-500 text-white px-4 py-1 rounded-full font-semibold' onClick={(e) => setDOB(e.target.value)}>Add</button>
                                    </div>
                                </div>
                                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Add/Edit Bio' className='w-full min-h-24 outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                <div>
                                    <div className=" flex space-x-2 pb-2">
                                        {hobbies.map((hobby, index) => (
                                            <p key={index} className='bg-[#D9D9D9] flex-wrap px-4 py-1 rounded-full font-semibold'>{hobby}</p>
                                        ))}
                                    </div>
                                    <div className='flex space-x-2'>
                                        <input value={hobby} onChange={(e) => setHobby(e.target.value)} placeholder='Add/Edit Hobbies' className='w-full outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                        <button className='bg-blue-500 text-white px-4 py-1 rounded-full font-semibold' onClick={() => setHobbies([...hobbies, hobby])}>Add</button>
                                    </div>
                                </div>
                                <div>
                                    <div className=" flex space-x-2 pb-2">
                                        {passions.map((passion, index) => (
                                            <p key={index} className='bg-[#D9D9D9] flex-wrap px-4 py-1 rounded-full font-semibold'>{passion}</p>
                                        ))}
                                    </div>
                                    <div className='flex space-x-4'>
                                        <input value={passion} onChange={(e) => setPassion(e.target.value)} placeholder='Add/Edit Passions' className='w-full outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                        <button className='bg-blue-500 text-white px-4 py-1 rounded-full font-semibold' onClick={() => {
                                            setPassions([...passions, passion]

                                            )
                                        }}>Add</button>
                                    </div>
                                </div>
                                <input value={incomeRange} onChange={(e) => setIncomeRange(e.target.value)} placeholder='Income Range' className='w-full min-h-8 outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                <input value={incomeRangeMatch} onChange={(e) => setIncomeRangeMatch(e.target.value)} placeholder='Your matches range income' className='w-full min-h-8 outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                <input value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder='Facebook Profile Link' className='w-full min-h-8 outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                <input value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} placeholder='Instagram Profile Link' className='w-full min-h-8 outline outline-1 rounded-2xl outline-gray-300 p-2' />
                                <input value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} placeholder='Twitter Profile Link' className='w-full min-h-8 outline outline-1 rounded-2xl outline-gray-300 p-2' />

                            </div>
                            <Button label={"Save"} variant={"primary"} onClick={handleSubmit} />
                        </div>
                    </div>
                </span>

                {/* Profile Picture Editor Modal */}
                <ProfilePictureEditor
                    isOpen={isProfilePictureEditorOpen}
                    onClose={() => setIsProfilePictureEditorOpen(false)}
                    user={user}
                    onSuccess={(newProfilePictureUrl) => {
                        // Update the user object with the new profile picture URL
                        const updatedUser = { ...user, profilePicture: newProfilePictureUrl };
                        setUser(updatedUser);

                        // Update the user data in cookies
                        setCookie('userData', JSON.stringify(updatedUser));
                    }}
                />
            </div>
        )
    } else {
        return <div className='w-full flex items-center justify-center h-96 text-xl'><Loader /></div>
    }
}

export default ProfileHome