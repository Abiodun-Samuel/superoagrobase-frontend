import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getCookiePolicyMetadata } from '@/utils/seo/seo.meta';
import {
    getCookiePolicyBreadcrumbJsonLd,
    getCookiePolicyPageJsonLd,
    getCookiePolicyFAQJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import { CookiePolicy } from '@/components/legal/CookiePolicy';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getCookiePolicyMetadata();

const CookiePolicyPage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getCookiePolicyBreadcrumbJsonLd,
        getCookiePolicyPageJsonLd,
        getCookiePolicyFAQJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Cookie Policy"
                description="Understand how SuperoAgrobase uses cookies and tracking technologies to improve your browsing experience. Learn about cookie types, third-party cookies, and how to manage your preferences."
                badge="Legal"
                breadcrumbs={[
                    { label: 'Cookie Policy', href: '/cookie-policy' }
                ]}
                isBackButton={false}
            />
            <PageLayout>
                <CookiePolicy />
            </PageLayout>
        </>
    );
};

export default CookiePolicyPage;