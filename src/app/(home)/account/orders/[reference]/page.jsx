import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getOrderDetailsMetadata } from '@/utils/seo/seo.meta';
import {
    getOrderDetailsBreadcrumbJsonLd,
    getOrderDetailsPageJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import { notFound } from 'next/navigation';
import OrderDetails from '@/components/orders/OrderDetails';
import PageHeader from '@/components/page/PageHeader';
import PageLayout from '@/components/page/PageLayout';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
    const { reference } = await params;
    return getOrderDetailsMetadata({ reference });
}

export default async function OrderPage({ params }) {
    try {
        const { reference } = await params;
        if (!reference) notFound();

        const jsonLdGenerators = [
            getOrganizationJsonLd,
            { fn: getOrderDetailsBreadcrumbJsonLd, params: { reference } },
            { fn: getOrderDetailsPageJsonLd, params: { reference } }
        ];

        return (
            <>
                <JsonLdScripts generators={jsonLdGenerators} />
                <PageHeader
                    badge="Order Details"
                    title={`Order #${reference}`}
                    description="View your order details and tracking information"
                    breadcrumbs={[
                        { label: 'My Orders', href: '/account/orders' },
                        { label: `Order #${reference}`, href: `/account/orders/${reference?.toLowerCase()}` },
                    ]}
                    isBackButton={true}
                />
                <PageLayout>
                    <OrderDetails reference={reference} />
                </PageLayout>
            </>
        );
    } catch (error) {
        notFound();
    }
}