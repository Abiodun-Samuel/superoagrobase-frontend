import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getCheckoutMetadata } from '@/utils/seo/seo.meta';
import {
    getCheckoutBreadcrumbJsonLd,
    getCheckoutPageJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import CheckoutDetailsPage from '@/components/checkout/CheckoutDetailsPage';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const metadata = getCheckoutMetadata();

const CheckoutPage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getCheckoutBreadcrumbJsonLd,
        getCheckoutPageJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Checkout"
                description="Complete your order and choose your delivery options"
                badge="Secure Checkout"
                breadcrumbs={[
                    { label: 'Shopping Cart', href: '/cart' },
                    { label: 'Checkout', href: '/checkout' },
                ]}
                isBackButton={true}
                backLabel="Back to Cart"
            />
            <PageLayout>
                <CheckoutDetailsPage />
            </PageLayout>
        </>
    );
};

export default CheckoutPage;