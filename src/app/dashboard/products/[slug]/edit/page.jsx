import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import AdminUpdateProduct from '@/components/products/AdminUpdateProduct';

import { getDashboardEditProductMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardEditProductMetadata();

const EditProductPage = async ({ params }) => {
    const { slug } = await params;
    return (
        <>
            <PageBreadcrumb
                pageTitle="Edit Product"
                description="Update product details, pricing, inventory, images, and vendor approval status."
            />
            <DashboardSection>
                <AdminUpdateProduct slug={slug} />
            </DashboardSection>
        </>
    );
};

export default EditProductPage;
