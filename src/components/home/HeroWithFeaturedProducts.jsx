'use client'
import HeroSection from "@/components/home/HeroSection"
import { useFeaturedProducts } from "@/queries/products.query"
import FeaturedProducts from "./FeaturedProducts"

const HeroWithFeaturedProducts = () => {
    const { data: featuredProducts, isError, isLoading } = useFeaturedProducts()
    const params = { isError, isLoading }
    return (
        <>
            <HeroSection featuredProducts={featuredProducts} {...params} />
            <FeaturedProducts featuredProducts={featuredProducts} {...params} />
        </>
    )
}

export default HeroWithFeaturedProducts