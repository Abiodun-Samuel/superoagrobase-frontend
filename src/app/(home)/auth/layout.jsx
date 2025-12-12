'use client'

import Animation from "@/components/common/Animation";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <Animation animation={'zoom-in'} className="grid grid-cols-1 md:grid-cols-2 items-stretch my-20 gap-0 max-w-5xl mx-auto shadow border rounded-xl">
      <div className="hidden md:block relative">
        <Image
          src="/images/bg/auth-bg.png"
          alt="Auth background"
          fill
          className="object-cover rounded-tl-lg rounded-bl-lg"
        />
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-lg relative">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl py-8 px-6 md:p-10">

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 dark:from-green-400/20 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 dark:from-green-400/20 to-transparent rounded-tr-full"></div>

            {children}
          </div>
        </div>
      </div>
    </Animation>
  )
}
