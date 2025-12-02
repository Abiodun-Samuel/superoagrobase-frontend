import BlogSection from "@/components/home/BlogSection"
import FeaturedCategoriesSSR from "@/components/home/FeaturedCategoriesSSR"
import HeroWithFeaturedProductsSSR from "@/components/home/HeroWithFeaturedProductsSSR"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import TrendingProductsSSR from "@/components/home/TrendingProductsSSR"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import JsonLdScripts from "@/components/provider/JsonLdScripts"
import { getHomeFAQJsonLd, getHomePageJsonLd, getOfferCatalogJsonLd } from "@/utils/seo/seo.jsonld"
import { getHomeMetadata } from "@/utils/seo/seo.meta"

export const metadata = getHomeMetadata();

const HomePage = async () => {

    const jsonLdScripts = [getOfferCatalogJsonLd, getHomePageJsonLd, getHomeFAQJsonLd];

    return (
        <>
            <JsonLdScripts generators={jsonLdScripts} />

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

export default HomePage