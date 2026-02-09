import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getAgroInputBreadcrumbJsonLd, getAgroInputJsonLd } from '@/utils/seo/seo.jsonld';
import { getAgroInputMetadata } from '@/utils/seo/seo.meta';
import AgroInput from '@/components/services/AgroInput';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getAgroInputMetadata();

const AgroInputPage = () => {
    const jsonLdGenerators = [
        getAgroInputJsonLd,
        getAgroInputBreadcrumbJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title={
                    <>
                        Agro-Input <span className="text-green-500">Products</span>
                    </>
                }
                subtitle="Sales of Agro-Input Products"
                description="Protecting farmers from adulterated and low-quality agricultural inputs through rigorous research, quality authentication, and verified product promotion. We bridge the gap between manufacturers and farmers with transparency and trust."
                badge="Trusted Agricultural Solutions"
                breadcrumbs={[
                    { label: 'Services', href: '/services' },
                    { label: 'Agro-Input', href: '/services/agro-input' }
                ]}
                isBackButton={true}
            />
            <PageLayout>
                <AgroInput />
            </PageLayout>
        </>
    );
};

export default AgroInputPage;