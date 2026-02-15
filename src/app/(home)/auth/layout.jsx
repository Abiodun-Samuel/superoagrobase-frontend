'use client'

import Animation from "@/components/common/Animation";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <Animation animation={'zoom-in'} className="max-w-5xl mx-auto">
      <div className="mx-2.5 shadow border rounded-xl grid grid-cols-1 md:grid-cols-2 items-stretch my-20 gap-0">
        <div className="hidden md:block relative">
          <Image
            src="/images/bg/auth-bg.png"
            alt="Auth background"
            fill
            sizes="(max-width: 767px) 0vw, (max-width: 1023px) 50vw, 512px"
            priority
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
      </div>
    </Animation>
  )
}
