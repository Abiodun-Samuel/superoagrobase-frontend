'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Package,
    DollarSign,
    X,
    Eye,
    Truck,
    ChevronDown,
    ChevronUp,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useMyOrders } from '@/queries/orders.query';
import { useCancelOrder } from '@/queries/orders.query';
import Button from '@/components/ui/Button';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import TextBadge from '@/components/ui/TextBadge';
import Modal from '../modal/Modal';
import EmptyState from './EmptyState';
import IconBadge from '../ui/IconBadge';

// ============================================
// Constants
// ============================================
const ORDER_STATUSES = [
    { value: '', text: 'All Statuses' },
    { value: 'pending', text: 'Pending' },
    { value: 'confirmed', text: 'Confirmed' },
    { value: 'processing', text: 'Processing' },
    { value: 'shipped', text: 'Shipped' },
    { value: 'delivered', text: 'Delivered' },
    { value: 'cancelled', text: 'Cancelled' },
];

const PAYMENT_STATUSES = [
    { value: '', text: 'All Payments' },
    { value: 'pending', text: 'Pending' },
    { value: 'paid', text: 'Paid' },
    { value: 'failed', text: 'Failed' },
];

const INITIAL_FILTERS = {
    status: '',
    payment_status: '',
};

// ============================================
// Skeleton Loader Component
// ============================================
const OrderListSkeleton = memo(() => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">{''}</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Order Reference
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Order Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Payment Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Delivery
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="animate-pulse border-b border-gray-200 dark:border-gray-700">
                                {/* Expand Button */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </td>

                                {/* Order Reference */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                        <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-24"></div>
                                    </div>
                                </td>

                                {/* Customer */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                                        <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-44"></div>
                                    </div>
                                </td>

                                {/* Items */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex justify-center">
                                        <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-16 px-2.5 py-1"></div>
                                    </div>
                                </td>

                                {/* Order Status */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                                </td>

                                {/* Payment Status */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                                </td>

                                {/* Delivery */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    </div>
                                </td>

                                {/* Total */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex justify-end">
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

OrderListSkeleton.displayName = 'OrderListSkeleton';

// ============================================
// Filters Component
// ============================================
const OrderFilters = memo(({ filters, onFilterChange, onReset }) => {
    const { register, watch, setValue, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: filters
    });

    const statusValue = watch('status');
    const paymentStatusValue = watch('payment_status');

    // Handle individual filter changes
    React.useEffect(() => {
        if (statusValue !== filters.status) {
            onFilterChange({ status: statusValue });
        }
    }, [statusValue]);

    React.useEffect(() => {
        if (paymentStatusValue !== filters.payment_status) {
            onFilterChange({ payment_status: paymentStatusValue });
        }
    }, [paymentStatusValue]);

    const handleReset = useCallback(() => {
        reset(INITIAL_FILTERS);
        onReset();
    }, [reset, onReset]);

    const hasActiveFilters = useMemo(() => {
        return statusValue || paymentStatusValue;
    }, [statusValue, paymentStatusValue]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (statusValue) count++;
        if (paymentStatusValue) count++;
        return count;
    }, [statusValue, paymentStatusValue]);

    return (
        <div className="bg-white dark:bg-gray-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 rounded-lg shadow">
            <div className="flex flex-col gap-3">
                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <div className="w-44">
                            <SingleSelectForm
                                name="status"
                                options={ORDER_STATUSES}
                                register={register}
                                setValue={setValue}
                                placeholder="Order Status"
                                searchable={false}
                                defaultValue={statusValue || ''}
                            />
                        </div>
                    </div>

                    {/* Payment Status Filter */}
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <div className="w-44">
                            <SingleSelectForm
                                name="payment_status"
                                options={PAYMENT_STATUSES}
                                register={register}
                                setValue={setValue}
                                placeholder="Payment Status"
                                searchable={false}
                                defaultValue={paymentStatusValue || ''}
                            />
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            color="gray"
                            size="sm"
                            onClick={handleReset}
                            startIcon={<X className="w-4 h-4" />}
                        >
                            Reset {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});

OrderFilters.displayName = 'OrderFilters';

// ============================================
// Table Row Component
// ============================================
const OrderTableRow = memo(({ order, onCancelClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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

    return (
        <>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700">
                {/* Expand Button */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <button
                        onClick={toggleExpanded}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        aria-label={isExpanded ? 'Collapse order details' : 'Expand order details'}
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                </td>

                {/* Order Reference */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <Link
                            href={`/account/orders/${order?.reference?.toLowerCase()}`}
                            className="text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:underline"
                        >
                            {order.reference}
                        </Link>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {formatDate(order.created_at)}
                        </span>
                    </div>
                </td>

                {/* Customer */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {order.user.full_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {order.user.email}
                        </span>
                    </div>
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
                            href={`/account/orders/${order?.reference?.toLowerCase()}`}
                            color='green'
                            icon={<Eye />}
                        />
                        {order.can_cancel && (
                            <IconBadge
                                onClick={() => onCancelClick(order)}
                                color="red"
                                icon={<X />}
                            />
                        )}
                    </div>
                </td>
            </tr>

            {/* Expanded Details */}
            {isExpanded && (
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <td colSpan="9" className="px-4 py-4">
                        <div className="space-y-4">
                            {/* Progress Bar */}
                            <div>
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
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Order Items
                                </h4>
                                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {order.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.title}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {item.product.title}
                                                            </span>
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
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Order Summary
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Tax ({(order.tax_rate * 100).toFixed(1)}%):</span>
                                        <span className="text-gray-900 dark:text-gray-100">{formatCurrency(order.tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                                        <span className="text-gray-900 dark:text-gray-100">
                                            {order.shipping === '0.00' ? 'Free' : formatCurrency(order.shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-gray-900 dark:text-gray-100">Total:</span>
                                        <span className="text-green-600 dark:text-green-500">{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
});

OrderTableRow.displayName = 'OrderTableRow';

// ============================================
// Main Component
// ============================================
const OrderList = () => {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [cancelOrderModal, setCancelOrderModal] = useState({ isOpen: false, order: null });

    const { data, isLoading, isError, error } = useMyOrders(filters);
    const cancelOrder = useCancelOrder();

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    const handleCancelClick = useCallback((order) => {
        setCancelOrderModal({ isOpen: true, order });
    }, []);

    const handleCloseCancelModal = useCallback(() => {
        setCancelOrderModal({ isOpen: false, order: null });
    }, []);

    const handleCancelOrder = useCallback(() => {
        if (!cancelOrderModal.order) return;

        cancelOrder.mutate(cancelOrderModal.order.reference, {
            onSuccess: () => {
                setCancelOrderModal({ isOpen: false, order: null });
            },
        });
    }, [cancelOrderModal.order, cancelOrder]);

    const orders = useMemo(() => data || [], [data]);

    const hasActiveFilters = useMemo(() => {
        return (
            filters.status !== INITIAL_FILTERS.status ||
            filters.payment_status !== INITIAL_FILTERS.payment_status
        );
    }, [filters]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 space-y-10 my-10">
            {/* Filters */}
            <OrderFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <OrderListSkeleton />
                ) : isError ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
                        <div className="flex flex-col items-center justify-center py-24 px-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full blur-2xl opacity-50" />
                                <div className="relative p-6 bg-gradient-to-br from-red-50 to-red-50 dark:from-gray-800 dark:to-gray-800 rounded-full border-4 border-white dark:border-gray-700 shadow-xl">
                                    <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
                                Failed to Load Orders
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md leading-relaxed">
                                {error?.response?.data?.message || 'Something went wrong. Please try again later.'}
                            </p>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <EmptyState
                        hasFilters={hasActiveFilters}
                        onClearFilters={handleResetFilters}
                    />
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">{''}
                                            {/* Expand column */}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Order Reference
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Order Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Payment Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Delivery
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {orders.map((order) => (
                                        <OrderTableRow
                                            key={order.id}
                                            order={order}
                                            onCancelClick={handleCancelClick}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            <Modal
                isOpen={cancelOrderModal.isOpen}
                onClose={handleCloseCancelModal}
                title="Cancel Order"
            >
                <div className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            Are you sure you want to cancel order{' '}
                            <strong>{cancelOrderModal.order?.reference}</strong>?
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            color="gray"
                            variant="outline"
                            onClick={handleCloseCancelModal}
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
                            Cancel Order
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderList;