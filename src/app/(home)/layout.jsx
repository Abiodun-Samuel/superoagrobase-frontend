'use client'
import Footer from "@/layout/home/Footer";
import Header from "@/layout/home/Header";

export default function HomeLayout({ children }) {
  return (
    <>
      <Header />
      <div className="mt-2.5 overflow-x-hidden!">
        {children}
      </div>
      <Footer />
    </>
  )
}
