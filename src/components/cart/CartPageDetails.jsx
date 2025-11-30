import CartItemCard from "./CartItemCard";
import EmptyCart from "./EmptyCart";
import OrderSummary from "./OrderSummary";
import PageHero from "../page/PageHero";
import { CartPageSkeleton } from "../skeletonloader";

const CartPageDetails = ({ cartData, isLoading, isError }) => {
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center bg-white rounded-xl p-8 shadow-sm">
                        <p className="text-red-600 text-lg mb-4">Failed to load your cart</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        if (!hasItems) {
            return <EmptyCart />;
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

export default CartPageDetails;