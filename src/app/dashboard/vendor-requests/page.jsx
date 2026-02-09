import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import VendorRequestsTable from '@/components/dashboard/vendor-request/VendorRequestsTable';
import { getDashboardVendorRequestsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardVendorRequestsMetadata();

const VendorRequestsPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Vendor Requests"
                description="Review and process vendor registration requests. Verify business information and approve or reject applications."
            />
            <DashboardSection>
                <VendorRequestsTable />
            </DashboardSection>
        </>
    );
};

export default VendorRequestsPage;

