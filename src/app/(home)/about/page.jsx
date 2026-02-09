import { getAboutMetadata } from '@/utils/seo/seo.meta';
import { getAboutBreadcrumbJsonLd, getAboutPageJsonLd, getAboutOrganizationJsonLd, getAboutFAQJsonLd, getLocalBusinessJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
import AboutDetailsPage from '@/components/about/AboutDetailsPage';
import JsonLdScripts from '@/components/provider/JsonLdScripts';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getAboutMetadata();

export default function AboutPage() {
    const jsonLdGenerators = [getOrganizationJsonLd, getAboutPageJsonLd, getAboutBreadcrumbJsonLd, getAboutOrganizationJsonLd, getLocalBusinessJsonLd, getAboutFAQJsonLd];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title={
                    <>
                        About <span className="text-green-600">Supero Agrobase</span>
                    </>
                }
                description="A fast-rising agribusiness enterprise leveraging in-depth research and development to empower Nigerian farmers with quality agricultural inputs, expert farm management, and comprehensive laboratory services."
                badge="Empowering Nigerian Agriculture"
                breadcrumbs={[{ label: 'About Us', href: '/about' }]}
            />
            <PageLayout>
                <AboutDetailsPage />
            </PageLayout>
        </>
    );
}