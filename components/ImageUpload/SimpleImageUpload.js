"use client"
import React, { useRef, useState, useEffect } from 'react'
import { useCookies } from 'next-client-cookies'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '../UI/Button/Button'
import { BiImageAdd, BiCheck } from 'react-icons/bi'

// Firebase imports
import { storage } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function SimpleImageUpload({ type = 'profile', onSuccess }) {
  const cookies = useCookies()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Initialize user data from cookies
  useEffect(() => {
    // Get email from cookies directly if available
    const email = cookies.get("email");

    // Try to get user data from cookies
    try {
      const userDataCookie = cookies.get("userData");

      // Only try to parse if the cookie exists and isn't undefined
      if (userDataCookie && userDataCookie !== "undefined") {
        const parsedUserData = JSON.parse(userDataCookie);
        setUser(parsedUserData);
      } else if (email) {
        // If we have an email but no valid userData, create a minimal user object
        setUser({ email: email });
      } else {
        // Fallback to a default user
        console.log("No valid user data found in cookies, using default");
        setUser({ email: 'guest@example.com' });
      }
    } catch (error) {
      console.log("Using email from cookies as fallback");
      // If parsing fails but we have an email, use that
      if (email) {
        setUser({ email: email });
      } else {
        console.error("No valid user data available:", error);
        setUser({ email: 'guest@example.com' });
      }
    }
  }, [cookies]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    if (!user || !user.email) {
      setError('User information not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate a unique file name
      const timestamp = new Date().getTime();
      const fileExtension = selectedImage.name.split('.').pop();
      const fileName = `${type}_${user.email.split('@')[0]}_${timestamp}.${fileExtension}`;

      // Create a reference to the storage location
      const storageRef = ref(storage, `${type}_pictures/${fileName}`);

      // Upload the file
      await uploadBytes(storageRef, selectedImage);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save the URL
      setUploadedUrl(downloadURL);

      // Update the user's profile in the database
      const endpoint = type === 'profile' ? '/api/profile-picture' : '/api/add-cover';
      const dataField = type === 'profile' ? 'profilePicture' : 'coverPicture';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          [dataField]: downloadURL,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${type} picture`);
      }

      setSuccess(true);

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(downloadURL);
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push('../../feed');
      }, 1500);

    } catch (error) {
      console.error('Error uploading image:', error);
      setError(`Error uploading image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed flex flex-col py-8 px-6 space-y-8 items-center lg:w-[50vw] w-[90vw] bg-white rounded-3xl">
      <div>
        <p className="text-xl font-bold">
          {type === 'profile' ? 'Add Profile Picture' : 'Add Cover Picture'}
        </p>
      </div>

      {!previewUrl ? (
        <div
          onClick={handleButtonClick}
          className="border-2 border-dotted flex items-center justify-center h-[200px] w-[200px] rounded-xl p-6 cursor-pointer hover:bg-gray-50"
        >
          <BiImageAdd className="text-5xl active:scale-105" />
        </div>
      ) : (
        <div className="relative">
          <Image
            src={previewUrl}
            width={type === 'profile' ? 200 : 300}
            height={type === 'profile' ? 200 : 169}
            alt="Preview"
            className={type === 'profile' ? 'rounded-full object-cover w-[200px] h-[200px]' : 'rounded-lg object-cover w-[300px] h-[169px]'}
          />
          <button
            onClick={() => {
              setPreviewUrl(null);
              setSelectedImage(null);
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

      {!previewUrl ? (
        <Button
          label={`Select ${type === 'profile' ? 'Profile' : 'Cover'} Picture`}
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
          Image uploaded successfully!
        </div>
      )}
    </div>
  )
}

export default SimpleImageUpload
