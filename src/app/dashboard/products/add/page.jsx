import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import AdminCreateProduct from '@/components/products/AdminCreateProduct';
import { getDashboardCreateProductMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardCreateProductMetadata();

const CreateProductPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Create Product"
                description="Add a new agricultural product to the catalog. Set pricing, inventory, images, and product details."
            />
            <DashboardSection>
                <AdminCreateProduct />
            </DashboardSection>
        </>
    );
};

export default CreateProductPage;
