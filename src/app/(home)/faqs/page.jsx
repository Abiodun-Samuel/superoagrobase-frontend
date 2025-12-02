import FAQPage from "@/components/page/FaqsPage"
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import { getFAQPageJsonLd } from "@/utils/seo/seo.jsonld";
import { getFAQsMetadata } from "@/utils/seo/seo.meta";

export const metadata = getFAQsMetadata();

const FaqsPage = () => {
    return (
        <>
            <JsonLdScripts generators={[getFAQPageJsonLd]} />
            <FAQPage />
        </>
    )
}

export default FaqsPage