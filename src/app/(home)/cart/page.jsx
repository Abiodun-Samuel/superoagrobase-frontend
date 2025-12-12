import { getCartMetadata } from '@/utils/seo/seo.meta';
import { getCartBreadcrumbJsonLd, getCartPageJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
import CartDetailsPage from '@/components/cart/CartDetailsPage';
import JsonLdScripts from '@/components/provider/JsonLdScripts';

export async function generateMetadata() { return getCartMetadata(); }

export default function CartPage() {
    const jsonLdGenerators = [getCartBreadcrumbJsonLd, getCartPageJsonLd, getOrganizationJsonLd];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <CartDetailsPage />
        </>
    );
}