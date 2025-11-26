import FAQPage from "@/components/page/FaqsPage"
import { getFAQPageJsonLd } from "@/utils/seo/seo.jsonld";
import { getFAQsMetadata } from "@/utils/seo/seo.meta";

export const metadata = getFAQsMetadata();

const FaqsPage = () => {
    const faqSchema = getFAQPageJsonLd()
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <FAQPage />
        </>
    )
}

export default FaqsPage