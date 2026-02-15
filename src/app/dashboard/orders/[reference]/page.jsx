import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import AdminOrderDetails from '@/components/orders/AdminOrderDetails';
import { getDashboardOrderDetailsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardOrderDetailsMetadata();

const OrderDetailsPage = async ({ params }) => {
    const { reference } = await params;
    return (
        <>
            <PageBreadcrumb
                pageTitle="Order Details"
                description="View complete order information including customer details, order items, payment status, and shipping information."
            />
            <DashboardSection>
                <AdminOrderDetails reference={reference} />
            </DashboardSection>
        </>
    );
};

export default OrderDetailsPage;