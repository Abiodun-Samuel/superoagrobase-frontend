'use client'
import Footer from "@/layout/home/Footer";
import Navbar from "@/layout/home/Navbar";

export default function HomeLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-3 sm:px-5 lg:px-7 my-2 overflow-x-hidden!">
        {children}
      </div>
      <Footer />
    </>
  )
}
