import LoginHome from "@/components/Login Page/LoginHome";
import SignUpHome from "@/components/SignUp/SignUpHome";
import Header from "@/components/UI/Header/Header";
import Image from "next/image";
import PatternF from '../../assets/images/PatternF.png'


export default function SignUp() {
  return (
    <main className=" flex justify-center h-screen w-full overflow-auto
    bg-gradient-to-l from-[#C3530A]  to-[#191222]
     z-[-1]">
      <span className='absolute z-50 w-full'>
        <Header />
      </span>
     
      <div className='max-w-[1280px]'>
        <SignUpHome />
      </div>

    </main>
  );
}
