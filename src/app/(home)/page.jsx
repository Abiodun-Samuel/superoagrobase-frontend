import BlogSection from "@/components/home/BlogSection"
import FeaturedCategoriesSSR from "@/components/home/FeaturedCategoriesSSR"
import HeroWithFeaturedProductsSSR from "@/components/home/HeroWithFeaturedProductsSSR"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import TrendingProductsSSR from "@/components/home/TrendingProductsSSR"
import WhyChooseUs from "@/components/home/WhyChooseUs"

const page = async () => {
    return (
        <>
            <HeroWithFeaturedProductsSSR />
            <FeaturedCategoriesSSR />
            <TrendingProductsSSR />
            <WhyChooseUs />
            <HowItWorks />
            <Testimonials />
            <BlogSection />
        </>
    )
}

export default page