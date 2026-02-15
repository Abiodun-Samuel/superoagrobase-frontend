import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import AdminProductList from '@/components/products/AdminProductList';
import { getDashboardProductsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardProductsMetadata();

const ProductsPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Products Management"
                description="Manage agricultural product catalog. Add new products, edit listings, update inventory, and approve vendor products."
            />
            <DashboardSection>
                <AdminProductList />
            </DashboardSection>
        </>
    );
};

export default ProductsPage