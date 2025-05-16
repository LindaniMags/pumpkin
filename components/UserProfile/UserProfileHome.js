"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "../UI/Button/Button";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { useCookies } from "next-client-cookies";
import ImageInput from "../UI/ImageInput/ImageInput";
import TextInput from "../UI/Text Input/TextInput";
import { BiImageAdd, BiPlus, BiUser } from "react-icons/bi";
import Loader from "../UI/Loader";

function UserProfileHome() {
  const cookies = useCookies();
  const router = useRouter();
  const [selectedUserData, setUserSelectedUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [isShooter, setIsShooter] = useState(true);
  const [showShooter, setShowShooter] = useState(true);
  const [setspecialName, setSetspecialName] = useState("");
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);

  const senderEmail = cookies.get("email");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/pumpkin");
        const pumpkinData = await response.json();
        console.log("asambe", senderEmail);

        // Combine the notifications
        const combinedNotifications = [pumpkinData];

        // Filter notifications for the current user and sort by timestamp
        const selectedNotifications = pumpkinData.filter(
          (post) => post.senderEmail === senderEmail
        );
        console.log(combinedNotifications);

        setUserNotifications(selectedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [cookies]);

  useEffect(() => {
    console.log("asambe", userNotifications);
  }, [userNotifications]);

  function toggleShooter() {
    setShowShooter(!showShooter);
  }

  function toggleIsShooter() {
    setIsShooter(!isShooter);
  }

  useEffect(() => {
    const _id = cookies.get("selectedUserProfile");
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        const selectedUser = data.find((user) => user.email === _id);
        setUserSelectedUserData(selectedUser);
      });

    fetch("/api/post-image")
      .then((res) => res.json())
      .then((data) => {
        const selectedPosts = data.filter(
          (post) => post?.email === selectedUserData?.email
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

  function formatDate(dateString) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
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

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Example usage
  const dateOfBirth = "1990-01-01";
  const age = calculateAge(dateOfBirth);
  console.log(`Your age is ${age} years.`); // Output: Your age is 33 years.

  const [shooterRequest, setShooterRequest] = useState([]);

  function handleSubmit(e) {
    setShowShooter(true);
    e.preventDefault();
    const timestamp = new Date().toISOString(); // Create a timestamp
    const senderEmail = cookies.get("email");
    const senderData = JSON.parse(cookies.get("userData"));
    const shooterRequestData = {
      specialName: setspecialName,
      hint: hint,
      message: message,
    };
    setShooterRequest(shooterRequestData);
    let res = fetch("/api/shooter", {
      method: "POST",
      body: JSON.stringify({
        senderEmail: senderEmail,
        senderData: senderData,
        email: selectedUserData.email,
        shooter: shooterRequestData,
        timestamp: timestamp,
        seen: false,
      }),
    }).then(async (response) => {
      const result = await response.json();
      router.push("../../feed");
    });
  }

  function handleSubmitPumkin(e) {
    setShowShooter(true);
    e.preventDefault();
    const timestamp = new Date().toISOString(); // Create a timestamp
    const senderEmail = cookies.get("email");
    const senderData = JSON.parse(cookies.get("userData"));

    setShooterRequest();
    let res = fetch("/api/pumpkin", {
      method: "POST",
      body: JSON.stringify({
        senderEmail: senderEmail,
        senderData: senderData,
        email: selectedUserData.email,
        timestamp: timestamp,
        seen: false,
      }),
    }).then(async (response) => {
      const result = await response.json();
      router.push("../../feed");
    });
  }

  function handleSubmitDeletePumkin(e) {
    setShowShooter(true);
    e.preventDefault();
    const timestamp = new Date().toISOString(); // Create a timestamp
    const senderEmail = cookies.get("email");
    const senderData = JSON.parse(cookies.get("userData"));

    setShooterRequest();
    let res = fetch("/api/pumpkin", {
      method: "DELETE",
      body: JSON.stringify({
        email: selectedUserData.email,
      }),
    }).then(async (response) => {
      const result = await response.json();
      router.push("../../feed");
    });
  }
  console.log("selected user info", selectedUserData);

  if (selectedUserData) {
    return (
      <div className=" relative bg-gradient-to-b space-y-6 from-black/5 to-white/0 lg:py-16 py-6 px-8 lg:px-16">
        <div className={`${showShooter ? "hidden" : "block"}`}>
          {isShooter ? (
            <div className="fixed text-black bg-black/20 h-screen justify-center  w-screen flex flex-col py-16 px-6 l space-y-10  items-center left-0 top-0    rounded-3xl">
              <div className=" text-black flex flex-col lg:py-16 py-8 px-6 l space-y-10  items-center max-w-[88vw] lg:max-w-[40vw]   bg-[#ffffff] rounded-3xl">
                <div className=" flex flex-col items-center text-lg font-semibold">
                  <p>Heey, {selectedUserData.name}</p>
                  <p className="text-center">
                    Welcome to Pumpkins Shot Shooter
                  </p>
                </div>
                <div className="text-justify">
                  <p>
                    Shot Shooter lets you hit your crush up without having to go
                    through the gwaabs, aka - gwababa, coz we've got you. This
                    happens anonymously, and they never get to know its you.
                    Take the chance, send them a sweet text.{" "}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={toggleIsShooter}
                    className="bg-black px-24 text-white rounded-full font-bold py-4"
                  >
                    <p>Shoot</p>
                  </button>
                  <p
                    className=" text-white bg-black px-24 rounded-full font-bold py-4 hover:underline cursor-pointer"
                    onClick={toggleShooter}
                  >
                    Cancel
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed text-white bg-black/20 h-screen justify-center  w-screen flex flex-col py-16 px-6 l space-y-10  items-center left-0 top-0    rounded-3xl">
              <div className=" text-black flex flex-col lg:py-16 py-8 px-6 l space-y-10  items-center max-w-[88vw] lg:max-w-[40vw]   bg-[#ffffff] rounded-3xl">
                <div className="w-full space-y-2">
                  <p className="text-sm">
                    Shoot your shot player, Whats your message to them?
                  </p>
                  <textarea
                    type="text"
                    className="w-full py-2 px-4 rounded-xl text-black bg-[#cfcece]"
                    value={message}
                    placeholder="Shoot Your Shot"
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-black px-24 text-white rounded-full font-bold py-4"
                  >
                    <p>Shoot</p>
                  </button>
                  <p
                    className="hover:underline cursor-pointer text-white bg-black px-24 rounded-full font-bold py-4"
                    onClick={() => {
                      toggleShooter();
                      toggleIsShooter();
                    }}
                  >
                    Cancel
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:space-y-0 space-y-6 lg:space-x-12">
          <div>
            {selectedUserData.profilePicture ? (
              <div className="relative">
                <Image
                  src={selectedUserData.profilePicture}
                  width={100}
                  height={100}
                  className="rounded-full w-[100px] h-[100px] object-cover border-2 border-white shadow-md"
                  alt="profile"
                  unoptimized={true}
                  priority={true}
                  loader={({ src }) => src}
                  onError={(e) => {
                    console.error("Error loading profile image:", e);
                    e.target.src = "https://via.placeholder.com/100?text=Profile";
                  }}
                />
              </div>
            ) : (
              <div className="bg-gray-300 flex items-center justify-center h-[100px] w-[100px] rounded-full p-6 border-2 border-white shadow-md">
                <BiUser className="text-5xl" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <div className="flex font-bold text-sm space-x-2 lg:space-x-4 lg:text-xl">
              <p className="">{selectedUserData.name}</p>
              <p className="">{selectedUserData.surname},</p>
              <p>{calculateAge(selectedUserData.dob)}</p>
            </div>
            <div className="flex flex-col lg:flex-row lg:space-y-0 space-x-0 lg: lg:space-x-2 items-center justify-center  text-base  ">
              <p className="text-gray-600">@{selectedUserData.username}</p>
              {selectedUserData.dob ? (
                <p className="text-gray-600">{selectedUserData.dob}</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex space-y-4 lg:space-y-0  flex-col lg:flex-row items-center lg:justify-between w-full">
          <div className="flex items-center space-x-6">
            <div className="flex  space-x-2 lg:text-lg text-sm">
              <p className="font-bold">{selectedUserData.posts.length}</p>
              <p>Posts</p>
            </div>
            <div className="flex  space-x-2 lg:text-lg text-sm">
              <p className="font-bold">{selectedUserData.pumpkins}</p>
              <p>Pumkins</p>
            </div>
            <div className="flex  space-x-2 lg:text-lg text-sm">
              <p className="font-bold">{selectedUserData.hickies}</p>
              <p>Hickies</p>
            </div>
          </div>

          <div className="flex lg:space-x-4 font-bold lg:flex-row text-xl lg:text-xl items-center space-y-2 flex-col lg:space-y-0 ">
            <Button
              label={"Shoot your shot"}
              variant={"tertiary"}
              onClick={toggleShooter}
            />
            <div>
              {userNotifications.length > 0 ? (
                <Button
                  label={"GWABABA"}
                  variant={"tertiary"}
                  onClick={handleSubmitDeletePumkin}
                />
              ) : (
                <Button
                  label={"Pumkin"}
                  variant={"primary"}
                  onClick={handleSubmitPumkin}
                />
              )}
            </div>
          </div>
        </div>

        <div className=" grid grid-rows-2 lg:grid-cols-2 lg:grid-flow-row grid-flow-col">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="font-bold ">
                <p>Bio</p>
              </div>
              <div className=" max-w-[400px] lg:text-xl">
                <p>{selectedUserData.bio}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="font-bold ">
                <p>Hobbies</p>
              </div>
              <div className="flex space-x-2 max-w-[90vw] overflow-auto py-2">
                {selectedUserData.hobbies.map((hobbie, index) => (
                  <div key={index} className="flex">
                    <p
                      key={index}
                      className="bg-[#D9D9D9] flex-wrap px-4 py-1 rounded-full font-semibold"
                    >
                      {hobbie}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="font-bold ">
                <p>Passions</p>
              </div>
              <div className=" flex space-x-2 sm:w-[90vw] overflow-auto  py-2">
                {selectedUserData.passions.map((passion, index) => (
                  <div key={index} className="flex ">
                    <p
                      key={index}
                      className="bg-[#D9D9D9] text-nowrap flex-wrap px-4 py-1 rounded-full font-semibold"
                    >
                      {passion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6 pt-6 lg:pt-0">
            <div className="font-bold text-xl">
              <p>Posts</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {userPosts.length > 0 ? (
                userPosts.map((post, index) => (
                  <Image
                    key={index}
                    id={post._id}
                    src={post.imagePost}
                    width={200}
                    height={200}
                    className="object-cover w-full h-auto aspect-square rounded-md shadow-sm hover:shadow-md transition-shadow"
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
      </div>
    );
  } else {
    return (
      <div className="w-full flex items-center justify-center h-96 text-xl">
        <Loader />
      </div>
    );
  }
}

export default UserProfileHome;
