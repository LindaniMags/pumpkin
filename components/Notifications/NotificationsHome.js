"use client";
import React, { useEffect, useState } from "react";
import NotificationItem from "../UI/Notifications/NotificationItem";
import { useCookies } from "next-client-cookies";

export default function NotificationsHome() {
  const [userNotifications, setUserNotifications] = useState([]);
  const [unseenNotifications, setUnseenNotifications] = useState([]);
  const cookies = useCookies();

  // Extract fetchNotifications to a named function so it can be called from other useEffects
  const fetchNotifications = async (email) => {
    try {
      const [shooterResponse, pumpkinResponse, commentResponse] =
        await Promise.all([
          fetch("/api/shooter"),
          fetch("/api/pumpkin"),
          fetch("/api/comment-notification"),
        ]);

      const shooterData = await shooterResponse.json();
      const pumpkinData = await pumpkinResponse.json();
      const commentData = await commentResponse.json();

      // Combine the notifications
      const combinedNotifications = [...shooterData, ...pumpkinData];

      // Add comment notifications
      const commentNotifications = commentData.filter(
        (notification) => notification.recipientEmail === email
      );

      // Combine all notifications
      const allNotifications = [
        ...combinedNotifications,
        ...commentNotifications,
      ];

      // Filter notifications for the current user and sort by timestamp
      const selectedNotifications = allNotifications
        .filter((post) => post.email === email || post.recipientEmail === email)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setUserNotifications(selectedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const email = cookies.get("email");
    fetchNotifications(email);
  }, [cookies]);

  useEffect(() => {
    // Filter unseen notifications
    const unseenNotifications = userNotifications.filter((post) => !post.seen);
    setUnseenNotifications(unseenNotifications);

    // When the user visits the notifications page, mark all notifications as seen
    if (unseenNotifications.length > 0) {
      // Update the status of unseen notifications
      unseenNotifications.forEach(async (notification) => {
        const notificationType =
          notification.type === "comment" ? "comment" : "shooter";
        await handleSubmitStatus(notification._id, notificationType);
      });

      // Refresh notifications after marking them as seen
      setTimeout(() => {
        const email = cookies.get("email");
        fetchNotifications(email);
      }, 1000);
    }
  }, [userNotifications]);

  async function handleSubmitStatus(_id, type = "shooter") {
    try {
      // Determine which API endpoint to use based on notification type
      const endpoint =
        type === "comment" ? "/api/comment-notification" : "/api/shooter";

      await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: _id,
          seen: true,
        }),
      });
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  }

  function extractTimeFromTimestamp(timestamp) {
    const dateObject = new Date(timestamp);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`; // Zero-padded minutes
  }

  if (!userNotifications.length) return <div>No notifications</div>;

  return (
    <div className="lg:pt-24 pt-6 space-y-12 relative w-full items-center">
      <div className="space-y-2 px-6">
        <p className="font-bold text-3xl">Notifications</p>
        <p className="text-gray-700">
          You have {unseenNotifications.length} new notifications
        </p>
      </div>
      <div>
        {userNotifications.map((post) => {
          // Handle different notification types
          if (post.type === "comment") {
            return (
              <NotificationItem
                key={post._id}
                profilePicture={post.senderProfilePicture}
                name={post.senderName}
                surname={post.senderSurname}
                time={extractTimeFromTimestamp(post.timestamp)}
                message={`commented on your post: "${post.commentText.substring(
                  0,
                  30
                )}${post.commentText.length > 30 ? "..." : ""}"`}
                postImage={post.postImage}
                notificationType="comment"
                postId={post.postId}
                notificationId={post._id}
              />
            );
          } else {
            return (
              <NotificationItem
                key={post._id}
                profilePicture={post.senderData?.profilePicture}
                name={post.name}
                surname={post.surname}
                time={extractTimeFromTimestamp(post.timestamp)}
                senderData={post.senderData}
                shooter={post.shooter}
                notificationType="shooter"
                notificationId={post._id}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
