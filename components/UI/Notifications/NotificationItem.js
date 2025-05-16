import Image from "next/image";
import React, { useState } from "react";
import ImageProfile from "../../../assets/images/User-Ex.jpg";
import { BiUser } from "react-icons/bi";
import ShooterRequest from "../Pop-Up/ShooterRequest";
import { useRouter } from "next/navigation";

export default function NotificationItem({
  profilePicture,
  name,
  shooter,
  time,
  surname,
  senderData,
  message,
  hint,
  specialName,
  notificationType = "shooter",
  postImage,
  postId,
  notificationId,
}) {
  const [showShooter, setShowShooter] = useState(false);
  const router = useRouter();

  function handleShooter() {
    setShowShooter(!showShooter);
  }

  async function handleClick() {
    // Mark notification as seen when clicked
    if (notificationId) {
      try {
        // Determine which API endpoint to use based on notification type
        const endpoint =
          notificationType === "comment"
            ? "/api/comment-notification"
            : "/api/shooter";

        await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: notificationId,
            seen: true,
          }),
        });
      } catch (error) {
        console.error("Error marking notification as seen:", error);
      }
    }

    // Navigate or show content based on notification type
    if (notificationType === "comment" && postId) {
      // Navigate to the feed page instead of individual post page
      // This avoids the MongoDB client-side issue
      router.push(`/feed`);
    } else {
      // Show shooter request
      handleShooter();
    }
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between cursor-pointer bg-white hover:bg-gray-200 py-2 px-4"
    >
      <div className="flex items-center space-x-4 flex-1">
        {profilePicture ? (
          <Image
            src={profilePicture}
            width={50}
            height={50}
            className="rounded-full"
            alt="Profile"
          />
        ) : (
          <div className="bg-gray-300 flex items-center justify-center h-[50px] w-[50px] rounded-full">
            <BiUser className="text-xl cursor-pointer active:scale-105" />
          </div>
        )}
        <div className="flex flex-col">
          <div className="flex font-bold space-x-1">
            <p>{name}</p>
            <p>{surname}</p>
          </div>
          {notificationType === "comment" ? (
            <p className="text-sm lg:text-base">{message}</p>
          ) : (
            <p className="font-bold text-sm lg:text-base">
              You have a Shooter Request
            </p>
          )}
        </div>
      </div>

      {/* Post image thumbnail for comment notifications */}
      {notificationType === "comment" && postImage && (
        <div className="flex-shrink-0 ml-2">
          <Image
            src={postImage}
            width={60}
            height={60}
            className="rounded-md object-cover"
            alt="Post"
          />
        </div>
      )}

      <div className="font-semibold text-gray-800 ml-2">
        <p>{time}</p>
      </div>

      {notificationType === "shooter" && (
        <span
          className={`absolute top-[20%] lg:top-[50%] left-[5%] lg:left-[30vw] w-full ${
            showShooter ? "block" : "hidden"
          }`}
        >
          <ShooterRequest
            senderProfile={senderData}
            message={shooter?.message}
            hint={shooter?.hint}
            specialName={shooter?.specialName}
            shooter={shooter}
          />
        </span>
      )}
    </div>
  );
}
