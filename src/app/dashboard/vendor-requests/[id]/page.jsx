import VendorRequestDetails from '@/components/dashboard/vendor-request/VendorRequestDetails';
import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardVendorRequestDetailsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardVendorRequestDetailsMetadata();

const VendorRequestDetailsPage = async ({ params }) => {
    const { id } = await params;
    return (
        <>
            <PageBreadcrumb
                pageTitle="Vendor Requests Details"
                description="Review vendor request details, verify business information, and approve or reject the application."
            />
            <DashboardSection>
                <VendorRequestDetails id={id} />
            </DashboardSection>
        </>
    );
};

export default VendorRequestDetailsPage;
