'use client'

import { useCart } from "@/queries/cart.query";
import CartItemCard from "./CartItemCard";
import OrderSummary from "./OrderSummary";
import { CartPageSkeleton } from "../skeletonloader";
import EmptyState from "../common/EmptyState";
import Alert from "../common/Alert";
import Button from "../ui/Button";
import IconBadge from "../ui/IconBadge";
import { Home, ShoppingBag, ShoppingCart } from "lucide-react";

const CartDetailsPage = () => {
    const { data: cartData, isLoading, isError, error } = useCart();

    const hasItems = cartData?.items && cartData.items.length > 0;
    const itemCount = cartData?.items?.length || 0;

    const getHeaderInfo = () => {
        if (isLoading) return { title: "Loading Cart", description: "Please wait while we fetch your items..." };
        if (isError) return { title: "Cart Error", description: "Unable to load your cart. Please try again." };
        if (!hasItems) return null;
        return {
            title: "Cart Details",
            description: `You have ${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for checkout`,
            itemCount
        };
    };

    const headerInfo = getHeaderInfo();

    const renderContent = () => {
        if (isLoading) {
            return <CartPageSkeleton />;
        }

        if (isError) {
            return (
                <Alert
                    error={error}
                    actionButton={
                        <Button href={'/'} startIcon={<Home />}>
                            Home
                        </Button>
                    }
                />
            );
        }

        if (!hasItems) {
            return (
                <EmptyState
                    iconBadge={
                        <IconBadge
                            color={'red'}
                            size={'2xl'}
                            shape={'circle'}
                            icon={<ShoppingCart />}
                        />
                    }
                    title="Your cart is empty"
                    description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
                    iconColor="red"
                    actionButton={
                        <Button href={'/products'} startIcon={<ShoppingBag />}>
                            Start Shopping
                        </Button>
                    }
                />
            );
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
                        <OrderSummary
                            cartSummary={cartData?.summary}
                            sessionId={cartData?.session_id}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10 my-10">
            {headerInfo && (
                <div className="shadow border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {headerInfo.title}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    {headerInfo.description}
                                </p>
                            </div>
                            {headerInfo.itemCount && (
                                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                    <ShoppingCart className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-semibold text-green-700">
                                        {headerInfo.itemCount} {headerInfo.itemCount === 1 ? 'Item' : 'Items'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {renderContent()}
        </div>
    );
};

export default CartDetailsPage;