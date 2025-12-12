import PageLayout from "@/components/page/PageLayout"
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import AgriCourt from "@/components/services/AgriCourt"
import { getAgriCourtVenturesBreadcrumbJsonLd, getAgriCourtVenturesJsonLd } from "@/utils/seo/seo.jsonld";
import { getAgriCourtVenturesMetadata } from "@/utils/seo/seo.meta";

export const metadata = getAgriCourtVenturesMetadata();
const AgriCourtPage = () => {
    const jsonLdGenerators = [getAgriCourtVenturesJsonLd, getAgriCourtVenturesBreadcrumbJsonLd];
    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageLayout
                subtitle='Sales of Quality Agro-Input Products'
                title={<>
                    AgriCourt <span className="text-green-200">Ventures</span>
                </>}
                description="Through in-depth research and development, we've focused on serving the needs of Nigerian farmers through the provision of quality agricultural inputs. Our comprehensive product range ensures farmers have access to everything needed for successful, modern agricultural operations."
                badge="Premium Agricultural Inputs"
                breadcrumbs={[
                    { label: 'Services', href: '/about#services' },
                    { label: 'AgriCourt Ventures', href: '/services/agricourt-ventures' }
                ]}>
                <AgriCourt />
            </PageLayout>
        </>
    )
}

export default AgriCourtPage
