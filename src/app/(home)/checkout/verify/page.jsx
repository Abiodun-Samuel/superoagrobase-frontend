import PaymentVerify from "@/components/payment/PaymentVerify";
import { notFound } from "next/navigation";

export default async function PaymentVerifyPage({ searchParams }) {
    try {
        const { reference } = await searchParams;
        if (!reference) notFound();

        return (
            <PaymentVerify reference={reference} />
        );
    } catch (error) {
        notFound();
    }
}
