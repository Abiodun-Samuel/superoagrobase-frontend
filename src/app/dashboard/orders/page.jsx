import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardOrdersMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardOrdersMetadata();

const OrdersPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Orders Management"
                description="View and manage all customer orders. Track order status, process shipments, and handle refunds."
            />
            <DashboardSection>
                OrdersTable
            </DashboardSection>
        </>
    );
};

export default OrdersPage;