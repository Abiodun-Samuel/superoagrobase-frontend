'uce client'

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Button from "../ui/Button";
import useAuth from "@/hooks/useAuth";

const OrderSummary = ({ cartSummary, sessionId }) => {
    const { user } = useAuth()

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartSummary?.item_count} items)</span>
                    <span className="font-medium">₦{cartSummary?.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>VAT ({cartSummary?.tax_rate * 100}%)</span>
                    <span className="font-medium">₦{cartSummary?.tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>₦{cartSummary?.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-5">
                <Button startIcon={<ShoppingBag />} className="w-full" href={`/checkout?sessionId=${sessionId}&user_id=${user?.id}`} >
                    Proceed to Checkout
                </Button>

                <Button startIcon={<ArrowLeft />} className="w-full" href={'/products'} variant="outline" color="gray">
                    Continue Shopping
                </Button>
            </div>
        </div>
    );
};
export default OrderSummary