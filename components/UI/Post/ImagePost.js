"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  BiArrowBack,
  BiChat,
  BiDotsVerticalRounded,
  BiHeart,
  BiSend,
} from "react-icons/bi";
import Button from "../Button/Button";
import { IoChatbubbleOutline } from "react-icons/io5";

import {} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useCookies } from "next-client-cookies";
import { FaHeart } from "react-icons/fa";
function UserPost({
  surname,
  profilePicture,
  email,
  username,
  likes,
  likedUsersData,
  image,
  caption,
  _id,
  comments,
}) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [likedUsers, setLikedUsers] = useState(likedUsersData || []);
  const [postLikes, setPostLikes] = useState(likes);
  const [liked, setLiked] = useState(false);
  const cookies = useCookies();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState(comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch initial like status
    const emailUser = cookies.get("email");
    if (likedUsers?.includes(emailUser)) {
      setLiked(true);
    }
  }, [likedUsers]);

  // Fetch comments when component mounts
  useEffect(() => {
    if (_id) {
      fetchComments();
    }
  }, [_id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment?postId=${_id}`);
      if (response.ok) {
        const data = await response.json();
        setPostComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const toggleLike = async () => {
    const currentUserEmail = cookies.get("email");

    // Check if user has already liked the post
    const isCurrentlyLiked = liked;

    // Toggle the liked state
    setLiked(!isCurrentlyLiked);

    let updatedLikedUsers;
    let updatedLikesCount;

    if (isCurrentlyLiked) {
      // User is unliking the post
      updatedLikedUsers = likedUsers.filter(
        (userEmail) => userEmail !== currentUserEmail
      );
      updatedLikesCount = postLikes - 1;
    } else {
      // User is liking the post
      // Make a copy to avoid directly mutating state
      updatedLikedUsers = [...likedUsers, currentUserEmail];
      updatedLikesCount = postLikes + 1;
    }

    // Update local state
    setLikedUsers(updatedLikedUsers);
    setPostLikes(updatedLikesCount);

    try {
      // Send update to server
      const response = await fetch("/api/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: _id, // Use post ID instead of email
          likedUsers: updatedLikedUsers,
          likes: updatedLikesCount,
        }),
      });

      if (!response.ok) {
        // If the server request fails, revert the local state
        console.error("Failed to update like status");
        setLiked(isCurrentlyLiked);
        setLikedUsers(likedUsers);
        setPostLikes(postLikes);
      }
    } catch (error) {
      // If there's an error, revert the local state
      console.error("Error updating like status:", error);
      setLiked(isCurrentlyLiked);
      setLikedUsers(likedUsers);
      setPostLikes(postLikes);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      const userEmail = cookies.get("email");
      const userName = cookies.get("name");
      const userSurname = cookies.get("surname");
      const userProfilePic = cookies.get("profilePicture");

      // Add comment to post
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: _id,
          comment: {
            text: commentText,
            email: userEmail,
            name: userName,
            surname: userSurname,
            profilePicture: userProfilePic,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPostComments(data.comments);
        setCommentText("");

        // Only create notification if the comment is not from the post owner
        if (userEmail !== email) {
          try {
            // Create notification for post owner
            const notificationResponse = await fetch(
              "/api/comment-notification",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  // Post owner who will receive the notification
                  recipientEmail: email,

                  // Comment author details
                  senderEmail: userEmail,
                  senderName: userName,
                  senderSurname: userSurname,
                  senderProfilePicture: userProfilePic,

                  // Post details
                  postId: _id,
                  postCaption: caption ? caption.substring(0, 50) : "",
                  postImage: image,

                  // Comment details
                  commentText: commentText,
                  commentId: data.comments[data.comments.length - 1]._id,
                }),
              }
            );

            if (!notificationResponse.ok) {
              console.error("Failed to create notification");
            }
          } catch (error) {
            console.error("Error creating notification:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-white  flex justify-between items-center px-4 lg:px-8 lg:py-4 py-2">
        <div className="flex space-x-4 items-center">
          <div>
            <Image
              src={profilePicture}
              width={50}
              height={50}
              className="rounded-full w-[50px] h-[50px] object-cover"
              alt="Profile picture"
              unoptimized={true}
              loader={({ src }) => src}
            />
          </div>
          <div>
            <div className="flex lg:text-lg  space-x-2 font-bold">
              <p>{username}</p>
              <p>{surname}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            className="text-3xl cursor-pointer active:scale-105"
            onClick={handleMenu}
          >
            <BiDotsVerticalRounded />
          </div>
          <span
            className={`right-0 top-[120%] absolute w-64 py-2 bg-white rounded-lg shadow ${
              showMenu ? "block" : "hidden"
            }`}
          >
            <ul>
              <li className="py-2 px-6 lg:text-xl text-sm hover:bg-gray-100 cursor-pointer font-semibold">
                <p
                  onClick={() => {
                    setCookie("selectedUserProfile", email);
                    router.push(`../../user-profile`);
                  }}
                >
                  View Profile
                </p>
              </li>
            </ul>
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex space-y-2 items-center flex-col">
          <div className="px-4 pt-2">
            <Image
              src={image}
              width={500}
              height={400}
              className="rounded-2xl w-full h-auto object-contain"
              alt="Post image"
              priority={true}
              unoptimized={true}
              loader={({ src }) => src}
            />
          </div>
          <div className="flex lg:text-3xl text-2xl space-x-4 justify-start  w-full px-4 items-start">
            <div className="flex items-center space-x-2">
              <div className="  cursor-pointer active:scale-105">
                {liked ? (
                  <FaHeart
                    onClick={toggleLike}
                    className="text-black cursor-pointer"
                  />
                ) : (
                  <BiHeart onClick={toggleLike} className="text-black" />
                )}
              </div>
              <p className="text-base lg:text-lg font-bold">
                {likedUsers.length}
              </p>
            </div>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleComments}
            >
              <IoChatbubbleOutline />
              <p className="text-base lg:text-lg font-bold">
                {postComments.length}
              </p>
            </div>
          </div>

          <div className="flex w-full justify-start space-x-2 px-4 line-clamp-3">
            <p className="font-bold">@{username + " " + surname}</p>
            <p>{caption}</p>
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="w-full px-4 mt-2">
              <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto">
                {postComments.length > 0 ? (
                  postComments.map((comment, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 mb-3"
                    >
                      {comment.profilePicture && (
                        <Image
                          src={comment.profilePicture}
                          width={30}
                          height={30}
                          className="rounded-full"
                          alt="Profile"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {comment.name} {comment.surname}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-gray-500">
                          {comment.timestamp
                            ? new Date(comment.timestamp).toLocaleString()
                            : "Just now"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-2">
                    No comments yet
                  </p>
                )}
              </div>

              {/* Comment input */}
              <div className="flex items-center mt-2 bg-white rounded-full border border-gray-300 overflow-hidden">
                <input
                  type="text"
                  value={commentText}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 outline-none text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCommentSubmit();
                    }
                  }}
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={isSubmitting || !commentText.trim()}
                  className={`px-3 py-2 ${
                    isSubmitting || !commentText.trim()
                      ? "text-gray-400"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <BiSend className="text-xl" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-4 px-4 items-center"></div>
      </div>
    </div>
  );
}

export default UserPost;
