'uce client'

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Button from "../ui/Button";

const OrderSummary = ({ cartSummary, sessionId }) => {

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

            <div className="space-y-3">
                <Button className="w-full" href={`/checkout?sessionId=${sessionId}`} >
                    <ShoppingBag className="w-5 h-5" />
                    Proceed to Checkout
                </Button>

                <Button className="w-full" href={'/products'} variant="outline" color="gray">
                    <ArrowLeft className="w-5 h-5" />
                    Continue Shopping
                </Button>
            </div>

            {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-medium">Free Delivery</p>
                        <p className="text-blue-700 mt-1">
                            On orders over ₦30,000
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};
export default OrderSummary