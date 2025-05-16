import LandingPage from "@/components/LandingPage/LandingPage";
import Header from "@/components/UI/Header/Header";
import Image from "next/image";
import PatternF from '../assets/images/PatternF.png'
export default function Home() {
  return (
    <main className=" flex justify-center h-screen w-full overflow-auto
    bg-gradient-to-l from-[#C3530A]  to-[#191222]
     z-[-1]">
      <span className='absolute z-[100] w-full'>
        <Header />
      </span>
      <div className='max-w-[1280px]'>
        <LandingPage />
      </div>

    </main>
  );
}
