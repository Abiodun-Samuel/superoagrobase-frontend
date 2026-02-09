import BecomeVendor from "@/components/services/BecomeVendor";
import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getBecomeVendorMetadata } from '@/utils/seo/seo.meta';
import {
    getBecomeVendorBreadcrumbJsonLd,
    getBecomeVendorPageJsonLd,
    getVendorProgramJsonLd,
    getBecomeVendorFAQJsonLd,
    getVendorApplicationHowToJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import PageLayout from "@/components/page/PageLayout";
import PageHeader from "@/components/page/PageHeader";

export const metadata = getBecomeVendorMetadata();


const BecomeVendorPage = async ({ searchParams }) => {
    const { email } = await searchParams;

    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getBecomeVendorPageJsonLd,
        getBecomeVendorBreadcrumbJsonLd,
        getVendorProgramJsonLd,
        getBecomeVendorFAQJsonLd,
        getVendorApplicationHowToJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Become a Vendor"
                description="Join our marketplace and reach thousands of farmers across Nigeria. List your products, set your prices, and start receiving orders directly."
                badge="Partner with Us"
                breadcrumbs={[
                    { label: 'Become a Vendor', href: '/become-vendor' },
                ]}
                actionUrl="#apply"
                actionLabel="Start Selling Today"
                isBackButton={false}
            />
            <PageLayout>
                <BecomeVendor email={email} />
            </PageLayout>
        </>
    );
};

export default BecomeVendorPage;