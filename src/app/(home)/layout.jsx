'use client'
import Footer from "@/layout/home/Footer";
import Header from "@/layout/home/Header";

export default function HomeLayout({ children }) {
  return (
    <>
      <Header />
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 my-2 overflow-x-hidden!">
        {children}
      </div>
      <Footer />
    </>
  )
}
