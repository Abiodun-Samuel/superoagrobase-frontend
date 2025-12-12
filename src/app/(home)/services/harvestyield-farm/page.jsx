import PageLayout from "@/components/page/PageLayout"
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import HarvestYieldFarm from "@/components/services/HarvestYieldFarm"
import { getHarvestYieldFarmBreadcrumbJsonLd, getHarvestYieldFarmJsonLd } from "@/utils/seo/seo.jsonld";
import { getHarvestYieldFarmMetadata } from "@/utils/seo/seo.meta";

export const metadata = getHarvestYieldFarmMetadata();
const HarvestYieldFarmPage = () => {
    const jsonLdGenerators = [getHarvestYieldFarmJsonLd, getHarvestYieldFarmBreadcrumbJsonLd];
    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageLayout
                subtitle='Production of Premium Vegetable Crops'
                title={<>
                    HarvestYield <span className="text-green-200">Farm</span>
                </>}
                description="Operating across 10 hectares of prime agricultural land, we specialize in producing high-quality vegetables using modern farming techniques and scientific approaches to ensure consistent supply and superior produce quality."
                badge="Farm-to-Table Excellence"
                breadcrumbs={[
                    { label: 'Services', href: '/about#services' },
                    { label: 'HarvestYield Farm', href: '/services/harvestyield-farm' }
                ]}>
                <HarvestYieldFarm />
            </PageLayout>
        </>
    )
}

export default HarvestYieldFarmPage
