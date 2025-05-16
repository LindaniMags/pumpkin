import SearchBar from "@/components/Discover/SearchBar";
import MainHeader from "@/components/UI/Header/MainHeader";
import YouMayKnowHome from "@/components/YouMayKnow/YouMayKnowHome";
import RandomPopupWrapper from "@/components/Layout/RandomPopupWrapper";
import Head from "next/head";
import { BiCopyright } from "react-icons/bi";

export default function Discover() {
  return (
    <RandomPopupWrapper>
      <div>
        <Head>
          <title>Discover - Pumpkin</title>
          <link rel="icon" href="/favicon.ico" />
          <meta charSet="utf-8" />
        </Head>
        <main className="flex h-screen pb-6 w-screen overflow-auto bg-gradient-to-l justify-center from-[#EFEFEF] to-[#EFEFEF] z-[-1]">
          <div className="items-center flex flex-col">
            <span className='flex z-50 w-screen'>
              <MainHeader />
            </span>
            <div className='max-w-[900px] w-full '>
              <SearchBar />
              <YouMayKnowHome />
            </div>
          </div>
        </main>
      </div>
    </RandomPopupWrapper>
  );
}
