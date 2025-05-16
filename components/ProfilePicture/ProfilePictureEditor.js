"use client"
import React, { useRef, useState, useEffect } from 'react'
import { useCookies } from 'next-client-cookies'
import Image from 'next/image'
import Button from '../UI/Button/Button'
import { BiImageAdd, BiCheck, BiX } from 'react-icons/bi'

// Firebase imports
import { storage } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function ProfilePictureEditor({ isOpen, onClose, user, onSuccess }) {
  const cookies = useCookies()
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(null)
      setPreviewUrl(null)
      setUploadedUrl(null)
      setError(null)
      setSuccess(false)
      
      // If user has a profile picture, show it as preview
      if (user && user.profilePicture) {
        setPreviewUrl(user.profilePicture)
      }
    }
  }, [isOpen, user])

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    setSelectedImage(file)
    setError(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const uploadImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    if (!user || !user.email) {
      setError('User information not available')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Generate a unique file name
      const timestamp = new Date().getTime()
      const fileExtension = selectedImage.name.split('.').pop()
      const fileName = `profile_${user.email.split('@')[0]}_${timestamp}.${fileExtension}`

      // Create a reference to the storage location
      const storageRef = ref(storage, `profile_pictures/${fileName}`)

      // Upload the file
      await uploadBytes(storageRef, selectedImage)

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Save the URL
      setUploadedUrl(downloadURL)

      // Update the user's profile in the database
      const response = await fetch('/api/profile-picture', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          profilePicture: downloadURL,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile picture')
      }

      setSuccess(true)

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(downloadURL)
      }

      // Close the modal after a short delay
      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (error) {
      console.error('Error uploading image:', error)
      setError(`Error uploading image: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md flex flex-col items-center space-y-4">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Profile Picture</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <BiX className="text-2xl" />
          </button>
        </div>

        <div className="w-full flex flex-col items-center space-y-4">
          {!previewUrl ? (
            <div
              onClick={handleButtonClick}
              className="border-2 border-dotted flex items-center justify-center h-[200px] w-[200px] rounded-full p-6 cursor-pointer hover:bg-gray-50"
            >
              <BiImageAdd className="text-5xl active:scale-105" />
            </div>
          ) : (
            <div className="relative">
              <Image
                src={previewUrl}
                width={200}
                height={200}
                alt="Preview"
                className="rounded-full object-cover w-[200px] h-[200px]"
              />
              <button
                onClick={() => {
                  setPreviewUrl(null)
                  setSelectedImage(null)
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                ✕
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />

          {!selectedImage ? (
            <Button
              label="Select New Picture"
              variant="primary"
              onClick={handleButtonClick}
            />
          ) : (
            <Button
              label="Upload Image"
              variant="primary"
              onClick={uploadImage}
              loader={loading}
            />
          )}

          {error && (
            <div className="text-red-500 text-center p-2 bg-red-50 rounded-md w-full">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-500 text-center p-2 bg-green-50 rounded-md w-full flex items-center justify-center gap-2">
              <BiCheck className="text-green-500 text-xl" />
              Profile picture updated successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePictureEditor
