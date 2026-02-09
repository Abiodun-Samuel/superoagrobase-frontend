import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getContactMetadata } from '@/utils/seo/seo.meta';
import {
    getContactBreadcrumbJsonLd,
    getContactFAQJsonLd,
    getContactLocalBusinessJsonLd,
    getContactOrganizationJsonLd,
    getContactPageJsonLd
} from '@/utils/seo/seo.jsonld';
import ContactDetailsPage from '@/components/page/ContactDetailsPage';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getContactMetadata();

const ContactPage = () => {
    const jsonLdGenerators = [
        getContactOrganizationJsonLd,
        getContactBreadcrumbJsonLd,
        getContactPageJsonLd,
        getContactLocalBusinessJsonLd,
        getContactFAQJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title={
                    <>
                        Get in <span className="text-green-600">Touch</span>
                    </>
                }
                description="Have questions about our products or services? Our agricultural experts are ready to assist you."
                badge="We're Here to Help"
                breadcrumbs={[
                    { label: 'Contact', href: '/contact' },
                ]}
                isBackButton={false}
            />
            <PageLayout>
                <ContactDetailsPage />
            </PageLayout>
        </>
    );
};

export default ContactPage;