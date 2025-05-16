import React from "react";
import UserImage from "../../../assets/images/User01.png";
import Image from "next/image";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { BiImageAdd, BiUser } from "react-icons/bi";

function ProfileCard({
  id,
  username,
  email,
  coverPicture,
  name,
  image,
  surname = "",
  hickies,
  pumpkins,
  dob,
  city,
  country,
}) {
  function getSurnameInitials(surname) {
    // Split the surname into an array of words
    const surnameWords = (surname || "").trim().split(" ");

    // Extract the initial of each word
    const initials = surnameWords.map((word) => word.charAt(0).toUpperCase());

    // Join the initials into a single string
    const initialsString = initials.join("");

    return initialsString;
  }

  const router = useRouter();
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
  return (
    <div
      className="relative w-full max-w-[300px] mx-auto cursor-pointer"
      onClick={() => {
        setCookie("selectedUserProfile", email);
        router.push(`../../user-profile`);
      }}
    >
      <div className="relative w-full">
        <div className="aspect-[4/5] w-full overflow-hidden">
          <Image
            src={
              coverPicture ||
              "https://firebasestorage.googleapis.com/v0/b/pumpkin-web.appspot.com/o/posts%2FCImkQo7VhL6HSz8pu4sc%2Fimage?alt=media&token=8cc0a660-ca8b-461c-bfd3-a324aeeec56c"
            }
            width={400}
            height={500}
            className="w-full h-full object-cover lg:rounded-3xl rounded-xl"
            alt="profile"
            unoptimized={true}
            priority={true}
            loader={({ src }) => src}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl lg:rounded-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 lg:p-4">
        <div className="text-white flex flex-col w-full space-y-1 lg:space-y-2">
          <div className="font-bold text-sm lg:text-base line-clamp-1">
            {name} {surname} {calculateAge(dob)}
          </div>

          <div className="text-xs lg:text-sm line-clamp-1">
            {pumpkins} Pumkins - {hickies} Hickies
          </div>

          <div className="text-xs lg:text-sm line-clamp-1">
            Lives in{" "}
            <span className="font-bold">
              {city || "Mbabane"}, {country}
            </span>
          </div>

          <div className="pt-2">
            <span className="bg-white px-2 py-1 rounded-lg text-xs text-blue-600 font-bold inline-block">
              New
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
