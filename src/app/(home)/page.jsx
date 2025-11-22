import CategoriesSkeleton from "@/components/category/CategoriesSkeleton"
import BlogSection from "@/components/home/BlogSection"
import FeaturedCategories from "@/components/home/FeaturedCategories"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import HeroSection from "@/components/home/HeroSection"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import TrendingProducts from "@/components/home/TrendingProducts"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import { getAllCategories } from "@/server/category.action"
import { Suspense } from "react"

const page = async () => {

    const [featuredCategories] = await Promise.allSettled([
        getAllCategories(),
        // getFeaturedCategories(),
    ]);

    // const products = featuredProducts.status === 'fulfilled' ? featuredProducts.value : [];
    const categories = featuredCategories.status === 'fulfilled' ? featuredCategories?.value : [];


    return (
        <>
            <HeroSection />
            <FeaturedCategories categories={categories} />

            <FeaturedProducts />
            {/* <TrendingProducts /> */}
            <WhyChooseUs />
            <HowItWorks />
            <Testimonials />
            <BlogSection />
        </>
    )
}

export default page