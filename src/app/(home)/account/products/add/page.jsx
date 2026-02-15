import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getVendorAddProductMetadata } from '@/utils/seo/seo.meta';
import {
    getVendorAddProductBreadcrumbJsonLd,
    getVendorAddProductPageJsonLd,
    getVendorProductManagementJsonLd,
    getVendorAddProductHowToJsonLd,
    getVendorProductManagementFAQJsonLd
} from '@/utils/seo/seo.jsonld';
import AddVendorProducts from '@/components/vendor/AddVendorProducts';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export async function generateMetadata() {
    return getVendorAddProductMetadata();
}

const AddVendorProductsPage = async ({ searchParams }) => {
    const { vendor_id } = await searchParams;
    const jsonLdGenerators = [
        getVendorAddProductPageJsonLd,
        getVendorAddProductBreadcrumbJsonLd,
        getVendorProductManagementJsonLd,
        getVendorAddProductHowToJsonLd,
        getVendorProductManagementFAQJsonLd
    ];


    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                badge="Add New Product"
                title="Add Products to Catalog"
                description="Browse inventory, select products, and configure pricing to add them to your vendor catalog"
                breadcrumbs={[
                    { label: 'My Products', href: '/account/products' },
                    { label: 'Add Products', href: '/account/products/add' },
                ]}
                isBackButton={true}
            />
            <PageLayout>
                <AddVendorProducts vendorId={vendor_id} />
            </PageLayout>
        </>
    );
};

export default AddVendorProductsPage;