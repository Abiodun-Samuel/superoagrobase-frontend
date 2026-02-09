import { Disclaimer } from '@/components/legal/Disclaimer';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getDisclaimerMetadata } from '@/utils/seo/seo.meta';
import {
    getDisclaimerBreadcrumbJsonLd,
    getDisclaimerPageJsonLd,
    getDisclaimerFAQJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import { FileText } from 'lucide-react';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getDisclaimerMetadata();

const DisclaimerPage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getDisclaimerBreadcrumbJsonLd,
        getDisclaimerPageJsonLd,
        getDisclaimerFAQJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Disclaimer"
                description="Important disclaimer about product information, pricing, agricultural advice, and limitations of liability for SuperoAgrobase. Please read carefully before making purchases."
                badge="Legal"
                breadcrumbs={[
                    { label: 'Disclaimer', href: '/disclaimer' }
                ]}
            />
            <LegalPageLayout icon={FileText} title="Disclaimer">
                <Disclaimer />
            </LegalPageLayout>
        </>
    );
};

export default DisclaimerPage;