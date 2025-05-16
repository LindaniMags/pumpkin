"use client";
import React, { useEffect, useState } from "react";
import ProfileCard from "../UI/Card/ProfileCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProfileCardMatches from "../UI/Card/ProfileCardMatches";

function MatchesHome() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className="max-w-[90vw]  px-6  lg:p-0 lg:max-w-[600px] mt-0">
      <p
        className="text-xs font-bold text-black"
        style={{ visibility: "hidden" }}
      >
        .
      </p>
      <div className="">
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={false}
          infinite={true}
          responsive={responsive}
          className=""
        >
          {users.map((user) => (
            <div
              key={user._id}
              className="lg:mx-4 mx-2 w-full flex justify-center"
            >
              <ProfileCardMatches
                id={user._id}
                image={user.profilePicture}
                username={user.username}
                name={user.name}
                surname={user.surname}
                dob={user.dob}
                hickies={user.hickies}
                pumpkins={user.pumpkins}
                email={user.email}
                coverPicture={user.coverPicture}
                city={user.city || ""}
                country={user.country || ""}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default MatchesHome;
