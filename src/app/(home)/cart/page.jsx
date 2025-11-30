'use client';

import CartPageDetails from '@/components/cart/CartPageDetails';
import { useCart } from '@/queries/cart.query';

export default function CartPage() {
    const { data: cartData, isLoading, isError } = useCart();

    return (
        <CartPageDetails isError={isError} cartData={cartData} isLoading={isLoading} />
    );
}