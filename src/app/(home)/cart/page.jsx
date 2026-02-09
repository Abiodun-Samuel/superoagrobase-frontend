import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getCartMetadata } from '@/utils/seo/seo.meta';
import { getCartBreadcrumbJsonLd, getCartPageJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
import CartDetailsPage from '@/components/cart/CartDetailsPage';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getCartMetadata();

export default function CartPage() {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getCartBreadcrumbJsonLd,
        getCartPageJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Shopping Cart"
                description="Review your selected items and proceed to checkout"
                badge="Your Cart"
                breadcrumbs={[
                    { label: 'Shopping Cart', href: '/cart' },
                ]}
                isBackButton={false}
            />
            <PageLayout>
                <CartDetailsPage />
            </PageLayout>
        </>
    );
}