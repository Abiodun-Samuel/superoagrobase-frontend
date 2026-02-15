import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import AdminProductDetails from '@/components/products/AdminProductDetails';
import { getDashboardProductDetailsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardProductDetailsMetadata();

const ProductDetailsPage = async ({ params }) => {
    const { slug } = await params;
    return (
        <>
            <PageBreadcrumb
                pageTitle="Product Details"
                description="View and edit product information including pricing, inventory levels, descriptions, images, and categories."
            />
            <DashboardSection>
                <AdminProductDetails slug={slug} />
            </DashboardSection>
        </>
    );
};

export default ProductDetailsPage;