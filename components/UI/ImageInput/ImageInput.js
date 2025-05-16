'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { BiImageAdd, BiLeftArrowAlt, BiRightArrow } from 'react-icons/bi'
import addImage from '../../../assets/images/select.png'
import Button from '../Button/Button'
import Link from 'next/link'
import { useCookies } from 'next-client-cookies'
import { ref, getDownloadURL, uploadString } from 'firebase/storage'
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore'
import { db, storage } from '../../../firebase'
import { useRouter } from 'next/navigation'

export default function ImageInput() {
    const router = useRouter()
    const filePickerRef = useRef(null)
    const captionRef = useRef(null)
    const [user, setUser] = useState(null)
    const cookies = useCookies()
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [savedImageURL, setSavedImageURL] = useState(null)
    const [showImageIcon, setShowImageIcon] = useState(true)

    const uploadPost = async () => {
        const userData = cookies.get('userData')
        if (userData) {
           setUser(JSON.parse(userData))
        }
        if (loading) return
        setLoading(true)

        const docRef = await addDoc(collection(db, 'posts'), {
            username: 'makabongwe',
            caption: captionRef.current.value,
            profileImg: null,
            timestamp: serverTimestamp()
        })

        console.log("Post added with ID:", docRef.id);
       
        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        await uploadString(imageRef, selectedFile, 'data_url').then(async snapshot => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, 'posts', docRef.id), {
                image: downloadURL
            });
            setSavedImageURL(downloadURL);
        });
        
        setSelectedFile(null)
        setLoading(false)
        // router.push('../../profile')
    }

    useEffect(() => {
        if (savedImageURL) {
            handleSubmitThirdForm({});
        }
    } , [savedImageURL])

    function handleSubmitThirdForm() {
        const email = cookies.get('email')
        const timestamp = new Date().toISOString(); // Create a timestamp
        fetch("/api/post-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "imagePost": savedImageURL,
                "caption": captionRef.current.value,
                "comments": [],
                "likes": 0,
                "created": timestamp,
                "likedUsers": [],
            }),
        })
        .then(async (response) => {
            const result = await response.json();
            console.log(result);
            router.push('../../profile');
        })
        .catch((error) => {
            console.error("Error posting image:", error);
        });
    }

    const addImageToPost = (e) => {
        setShowImageIcon(false)
        const reader = new FileReader()
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
    }

    return (
        <div className=' w-full flex justify-center lg:pt-16 '>
            <div className='flex w-full items-center justify-center lg:bg-white max-w-[500px] rounded-2xl lg:shadow-lg lg:py-16 py-8 flex-col space-y-12 lg:px-12 px-6' >
                <div className='flex w-full '>
                    <Link href={'../../../profile'}>
                        <BiLeftArrowAlt className='text-4xl' />
                    </Link>
                </div>
                <div>
                    {selectedFile && <Image src={selectedFile} width={300} height={300} />}
                </div>
                <div onClick={() => filePickerRef.current.click()} className={`flex items-center justify-center cursor-pointer hover:scale-105 flex-col space-y-4 py-16 ${showImageIcon? '' : 'hidden'}`}>
                    <Image src={addImage} width={50} height={100} />
                    <p className='text-xl  '>Upload Image</p>
                </div>
                <div>
                    <input
                        ref={filePickerRef}
                        type='file'
                        hidden
                        onChange={addImageToPost}
                    />
                </div>
                <div className='flex justify-between items-center w-full flex-col space-y-12'>
                    <input
                        ref={captionRef}
                        placeholder='add caption here'
                        className='w-full outline-none rounded-full px-4 py-2'
                    />
                    <div className="">
                        <Button disabled={!selectedFile} onClick={uploadPost} label={'Post'} variant={"primary"} />
                    </div>
                </div>
            </div>
        </div>
    )
}
