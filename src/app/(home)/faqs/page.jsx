import FAQPage from "@/components/page/FaqsPage";
import PageHeader from "@/components/page/PageHeader";
import PageLayout from "@/components/page/PageLayout";
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import {
    getFAQPageJsonLd,
    getFAQsBreadcrumbJsonLd,
    getOrganizationJsonLd
} from "@/utils/seo/seo.jsonld";
import { getFAQsMetadata } from "@/utils/seo/seo.meta";

export const metadata = getFAQsMetadata();

const FaqsPage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getFAQsBreadcrumbJsonLd,
        getFAQPageJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Frequently Asked Questions"
                description="Get answers to common questions about buying agricultural products, delivery, payments, returns, and more. Learn about our quality assurance and customer support."
                badge="Help Center"
                breadcrumbs={[
                    { label: 'FAQs', href: '/faqs' }
                ]}
            />
            <PageLayout>
                <FAQPage />
            </PageLayout>
        </>
    );
};

export default FaqsPage;