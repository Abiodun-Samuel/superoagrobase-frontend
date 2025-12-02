import { getAboutMetadata } from '@/utils/seo/seo.meta';
import { getAboutBreadcrumbJsonLd, getAboutPageJsonLd, getAboutOrganizationJsonLd, getAboutFAQJsonLd, getLocalBusinessJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
import AboutPageDetails from '@/components/about/AboutPageDetails';
import JsonLdScripts from '@/components/provider/JsonLdScripts';

export async function generateMetadata() { return getAboutMetadata() }

export default function AboutPage() {
    const jsonLdGenerators = [getOrganizationJsonLd, getAboutPageJsonLd, getAboutBreadcrumbJsonLd, getAboutOrganizationJsonLd, getLocalBusinessJsonLd, getAboutFAQJsonLd];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <AboutPageDetails />
        </>
    );
}