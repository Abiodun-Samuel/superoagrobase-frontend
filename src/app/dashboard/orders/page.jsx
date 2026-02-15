import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import AdminOrderList from '@/components/orders/AdminOrderList';
import { getDashboardOrdersMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardOrdersMetadata();

const OrdersPage = async ({ searchParams }) => {
    const params = await searchParams
    return (
        <>
            <PageBreadcrumb
                pageTitle="Orders Management"
                description="View and manage all customer orders. Track order status, process shipments, and handle refunds."
            />
            <DashboardSection>
                <AdminOrderList params={params} />
            </DashboardSection>
        </>
    );
};

export default OrdersPage;