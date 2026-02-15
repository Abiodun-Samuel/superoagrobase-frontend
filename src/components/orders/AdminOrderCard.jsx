'use client';

import React, { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import {
    Eye,
    Edit,
    ChevronDown,
    ChevronUp,
    Truck,
    MoreVertical,
} from 'lucide-react';
import { useUpdateOrderStatus } from '@/queries/orders.query';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';

const AdminOrderCard = memo(({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const updateStatus = useUpdateOrderStatus();

    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    }, []);

    const formatDate = useCallback((date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }, []);

    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const handleQuickStatusUpdate = useCallback((status) => {
        updateStatus.mutate({
            reference: order.reference,
            status,
        });
        setShowActions(false);
    }, [order.reference, updateStatus]);

    return (
        <>

            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                {/* Order Reference with Expand Button */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <button
                        onClick={toggleExpanded}
                        className="flex items-center gap-2 group"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors flex-shrink-0" />
                        )}
                        <div className="flex flex-col text-left">
                            <Link
                                href={`/dashboard/orders/${order?.reference?.toLowerCase()}`}
                                className="text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:underline"
                            >
                                {order.reference}
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {formatDate(order.created_at)}
                            </span>
                        </div>
                    </button>
                </td>

                {/* Customer */}
                <td className="px-4 py-4 whitespace-nowrap">
                    {order.user && (
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {order.user.full_name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {order.user.email}
                            </span>
                        </div>
                    )}
                </td>

                {/* Items */}
                <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                    </span>
                </td>

                {/* Order Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <TextBadge
                        variant="solid"
                        color={order.status_color}
                        size="sm"
                    >
                        {order.status_label}
                    </TextBadge>
                </td>

                {/* Payment Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <TextBadge
                        variant="solid"
                        color={order.payment_status_color}
                        size="sm"
                    >
                        {order.payment_status_label}
                    </TextBadge>
                </td>

                {/* Delivery Method */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            {order.delivery_method_label}
                        </span>
                    </div>
                </td>

                {/* Total */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(order.total)}
                    </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <IconBadge
                            href={`/dashboard/orders/${order?.reference?.toLowerCase()}`}
                            color='green'
                            icon={<Eye />}
                        />

                        {/* Quick Actions Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </button>

                            {showActions && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowActions(false)}
                                    />
                                    <div className="absolute flex flex-col right-5 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                                        <button
                                            onClick={() => handleQuickStatusUpdate('confirmed')}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg text-gray-900 dark:text-gray-100"
                                        >
                                            Mark as Confirmed
                                        </button>
                                        <button
                                            onClick={() => handleQuickStatusUpdate('processing')}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            Mark as Processing
                                        </button>
                                        <button
                                            onClick={() => handleQuickStatusUpdate('shipped')}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            Mark as Shipped
                                        </button>
                                        <button
                                            onClick={() => handleQuickStatusUpdate('delivered')}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 last:rounded-b-lg text-gray-900 dark:text-gray-100"
                                        >
                                            Mark as Delivered
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </td>
            </tr>

            {/* Expanded Details Row */}
            {isExpanded && (
                <tr className="bg-gray-50 dark:bg-gray-800">
                    <td colSpan="8" className="px-0 py-0">
                        <table className="min-w-full">
                            <tbody>
                                {/* Progress Bar Row */}
                                <tr>
                                    <td colSpan="8" className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                Order Progress
                                            </span>
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {order.progress_percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${order.progress_percentage}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>

                                {/* Order Items Section */}
                                {order.items && order.items.length > 0 && (
                                    <>
                                        <tr>
                                            <td colSpan="8" className="px-4 pt-4 pb-2">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    Order Items
                                                </h4>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="8" className="px-4 pb-4">
                                                <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                Product
                                                            </th>
                                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                Pack Size
                                                            </th>
                                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                Quantity
                                                            </th>
                                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                Price
                                                            </th>
                                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                Subtotal
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                        {order.items.map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <img
                                                                            src={item.product.image}
                                                                            alt={item.product.title}
                                                                            className="w-12 h-12 rounded-lg object-cover"
                                                                        />
                                                                        <Link target='_blank' href={`/dashboard/products/${item?.product?.slug}`} className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                            {item.product.title}
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                                                                    {item.product.pack_size}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                                                                    {item.quantity}
                                                                </td>
                                                                <td className="px-4 py-3 text-right text-sm text-gray-700 dark:text-gray-300">
                                                                    {formatCurrency(item.price_at_purchase)}
                                                                </td>
                                                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {formatCurrency(item.subtotal)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </>
                                )}

                                {/* Order Summary Section */}
                                <tr>
                                    <td colSpan="8" className="px-4 pb-4">
                                        <table className="min-w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <thead>
                                                <tr>
                                                    <th colSpan="2" className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                                                        Order Summary
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                <tr>
                                                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                        Subtotal:
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(order.subtotal)}
                                                    </td>
                                                </tr>
                                                {order.tax_rate && (
                                                    <tr>
                                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                            Tax ({(order.tax_rate * 100).toFixed(1)}%):
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">
                                                            {formatCurrency(order.tax)}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                                        Shipping:
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-gray-100">
                                                        {order.shipping === '0.00' || order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}
                                                    </td>
                                                </tr>
                                                <tr className="bg-gray-50 dark:bg-gray-800">
                                                    <td className="px-4 py-3 text-base font-bold text-gray-900 dark:text-gray-100">
                                                        Total:
                                                    </td>
                                                    <td className="px-4 py-3 text-base font-bold text-right text-green-600 dark:text-green-500">
                                                        {formatCurrency(order.total)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            )}
        </>
    );
});

AdminOrderCard.displayName = 'AdminOrderCard';

export default AdminOrderCard;