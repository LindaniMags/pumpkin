import MainHeader from "@/components/UI/Header/MainHeader"
import UserProfileHome from "@/components/UserProfile/UserProfileHome"
import Head from "next/head"

const UserProfile = () => {
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
            <UserProfileHome />
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserProfile