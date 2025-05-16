'use client'
import FeedPosts from "@/components/Feed/FeedPosts";
import Slider from "@/components/Feed/Slider";
import LoginHome from "@/components/Login Page/LoginHome";
import DiscoverBanner from "@/components/UI/Banners/Discover";
import Header from "@/components/UI/Header/Header";
import MainHeader from "@/components/UI/Header/MainHeader";
import Loader from "@/components/UI/Loader";
import WithSomeIntrest from "@/components/WithSameIntrest/WithSomeIntrest";
import YouMayKnowHome from "@/components/YouMayKnow/YouMayKnowHome";
import WelcomeUserPopUp from "@/components/PopUp/WelcomeUser";
import RandomPopupWrapper from "@/components/Layout/RandomPopupWrapper";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCopyright } from 'react-icons/bi'

export default function Feed() {
  const [loader, setLoader] = useState(false);
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
      setLoader(true);
      const timer = setTimeout(() => setLoader(false), 1000);
      return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (loader) {
      return (
        <div className="relative items-center justify-center flex h-screen w-full">
          <Loader />
        </div>
      );
    }
  return (
    <RandomPopupWrapper>
      <main className=" flex justify-center h-screen w-full overflow-auto
      bg-gradient-to-l from-[#FFFFFF]  to-[#FFFFFF]
      z-[-1]">
        <WelcomeUserPopUp />
        <span className='absolute z-50 w-full'>
          <MainHeader />
        </span>
        <div className='max-w-[1000px] w-full space-y-6 py-16 lg:pt-0'>
          <Slider />
          <YouMayKnowHome />
          <DiscoverBanner />
          <FeedPosts />
          <WithSomeIntrest />
          <footer className="flex w-full justify-center items-center font-bold text-lg py-12">
            <BiCopyright />
            <p>Pumpkin 2024</p>
          </footer>
        </div>
      </main>
    </RandomPopupWrapper>
  );
}
