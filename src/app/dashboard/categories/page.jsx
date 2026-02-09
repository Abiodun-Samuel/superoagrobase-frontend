import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardCategoriesMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardCategoriesMetadata();

const CategoriesPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Categories Management"
                description="Manage product categories for agricultural supplies. Create new categories, edit existing ones, and organize category hierarchy."
            />
            <DashboardSection>
                CategoriesTable
            </DashboardSection>
        </>
    );
};

export default CategoriesPage;