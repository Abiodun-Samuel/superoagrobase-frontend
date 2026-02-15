import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getVendorProductsMetadata } from '@/utils/seo/seo.meta';
import {
    getVendorProductsBreadcrumbJsonLd,
    getVendorProductsPageJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import VendorProducts from '@/components/vendor/VendorProducts';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getVendorProductsMetadata();

const VendorProductsPage = async ({ searchParams }) => {
    const { vendor_id } = await searchParams;
    const actionUrl = vendor_id ? `/account/products/add?vendor_id=${vendor_id}` : '/account/products/'
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getVendorProductsBreadcrumbJsonLd,
        getVendorProductsPageJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                badge="Product Management"
                title="My Products"
                description="Manage your product catalog and pricing"
                breadcrumbs={[
                    { label: 'My Products', href: '/account/products' },
                ]}
                actionUrl={actionUrl}
                actionLabel="Add Products"
                isBackButton={true}
            />
            <PageLayout>
                <VendorProducts vendorId={vendor_id} />
            </PageLayout>
        </>
    );
};

export default VendorProductsPage;