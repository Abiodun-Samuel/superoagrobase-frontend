import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getHarvestYieldFarmBreadcrumbJsonLd, getHarvestYieldFarmJsonLd } from '@/utils/seo/seo.jsonld';
import { getHarvestYieldFarmMetadata } from '@/utils/seo/seo.meta';
import HarvestYieldFarm from '@/components/services/HarvestYieldFarm';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getHarvestYieldFarmMetadata();

const HarvestYieldFarmPage = () => {
    const jsonLdGenerators = [
        getHarvestYieldFarmJsonLd,
        getHarvestYieldFarmBreadcrumbJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title={
                    <>
                        HarvestYield <span className="text-green-500">Farm</span>
                    </>
                }
                subtitle="Production of Premium Vegetable Crops"
                description="Operating across 10 hectares of prime agricultural land, we specialize in producing high-quality vegetables using modern farming techniques and scientific approaches to ensure consistent supply and superior produce quality."
                badge="Farm-to-Table Excellence"
                breadcrumbs={[
                    { label: 'Services', href: '/services' },
                    { label: 'HarvestYield Farm', href: '/services/harvestyield-farm' }
                ]}
                isBackButton={true}
            />
            <PageLayout>
                <HarvestYieldFarm />
            </PageLayout>
        </>
    );
};

export default HarvestYieldFarmPage;