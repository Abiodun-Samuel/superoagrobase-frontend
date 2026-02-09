import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getAgriCourtVenturesBreadcrumbJsonLd, getAgriCourtVenturesJsonLd } from '@/utils/seo/seo.jsonld';
import { getAgriCourtVenturesMetadata } from '@/utils/seo/seo.meta';
import AgriCourt from '@/components/services/AgriCourt';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getAgriCourtVenturesMetadata();

const AgriCourtPage = () => {
    const jsonLdGenerators = [
        getAgriCourtVenturesJsonLd,
        getAgriCourtVenturesBreadcrumbJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title={
                    <>
                        AgriCourt <span className="text-green-500">Ventures</span>
                    </>
                }
                subtitle="Sales of Quality Agro-Input Products"
                description="Through in-depth research and development, we've focused on serving the needs of Nigerian farmers through the provision of quality agricultural inputs. Our comprehensive product range ensures farmers have access to everything needed for successful, modern agricultural operations."
                badge="Premium Agricultural Inputs"
                breadcrumbs={[
                    { label: 'Services', href: '/services' },
                    { label: 'AgriCourt Ventures', href: '/services/agricourt-ventures' }
                ]}
                isBackButton={true}
            />
            <PageLayout>
                <AgriCourt />
            </PageLayout>
        </>
    );
};

export default AgriCourtPage;