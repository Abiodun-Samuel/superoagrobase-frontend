import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
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
                VendorsTable
            </DashboardSection>
        </>
    );
};

export default VendorsPage;