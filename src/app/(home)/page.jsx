import BlogSection from "@/components/home/BlogSection"
import FeaturedCategories from "@/components/home/FeaturedCategories"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import HeroSection from "@/components/home/HeroSection"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import TrendingProducts from "@/components/home/TrendingProducts"
import WhyChooseUs from "@/components/home/WhyChooseUs"

const page = () => {
    return (
        <>
            <HeroSection />
            <FeaturedCategories />
            <FeaturedProducts />
            <TrendingProducts />
            <WhyChooseUs />
            <HowItWorks />
            <Testimonials />
            <BlogSection />
        </>
    )
}

export default page