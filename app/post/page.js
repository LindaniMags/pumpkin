import LoginHome from "@/components/Login Page/LoginHome";
import ProfileHome from "@/components/Profile/Profile";
import ImageInput from "@/components/UI/ImageInput/ImageInput";
import MainHeader from "@/components/UI/Header/MainHeader";
import { getCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";

export default function Post() {

    return (
        <div>
            <Head>
                <title>Profile - Pumpkin</title>
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
                
            </Head>
            <main className=" flex  h-screen w-screen overflow-auto
    bg-gradient-to-l justify-center from-[#EFEFEF]   to-[#EFEFEF]
     z-[-1]">
                <div className="items-center flex flex-col">
                    <span className='flex z-50 w-screen'>
                        <MainHeader />
                    </span>
                    <div className='max-w-[1280px] w-full '>
                        <ImageInput/>
                    </div></div>

            </main>
        </div>
    );
}
