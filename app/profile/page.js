import LoginHome from "@/components/Login Page/LoginHome";
import NewUserPopUp from "@/components/PopUp/NewUser";
import WelcomeUserPopUp from "@/components/PopUp/WelcomeUser";
import RandomPopupWrapper from "@/components/Layout/RandomPopupWrapper";
import ProfileHome from "@/components/Profile/Profile";
import Header from "@/components/UI/Header/Header";
import MainHeader from "@/components/UI/Header/MainHeader";
import { getCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import 'react-image-crop/dist/ReactCrop.css'

export default function Profile() {

    return (
        <RandomPopupWrapper>
            <div>
                <Head>
                    <title>Profile - Pumpkin</title>
                    <link rel="icon" href="/favicon.ico" />
                    <meta charSet="utf-8" />
                </Head>
                <main className=" flex  h-screen w-screen overflow-auto
        bg-gradient-to-l justify-center relative bg-slate-50
         ">
                    <div className="items-center flex flex-col">
                        <span className='flex z-50 w-screen'>
                            <MainHeader />
                        </span>
                        <div className='max-w-[1280px] w-full '>
                            <ProfileHome />
                        </div>
                    </div>
                    <span className="absolute z-50 top-[30%] ">
                        <NewUserPopUp />
                    </span>
                    <WelcomeUserPopUp />
                </main>
            </div>
        </RandomPopupWrapper>
    );
}
