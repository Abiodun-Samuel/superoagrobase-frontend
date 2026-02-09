import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getTermsOfServiceMetadata } from '@/utils/seo/seo.meta';
import {
    getTermsOfServiceBreadcrumbJsonLd,
    getTermsOfServicePageJsonLd,
    getTermsOfServiceFAQJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import { TermsOfService } from '@/components/legal/TermsOfService';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getTermsOfServiceMetadata();

const TermsOfServicePage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getTermsOfServiceBreadcrumbJsonLd,
        getTermsOfServicePageJsonLd,
        getTermsOfServiceFAQJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Terms of Service"
                description="Read our terms and conditions governing the use of SuperoAgrobase. Understand your rights, responsibilities, purchase terms, delivery policies, and dispute resolution procedures."
                badge="Legal"
                breadcrumbs={[
                    { label: 'Terms of Service', href: '/terms-of-service' }
                ]}
                isBackButton={false}
            />
            <PageLayout>
                <TermsOfService />
            </PageLayout>
        </>
    );
};

export default TermsOfServicePage;