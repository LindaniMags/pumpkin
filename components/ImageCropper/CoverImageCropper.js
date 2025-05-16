"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useCookies } from "next-client-cookies";
import { db, storage } from "@/firebase"; // Adjust the import based on your project structure
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { BiImageAdd, BiCheck } from "react-icons/bi";
import { useRouter } from "next/navigation";
import Button from "../UI/Button/Button";

const MIN_DIMENSION = 50;

const CoverImageCropper = () => {
  const router = useRouter();
  const cookies = useCookies();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [showImageAdd, setShowImageAdd] = useState(true);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState({
    unit: "%", // Can be 'px' or '%'
    width: 60,
    height: 60 * (9 / 16), // Calculate height based on 16:9 aspect ratio
    x: 20,
    y: 25,
    aspect: 16 / 9, // Force 16:9 aspect ratio for cover pictures
  });
  const [croppedImage, setCroppedImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedImageUrl, setSavedImageUrl] = useState("");
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Initialize user data from cookies or use default
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

  const onSelectFile = (e) => {
    setShowImageAdd(false);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      setImgSrc(imageUrl);
      setIsSaved(false); // Reset save state when a new file is selected
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = (crop, pixelCrop) => {
    setShowImageAdd(false);

    // Validate crop values
    if (!crop || !pixelCrop) {
      console.error("Invalid crop parameters");
      return;
    }

    // Ensure all crop values are numbers
    const validCrop = {
      ...crop,
      width: isNaN(crop.width) ? 50 : crop.width,
      height: isNaN(crop.height) ? 50 * (6 / 9) : crop.height,
      x: isNaN(crop.x) ? 25 : crop.x,
      y: isNaN(crop.y) ? 25 : crop.y,
    };

    const validPixelCrop = {
      ...pixelCrop,
      width: isNaN(pixelCrop.width) ? 100 : pixelCrop.width,
      height: isNaN(pixelCrop.height) ? 100 * (6 / 9) : pixelCrop.height,
      x: isNaN(pixelCrop.x) ? 50 : pixelCrop.x,
      y: isNaN(pixelCrop.y) ? 50 : pixelCrop.y,
    };

    // Wait for the next render cycle to ensure the image is loaded
    setTimeout(() => {
      if (!imageRef.current) {
        console.error("Image reference not available");
        return;
      }

      // Make sure the image is fully loaded
      if (!imageRef.current.complete) {
        console.log("Image not yet loaded, waiting...");
        imageRef.current.onload = () => onCropComplete(crop, pixelCrop);
        return;
      }

      if (validPixelCrop.width > 0 && validPixelCrop.height > 0) {
        try {
          const canvas = document.createElement("canvas");

          // Get the correct scale factors
          const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
          const scaleY =
            imageRef.current.naturalHeight / imageRef.current.height;

          // For cover pictures, we want to maintain the aspect ratio but ensure it's wide enough
          // Standard cover photo aspect ratio is typically 16:9 or similar
          const coverAspectRatio = 16 / 9;

          // Calculate dimensions that maintain the crop aspect ratio
          let canvasWidth = validPixelCrop.width;
          let canvasHeight = validPixelCrop.height;

          // Ensure minimum width for cover photos
          const minWidth = 800;
          if (canvasWidth < minWidth) {
            const scale = minWidth / canvasWidth;
            canvasWidth = minWidth;
            canvasHeight = canvasHeight * scale;
          }

          // Set canvas dimensions
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          const ctx = canvas.getContext("2d");

          // Fill with white background to avoid transparency issues
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Calculate source and destination rectangles
          const srcX = validPixelCrop.x * scaleX;
          const srcY = validPixelCrop.y * scaleY;
          const srcWidth = validPixelCrop.width * scaleX;
          const srcHeight = validPixelCrop.height * scaleY;

          // Draw the image on the canvas, scaling it to fit
          ctx.drawImage(
            imageRef.current,
            srcX,
            srcY,
            srcWidth,
            srcHeight, // Source rectangle
            0,
            0,
            canvasWidth,
            canvasHeight // Destination rectangle
          );

          // Convert to blob with higher quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  const result = reader.result;
                  // Validate the data URL format
                  if (result && result.startsWith("data:image/")) {
                    setCroppedImage(result);
                    console.log("Crop completed successfully");
                  } else {
                    console.error("Invalid data URL format");
                  }
                };
              }
            },
            "image/jpeg",
            0.95
          ); // Higher quality
        } catch (error) {
          console.error("Error during image cropping:", error);
        }
      } else {
        console.error("Invalid image reference or crop dimensions");
      }
    }, 100); // Small delay to ensure DOM is updated
  };

  const handleSave = () => {
    if (!croppedImage) {
      console.error("Please select and crop an image first");
      return;
    }

    uploadPost();
    router.refresh();
    setIsSaved(true);
  };
  const uploadPost = async () => {
    setShowImageAdd(false);
    // We'll use the user state that was already set in the useEffect
    // No need to parse cookies again here, which could cause errors

    if (loading) return;
    setLoading(true);

    try {
      // Check if croppedImage is valid before proceeding
      if (!croppedImage) {
        throw new Error(
          "No image selected or cropped. Please select and crop an image first."
        );
      }

      // Validate that croppedImage is a proper data URL
      if (!croppedImage.startsWith("data:image/")) {
        throw new Error(
          "Invalid image format. Please select a valid image file."
        );
      }

      // Check image format more specifically
      const imageFormat = croppedImage.split(';')[0].split('/')[1];
      if (!['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(imageFormat.toLowerCase())) {
        throw new Error(
          `Unsupported image format: ${imageFormat}. Please use JPEG, PNG, GIF or WebP.`
        );
      }

      // Generate a unique ID for the image
      const timestamp = new Date().getTime();
      const userEmail = user?.email || 'unknown';
      const imageId = `cover_${userEmail.split('@')[0]}_${timestamp}`;

      // Upload to Firebase Storage with optimized path
      const imageRef = ref(storage, `cover_pictures/${imageId}`);

      try {
        // Upload the image to Firebase Storage
        await uploadString(imageRef, croppedImage, "data_url");

        // Get the download URL
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Firebase Download URL:", downloadURL);

        // Store the Firebase URL in state
        setSavedImageUrl(downloadURL);

        // Clear the source image
        setImgSrc("");
      } catch (uploadError) {
        console.error("Firebase upload error:", uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setLoading(false);
    }
  };

  // Use useEffect to log savedImageUrl after it has been updated
  useEffect(() => {
    if (savedImageUrl) {
      handleSubmit();
      router.refresh();
    }
  }, [savedImageUrl]);

  async function handleSubmit() {
    try {
      // Ensure we have a Firebase URL to use
      if (!savedImageUrl) {
        console.error("Image upload not complete. Please wait or try again.");
        return;
      }

      // Use only the Firebase URL, not the data URL
      const response = await fetch("/api/add-cover", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          coverPicture: savedImageUrl, // Always use Firebase URL
        }),
      });

      if (response.ok) {
        // Show success message
        setIsSaved(true);

        // Update the UI optimistically after a short delay
        setTimeout(() => {
          router.push("../../feed");
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("Error updating cover picture:", errorData);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  }

  return (
    <div className=" fixed flex flex-col py-8 px-6 l space-y-16  items-center lg:w-[50vw] w-[90vw]  bg-white rounded-3xl ">
      <div>
        <p className="text-xl font-bold">Add Cover Picture</p>
      </div>
      <div
        onClick={handleButtonClick}
        className={`border-2 border-dotted flex items-center justify-center  h-[150px] w-[150px] rounded-xl p-6 ${
          showImageAdd ? "" : "hidden"
        } `}
      >
        <BiImageAdd className="text-5xl cursor-pointer active:scale-105 " />
      </div>
      {isSaved && savedImageUrl && (
        <div className="flex flex-col items-center">
          <BiCheck className="text-green-500 text-5xl" />
        </div>
      )}
      <div className="flex items-center justify-between space-x-16">
        <div className=" flex flex-col items-center space-y-12 pr-12  ">
          <div className="  rounded-3xl flex items-start flex-col shadow-mds lg:border-l">
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              ref={fileInputRef}
              className="hidden w-full text-sm text-slate-500 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imgSrc && !isSaved && (
              <div>
                <ReactCrop
                  src={imgSrc}
                  crop={crop}
                  onChange={(newCrop) => {
                    // Ensure all crop values are valid numbers
                    const validCrop = {
                      ...newCrop,
                      width: isNaN(newCrop.width) ? 60 : newCrop.width,
                      height: isNaN(newCrop.height)
                        ? 60 * (9 / 16)
                        : newCrop.height,
                      x: isNaN(newCrop.x) ? 20 : newCrop.x,
                      y: isNaN(newCrop.y) ? 25 : newCrop.y,
                    };
                    setCrop(validCrop);
                  }}
                  onComplete={onCropComplete}
                  keepSelection
                  aspect={16 / 9} // Force 16:9 aspect ratio for cover pictures
                  minWidth={MIN_DIMENSION}
                >
                  <img
                    ref={imageRef}
                    src={imgSrc}
                    width={200}
                    height={200}
                    alt="image"
                    style={{ maxWidth: "100%", display: "block" }}
                  />
                </ReactCrop>
              </div>
            )}
          </div>
        </div>
      </div>
      {showImageAdd ? (
        <Button
          label={"Add Cover Picture"}
          variant={"primary"}
          loader={false}
          onClick={handleButtonClick}
        />
      ) : (
        <button
          onClick={() => {
            router.refresh();
            handleSave();
          }}
          className="mt-4 w-full px-4 py-3 font-bold bg-black rounded-full text-white "
        >
          Save
        </button>
      )}
      {loading && (
        <div className="text-blue-500 text-center p-2 bg-blue-50 rounded-md w-full">
          Uploading image... Please wait.
        </div>
      )}
      {isSaved && !loading && (
        <div className="text-green-500 text-center p-2 bg-green-50 rounded-md w-full">
          Cover image uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default CoverImageCropper;
