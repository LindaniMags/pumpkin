"use client";
import React, { useEffect, useState } from "react";
import ProfileCard from "../UI/Card/ProfileCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { setCookie } from "cookies-next";

function WithSomeIntrest() {
  const cookies = useCookies();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        const randomizedUsers = data.sort(() => Math.random() - 0.5);
        setUsers(randomizedUsers);
      });
  }, [cookies]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
      partialVisibilityGutter: 30, // Adjust this value as needed
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 30, // Adjust this value as needed
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      partialVisibilityGutter: 30, // Adjust this value as needed
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      partialVisibilityGutter: 30, // Adjust this value as needed
    },
  };

  return (
    <div className="max-w-[100vw] pt-6 lg:p-0 lg:max-w-[1280px]">
      <p className="lg:text-xl px-4 lg:py-12 pb-4 font-bold text-[#2C2A2A]">
        People With Same Intrest
      </p>
      <div className="">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={false}
          infinite={true}
          responsive={responsive}
          partialVisible={true} // Ensure partial visibility
          removeArrowOnDeviceType={["tablet", "mobile"]}
          className=""
        >
          {users.map((user) => (
            <div key={user._id}>
              <ProfileCard
                email={user.email}
                id={user._id}
                username={user.username}
                surname={user.surname}
                name={user.name}
                image={user.profilePicture}
                hickies={user.hickies}
                pumpkins={user.pumpkins}
                dob={user.dob}
                coverPicture={user.coverPicture}
                city={user.city}
                country={user.country}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default WithSomeIntrest;
