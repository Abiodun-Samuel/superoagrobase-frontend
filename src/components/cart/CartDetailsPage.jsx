'use client'

import CartItemCard from "./CartItemCard";
import OrderSummary from "./OrderSummary";
import PageHero from "../page/PageLayout";
import { CartPageSkeleton } from "../skeletonloader";
import { useCart } from "@/queries/cart.query";
import EmptyState from "../common/EmptyState";
import { Home, ShoppingBag, ShoppingCart } from "lucide-react";
import Alert from "../common/Alert";
import Button from "../ui/Button";
import IconBadge from "../ui/IconBadge";

const CartDetailsPage = () => {
    const { data: cartData, isLoading, isError, error } = useCart();

    const hasItems = cartData?.items && cartData.items.length > 0;
    const itemCount = cartData?.items?.length || 0;

    const getHeroDescription = () => {
        if (isLoading) return "Loading your cart...";
        if (isError) return "Something went wrong";
        if (!hasItems) return "Your cart is currently empty";
        return `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`;
    };

    const renderContent = () => {
        if (isLoading) {
            return <CartPageSkeleton />;
        }

        if (isError) {
            return (
                <Alert error={error} actionButton={<Button href={'/'} startIcon={<Home />}>
                    Home
                </Button>} />
            );
        }

        if (!hasItems) {
            return <EmptyState
                iconBadge={<IconBadge
                    color={'red'}
                    size={'2xl'}
                    shape={'circle'}
                    icon={<ShoppingCart />}
                />}
                title="Your cart is empty"
                description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
                iconColor="red"
                actionButton={<Button href={'/products'} startIcon={<ShoppingBag />}>
                    Start Shopping
                </Button>}
            />;
        }

        return (
            <div className="my-10">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartData.items.map((item) => (
                            <CartItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary cartSummary={cartData?.summary} sessionId={cartData?.session_id} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <PageHero
                title="Shopping Cart"
                description={getHeroDescription()}
                badge="Shop"
                breadcrumbs={[{ label: 'Cart', href: '/cart' }]}
            />
            {renderContent()}
        </>
    );
};

export default CartDetailsPage;