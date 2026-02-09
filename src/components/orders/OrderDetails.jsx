'use client';

import { useState } from 'react';
import { useMyOrder, useCancelOrder } from '@/queries/orders.query';
import {
    Package,
    MapPin,
    CreditCard,
    Truck,
    Calendar,
    User,
    Mail,
    Phone,
    X,
    Clock,
    CheckCircle2,
    AlertCircle,
    Store,
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import Modal from '../modal/Modal';

const OrderDetails = ({ reference }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { data, isLoading, isError } = useMyOrder(reference);
    const cancelOrder = useCancelOrder();

    const order = data?.data;

    const handleCancelOrder = () => {
        cancelOrder.mutate(reference, {
            onSuccess: () => {
                setShowCancelModal(false);
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return <OrderDetailsSkeleton />;
    }

    if (isError || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl border border-red-100 p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h3>
                    <p className="text-gray-600 mb-6">
                        We couldn't find this order or you don't have permission to view it.
                    </p>
                    <Link href="/orders">
                        <Button color="green" className="w-full">View All Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen my-10 space-y-10">
                {/* Hero Header */}
                <div className="bg-white shadow rounded-lg ">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-green-100">
                                        <Package className="w-7 h-7 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">Order Reference</p>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            {order.reference}
                                        </h1>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700 font-medium">
                                            Placed {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                                        <Package className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700 font-medium">
                                            {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>
                                    <TextBadge variant="solid" color={order.status_color} size="md">
                                        {order.status_label}
                                    </TextBadge>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {/* {order.can_track && (
                                    <Button
                                        color="green"
                                        variant="outline"
                                        startIcon={<Truck className="w-4 h-4" />}
                                        href={`/orders/${order.reference}/track`}
                                    >
                                        Track Order
                                    </Button>
                                )} */}
                                {order.can_cancel && (<>
                                    <TextBadge onClick={() => setShowCancelModal(true)} color="red" startIcon={<X />}>Cancel Order</TextBadge>
                                </>
                                )}
                            </div>
                        </div>

                        {/* Order Progress */}
                        {order.can_cancel && <div className="mt-6 bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">Order Progress</span>
                                </div>
                                <span className="text-lg font-bold text-green-600">
                                    {order.progress_percentage}%
                                </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 transition-all duration-700 ease-out rounded-full shadow-sm"
                                    style={{ width: `${order.progress_percentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                                {order.progress_percentage === 100
                                    ? 'Order completed'
                                    : `${100 - order.progress_percentage}% remaining`}
                            </p>
                        </div>}
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Order Items & Timeline */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status Timeline */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-green-600" />
                                    Order Timeline
                                </h2>
                                <div className="space-y-4">
                                    {/* Order Placed */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.created_at ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                <CheckCircle2 className={`w-5 h-5 ${order.created_at ? 'text-green-600' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                            {(!order.delivered_at && !order.cancelled_at) && (
                                                <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-semibold text-gray-900">Order Placed</p>
                                            <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                                        </div>
                                    </div>

                                    {/* Confirmed */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.confirmed_at ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                <CheckCircle2 className={`w-5 h-5 ${order.confirmed_at ? 'text-green-600' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                            {order.confirmed_at && !order.delivered_at && !order.cancelled_at && (
                                                <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className={`font-semibold ${order.confirmed_at ? 'text-gray-900' : 'text-gray-500'}`}>
                                                Order Confirmed
                                            </p>
                                            {order.confirmed_at && (
                                                <p className="text-sm text-gray-600">{formatDate(order.confirmed_at)}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Paid */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.paid_at ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                <CreditCard className={`w-5 h-5 ${order.paid_at ? 'text-green-600' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                            {order.paid_at && !order.delivered_at && !order.cancelled_at && (
                                                <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className={`font-semibold ${order.paid_at ? 'text-gray-900' : 'text-gray-500'}`}>
                                                Payment {order.is_paid ? 'Completed' : 'Pending'}
                                            </p>
                                            {order.paid_at && (
                                                <p className="text-sm text-gray-600">{formatDate(order.paid_at)}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shipped (only for delivery orders) */}
                                    {order.delivery_method !== 'pickup' && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.shipped_at ? 'bg-green-100' : 'bg-gray-100'
                                                    }`}>
                                                    <Truck className={`w-5 h-5 ${order.shipped_at ? 'text-green-600' : 'text-gray-400'
                                                        }`} />
                                                </div>
                                                {order.shipped_at && !order.delivered_at && !order.cancelled_at && (
                                                    <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className={`font-semibold ${order.shipped_at ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    Order Shipped
                                                </p>
                                                {order.shipped_at && (
                                                    <p className="text-sm text-gray-600">{formatDate(order.shipped_at)}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Delivered/Picked Up */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.delivered_at ? 'bg-green-100' : 'bg-gray-100'
                                                }`}>
                                                <CheckCircle2 className={`w-5 h-5 ${order.delivered_at ? 'text-green-600' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className={`font-semibold ${order.delivered_at ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {order.delivery_method === 'pickup' ? 'Picked Up' : 'Delivered'}
                                            </p>
                                            {order.delivered_at && (
                                                <p className="text-sm text-gray-600">{formatDate(order.delivered_at)}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cancelled */}
                                    {order.cancelled_at && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                                                    <X className="w-5 h-5 text-red-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">Order Cancelled</p>
                                                <p className="text-sm text-gray-600">{formatDate(order.cancelled_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-green-600" />
                                        Order Items ({order.items_count})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="p-6 flex gap-5 hover:bg-gray-50 transition-all duration-200">
                                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                                                <img
                                                    src={item.product.image || '/placeholder.png'}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 mb-1.5 text-lg line-clamp-2">
                                                    {item.product.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                                                        {item.product.pack_size}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        Quantity: <span className="font-semibold text-gray-900">{item.quantity}</span>
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {formatCurrency(item.price_at_purchase)} per unit
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-900 mb-1">
                                                    {formatCurrency(item.subtotal)}
                                                </p>
                                                <p className="text-xs text-gray-500">Total</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Transactions */}
                            {order.transactions && order.transactions.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-green-600" />
                                            Payment History
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {order.transactions.map((transaction) => (
                                            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <TextBadge
                                                                variant="solid"
                                                                color={transaction.status_color}
                                                                size="sm"
                                                            >
                                                                {transaction.status_label}
                                                            </TextBadge>
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {transaction.channel_label}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 font-mono">
                                                            {transaction.reference}
                                                        </p>
                                                    </div>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {transaction.formatted_amount}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {transaction.created_at_human}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                    <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(order.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Tax ({(order.tax_rate * 100).toFixed(1)}%)</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(order.tax)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold text-gray-900">
                                            {order.shipping === "0.00" ? "Free" : formatCurrency(order.shipping)}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t-2 border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-base font-bold text-gray-900">Total Amount</span>
                                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                    Payment Details
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs text-gray-600 font-medium">Payment Status</p>
                                            <TextBadge
                                                variant="solid"
                                                color={order.payment_status_color}
                                                size="sm"
                                            >
                                                {order.payment_status_label}
                                            </TextBadge>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {order.is_paid ? 'Paid in full' : 'Payment pending'}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-600 font-medium mb-2">Payment Method</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {order.payment_method === 'later' ? 'Pay Later' : order.payment_method || 'Not specified'}
                                        </p>
                                    </div>

                                    {order.payment_gateway && (
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-600 font-medium mb-2">Payment Gateway</p>
                                            <p className="text-sm font-semibold text-gray-900 capitalize">
                                                {order.payment_gateway}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    {order.delivery_method === 'pickup' ? (
                                        <Store className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Truck className="w-5 h-5 text-green-600" />
                                    )}
                                    Delivery Details
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                        <p className="text-xs text-green-700 font-medium mb-1">Delivery Method</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            {order.delivery_method_label}
                                        </p>
                                    </div>

                                    {order.delivery_details && (
                                        <>
                                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <IconBadge
                                                    icon={<User className="w-4 h-4" />}
                                                    variant="light"
                                                    color="blue"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-600 mb-1">Customer Name</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {order.delivery_details.first_name} {order.delivery_details.last_name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <IconBadge
                                                    icon={<Mail className="w-4 h-4" />}
                                                    variant="light"
                                                    color="purple"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-600 mb-1">Email Address</p>
                                                    <p className="text-sm font-semibold text-gray-900 break-words">
                                                        {order.delivery_details.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <IconBadge
                                                    icon={<Phone className="w-4 h-4" />}
                                                    variant="light"
                                                    color="orange"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {order.delivery_details.phone_number}
                                                    </p>
                                                </div>
                                            </div>

                                            {order.delivery_details.whatsapp_number && (
                                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <IconBadge
                                                        icon={<Phone className="w-4 h-4" />}
                                                        variant="light"
                                                        color="green"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-600 mb-1">WhatsApp Number</p>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {order.delivery_details.whatsapp_number}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {order.delivery_method !== 'pickup' && order.delivery_address && (
                                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <IconBadge
                                                        icon={<MapPin className="w-4 h-4" />}
                                                        variant="light"
                                                        color="red"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                                                        <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                                                            {order.delivery_address}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {order.notes && (
                                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                            <p className="text-xs text-amber-700 font-medium mb-1">Order Notes</p>
                                            <p className="text-sm text-gray-900">{order.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Order Modal */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Cancel Order?"
            >
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                        <div className="flex gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-amber-900 mb-1">
                                    Are you sure you want to cancel this order?
                                </p>
                                <p className="text-sm text-amber-700">
                                    This action cannot be undone. Your order will be permanently cancelled.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            color="gray"
                            variant="outline"
                            onClick={() => setShowCancelModal(false)}
                            className="flex-1"
                            disabled={cancelOrder.isPending}
                        >
                            Keep Order
                        </Button>
                        <Button
                            color="red"
                            onClick={handleCancelOrder}
                            className="flex-1"
                            loading={cancelOrder.isPending}
                        >
                            {cancelOrder.isPending ? 'Cancelling...' : 'Yes, Cancel Order'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const OrderDetailsSkeleton = () => {
    return (
        <div className="min-h-screen my-10 space-y-10">
            {/* Hero Header Skeleton */}
            <div className="bg-white shadow rounded-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg" />
                                <div className="flex-1">
                                    <div className="h-3.5 w-32 bg-gray-200 rounded mb-2" />
                                    <div className="h-8 w-64 sm:w-80 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="h-9 bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-300 rounded" />
                                    <div className="h-3.5 w-48 bg-gray-300 rounded" />
                                </div>
                                <div className="h-9 bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-300 rounded" />
                                    <div className="h-3.5 w-16 bg-gray-300 rounded" />
                                </div>
                                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex flex-wrap gap-3">
                            <div className="h-10 w-36 bg-gray-200 rounded-lg" />
                            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                        </div>
                    </div>

                    {/* Progress Skeleton */}
                    <div className="mt-6 bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                                <div className="h-3.5 w-28 bg-gray-200 rounded" />
                            </div>
                            <div className="h-5 w-12 bg-gray-200 rounded" />
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-gray-300 rounded-full" />
                        </div>
                        <div className="h-3 w-28 bg-gray-200 rounded mt-2" />
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6 animate-pulse">
                        {/* Timeline Skeleton */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-5 h-5 bg-gray-200 rounded" />
                                <div className="h-5 w-36 bg-gray-200 rounded" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full" />
                                            {i < 5 && <div className="w-0.5 h-12 bg-gray-200 my-1" />}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                                            <div className="h-3.5 w-48 bg-gray-100 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Items Skeleton */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-gray-200 rounded" />
                                    <div className="h-5 w-36 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-6 flex gap-5">
                                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border border-gray-200" />
                                        <div className="flex-1">
                                            <div className="h-5 w-56 bg-gray-200 rounded mb-2" />
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-6 w-16 bg-gray-100 rounded-lg" />
                                                <div className="h-3.5 w-24 bg-gray-100 rounded" />
                                            </div>
                                            <div className="h-3 w-28 bg-gray-100 rounded" />
                                        </div>
                                        <div className="text-right">
                                            <div className="h-6 w-24 bg-gray-200 rounded mb-1" />
                                            <div className="h-3 w-12 bg-gray-100 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6 animate-pulse">
                        {/* Summary Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                <div className="h-5 w-32 bg-gray-200 rounded" />
                            </div>
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="h-3.5 w-20 bg-gray-200 rounded" />
                                        <div className="h-3.5 w-24 bg-gray-200 rounded" />
                                    </div>
                                ))}
                                <div className="pt-4 border-t-2 border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="h-4 w-28 bg-gray-200 rounded" />
                                        <div className="h-7 w-32 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 bg-gray-200 rounded" />
                                <div className="h-5 w-36 bg-gray-200 rounded" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                                        <div className="h-3.5 w-32 bg-gray-200 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 bg-gray-200 rounded" />
                                <div className="h-5 w-32 bg-gray-200 rounded" />
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                    <div className="h-3 w-28 bg-gray-200 rounded mb-1" />
                                    <div className="h-3.5 w-24 bg-gray-200 rounded" />
                                </div>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
                                            <div className="h-3.5 w-40 bg-gray-200 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;