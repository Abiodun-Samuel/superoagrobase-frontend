import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getUserOrdersMetadata } from '@/utils/seo/seo.meta';
import {
    getUserOrdersBreadcrumbJsonLd,
    getUserOrdersPageJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';
import OrderList from '@/components/orders/OrderList';

export const metadata = getUserOrdersMetadata();

const UserOrdersPage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getUserOrdersBreadcrumbJsonLd,
        getUserOrdersPageJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="My Orders"
                description="View and track your order history"
                breadcrumbs={[
                    { label: 'My Orders', href: '/account/orders' },
                ]}
                badge="Order History"
                isBackButton={false}
            />
            <PageLayout>
                <OrderList />
            </PageLayout>
        </>
    );
};

export default UserOrdersPage;