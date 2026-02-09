import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getServicesMetadata } from '@/utils/seo/seo.meta';
import {
    getServicesBreadcrumbJsonLd,
    getServicesPageJsonLd,
    getServicesCollectionJsonLd,
    getServicesFAQJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import ServicesOverview from '@/components/services/ServicesOverview';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getServicesMetadata();

const ServicesPage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getServicesBreadcrumbJsonLd,
        getServicesPageJsonLd,
        getServicesCollectionJsonLd,
        getServicesFAQJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Our Services"
                description="Comprehensive agricultural solutions including agro-input authentication, quality products supply, premium vegetable production, farm management, and agricultural consultancy services across Nigeria."
                badge="Services"
                breadcrumbs={[
                    { label: 'Services', href: '/services' }
                ]}
                isBackButton={false}
            />
            <PageLayout>
                <ServicesOverview />
            </PageLayout>
        </>
    );
};

export default ServicesPage;