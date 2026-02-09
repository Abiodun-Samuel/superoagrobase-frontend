import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getPaymentVerifyMetadata } from '@/utils/seo/seo.meta';
import {
    getPaymentVerifyBreadcrumbJsonLd,
    getPaymentVerifyPageJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import PaymentVerify from '@/components/payment/PaymentVerify';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';
import { notFound } from 'next/navigation';

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const reference = params?.reference;

    return getPaymentVerifyMetadata({ reference });
}

export default async function PaymentVerifyPage({ searchParams }) {
    try {
        const params = await searchParams;
        const { reference } = params;

        if (!reference) notFound();

        const jsonLdGenerators = [
            getOrganizationJsonLd,
            getPaymentVerifyBreadcrumbJsonLd,
            { fn: getPaymentVerifyPageJsonLd, params: { reference } }
        ];

        return (
            <>
                <JsonLdScripts generators={jsonLdGenerators} />
                <PageHeader
                    title="Payment Verification"
                    description="Verifying your payment transaction"
                    badge="Processing Payment"
                    breadcrumbs={[
                        { label: 'Shopping Cart', href: '/cart' },
                        { label: 'Checkout', href: '/checkout' },
                        { label: 'Payment Verification', href: `/checkout/verify?reference=${reference}` },
                    ]}
                    isBackButton={false}
                />
                <PageLayout>
                    <PaymentVerify reference={reference} />
                </PageLayout>
            </>
        );
    } catch (error) {
        notFound();
    }
}