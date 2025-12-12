import ContactDetailsPage from '@/components/page/ContactDetailsPage'
import PageLayout from "@/components/page/PageLayout"
import { getContactMetadata } from '@/utils/seo/seo.meta';
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import { getContactBreadcrumbJsonLd, getContactFAQJsonLd, getContactLocalBusinessJsonLd, getContactOrganizationJsonLd, getContactPageJsonLd } from '@/utils/seo/seo.jsonld';

export const metadata = getContactMetadata();

const ContactPage = () => {
    const jsonLdGenerators = [getContactBreadcrumbJsonLd, getContactPageJsonLd, getContactOrganizationJsonLd, getContactLocalBusinessJsonLd, getContactFAQJsonLd];
    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageLayout
                title={<>
                    Get in <span className="text-green-200">Touch</span>
                </>}
                description=" Have questions about our products or services? Our agricultural experts are ready to assist you."
                badge=" We're here to help"
                breadcrumbs={[
                    { label: 'Contact', href: '/contact' },
                ]}>
                <ContactDetailsPage />
            </PageLayout>
        </>

    )
}

export default ContactPage
