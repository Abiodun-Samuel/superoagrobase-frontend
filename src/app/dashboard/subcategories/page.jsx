// ========================================
import AdminSubcategoryList from '@/components/category/AdminSubcategoryList';
import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardSubcategoriesMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardSubcategoriesMetadata();

const SubcategoriesPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Subcategories Management"
                description="Manage product subcategories and organize product taxonomy. Create, edit, and arrange subcategories under parent categories."
            />
            <DashboardSection>
                <AdminSubcategoryList />
            </DashboardSection>
        </>
    );
};

export default SubcategoriesPage;