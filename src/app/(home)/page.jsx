import BlogSection from "@/components/home/BlogSection"
import FeaturedCategoriesSSR from "@/components/home/FeaturedCategoriesSSR"
import HeroWithFeaturedProductsSSR from "@/components/home/HeroWithFeaturedProductsSSR"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import TrendingProductsSSR from "@/components/home/TrendingProductsSSR"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import { getHomeFAQJsonLd, getHomePageJsonLd, getOfferCatalogJsonLd } from "@/utils/seo/seo.jsonld"
import { getHomeMetadata } from "@/utils/seo/seo.meta"

export const metadata = getHomeMetadata();

const HomePage = async () => {

    const jsonLdScripts = [
        getOfferCatalogJsonLd(),
        getHomePageJsonLd(),
        getHomeFAQJsonLd(),
    ];

    return (
        <>
            {jsonLdScripts.map((jsonLd, idx) => (
                <script
                    key={idx}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            ))}

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