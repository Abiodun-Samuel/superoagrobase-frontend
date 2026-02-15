import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import AdminVendorList from '@/components/vendor/AdminVendorList';
import { getDashboardVendorsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardVendorsMetadata();

const VendorsPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Vendors Management"
                description="Manage vendor accounts, monitor performance, track sales metrics, and oversee vendor product listings."
            />
            <DashboardSection>
                <AdminVendorList />
            </DashboardSection>
        </>
    );
};

export default VendorsPage;