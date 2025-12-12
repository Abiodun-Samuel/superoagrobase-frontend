import { formatCurrency } from '@/utils/helper'
import { ChevronLeft, ChevronRight, Package2, ShieldCheck, ShoppingCart } from 'lucide-react'
import Button from '../ui/Button'

// Order Summary Component
const OrderSummary = ({ calculatedValues, items }) => {

    return (
        <div className="bg-white border rounded-xl shadow p-5 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items?.map(item => (
                    <div key={item.id} className="flex gap-3 pb-4 pr-3 border-b border-gray-100 last:border-0">
                        <img
                            src={item?.product?.image}
                            alt={item?.product?.title}
                            className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{item?.product?.title}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{item?.product?.pack_size}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                                <span className="font-semibold text-gray-900 text-sm">
                                    {formatCurrency(item.itemTotal)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-4 border-t-2 border-gray-100">
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculatedValues?.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Tax ({calculatedValues?.tax_rate * 100}%)</span>
                    <span className="font-medium">{formatCurrency(calculatedValues?.tax)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                        {calculatedValues?.shipping === 0 ? '---' : formatCurrency(calculatedValues?.shipping)}
                    </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(calculatedValues?.total)}
                    </span>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Secure checkout with encrypted payment</span>
            </div>

            <div className="mt-6 space-y-3">
                <Button
                    href={'/cart'}
                    className='w-full'
                    color='gray'
                    endIcon={<ShoppingCart />}
                    startIcon={<ChevronLeft />}
                >
                    <span>Back to Cart</span>
                </Button>

                <Button
                    href={'/products'}
                    className='w-full'
                    color='gray'
                    variant='outline'
                    startIcon={<Package2 />}
                    endIcon={<ChevronRight />}
                >
                    <span>Continue Shopping</span>
                </Button>
            </div>
        </div>
    )
}

export default OrderSummary