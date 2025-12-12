import OrderDetailsPage from '@/components/orders/OrderDetailsPage';
import { notFound } from 'next/navigation';

export const revalidate = 3600;
export const dynamicParams = true;

export default async function OrderPage({ params }) {
    try {
        const { reference } = await params;
        if (!reference) notFound();


        return (
            <OrderDetailsPage reference={reference} />
        );
    } catch (error) {
        notFound();
    }
}