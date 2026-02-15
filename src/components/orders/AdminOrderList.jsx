// 'use client';

// import React, { useState, useMemo, useCallback, memo } from 'react';
// import { useAllOrders } from '@/queries/orders.query';
// import { Package, DollarSign, X } from 'lucide-react';
// import AdminOrderCard from './AdminOrderCard';
// import EmptyState from '@/components/orders/EmptyState';
// import Button from '@/components/ui/Button';

// // ============================================
// // Constants - Updated to match backend enums
// // ============================================
// const ORDER_STATUSES = [
//     { value: '', label: 'All Statuses' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'pending_payment', label: 'Awaiting Payment' },
//     { value: 'confirmed', label: 'Confirmed' },
//     { value: 'processing', label: 'Processing' },
//     { value: 'ready_for_pickup', label: 'Ready for Pickup' },
//     { value: 'shipped', label: 'Shipped' },
//     { value: 'out_for_delivery', label: 'Out for Delivery' },
//     { value: 'delivered', label: 'Delivered' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'cancelled', label: 'Cancelled' },
//     { value: 'refunded', label: 'Refunded' },
//     { value: 'failed', label: 'Failed' },
//     { value: 'on_hold', label: 'On Hold' },
//     { value: 'partially_shipped', label: 'Partially Shipped' },
//     { value: 'returned', label: 'Returned' },
//     { value: 'partially_returned', label: 'Partially Returned' },
// ];

// const PAYMENT_STATUSES = [
//     { value: '', label: 'All Payments' },
//     { value: 'pending', label: 'Pending Payment' },
//     { value: 'success', label: 'Success' },
//     { value: 'paid', label: 'Paid' },
//     { value: 'later', label: 'Pay Later' },
//     { value: 'online', label: 'Paid Online' },
//     { value: 'failed', label: 'Failed' },
//     { value: 'refunded', label: 'Refunded' },
//     { value: 'partially_refunded', label: 'Partially Refunded' },
//     { value: 'authorized', label: 'Authorized' },
//     { value: 'captured', label: 'Captured' },
//     { value: 'voided', label: 'Voided' },
//     { value: 'processing', label: 'Processing' },
//     { value: 'declined', label: 'Declined' },
//     { value: 'expired', label: 'Expired' },
//     { value: 'disputed', label: 'Disputed' },
//     { value: 'cancelled', label: 'Cancelled' },
// ];

// const INITIAL_FILTERS = {
//     status: '',
//     payment_status: '',
// };

// // ============================================
// // Skeleton Loader Component
// // ============================================
// const AdminOrderListSkeleton = memo(() => {
//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                     <thead className="bg-gray-50 dark:bg-gray-900">
//                         <tr>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Order Reference
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Customer
//                             </th>
//                             <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Items
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Order Status
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Payment Status
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Delivery
//                             </th>
//                             <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Total
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                 Actions
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                         {[...Array(5)].map((_, index) => (
//                             <tr key={index} className="animate-pulse border-b border-gray-200 dark:border-gray-700">
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="flex flex-col gap-2">
//                                         <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
//                                         <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-24"></div>
//                                     </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="flex flex-col gap-2">
//                                         <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
//                                         <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-44"></div>
//                                     </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="flex justify-center">
//                                         <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-16"></div>
//                                     </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                                         <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
//                                     </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="flex justify-end">
//                                         <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
//                                     </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                                         <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// });

// AdminOrderListSkeleton.displayName = 'AdminOrderListSkeleton';

// // ============================================
// // Filters Component - Refactored without React Hook Form
// // ============================================
// const OrderFilters = memo(({ status, paymentStatus, onStatusChange, onPaymentStatusChange, onReset }) => {
//     const hasActiveFilters = useMemo(() => {
//         return status !== '' || paymentStatus !== '';
//     }, [status, paymentStatus]);

//     const activeFiltersCount = useMemo(() => {
//         let count = 0;
//         if (status) count++;
//         if (paymentStatus) count++;
//         return count;
//     }, [status, paymentStatus]);

//     return (
//         <div className="bg-white dark:bg-gray-800 p-4 sm:px-6 lg:px-8 rounded-lg shadow">
//             <div className="flex flex-wrap items-center gap-3">
//                 {/* Status Filter */}
//                 <div className="flex items-center gap-2">
//                     <Package className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
//                     <select
//                         value={status}
//                         onChange={(e) => onStatusChange(e.target.value)}
//                         className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100 text-sm"
//                     >
//                         {ORDER_STATUSES.map((option) => (
//                             <option key={option.value} value={option.value}>
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Payment Status Filter */}
//                 <div className="flex items-center gap-2">
//                     <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
//                     <select
//                         value={paymentStatus}
//                         onChange={(e) => onPaymentStatusChange(e.target.value)}
//                         className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100 text-sm"
//                     >
//                         {PAYMENT_STATUSES.map((option) => (
//                             <option key={option.value} value={option.value}>
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {hasActiveFilters && (
//                     <Button
//                         variant="outline"
//                         color="gray"
//                         size="sm"
//                         onClick={onReset}
//                         startIcon={<X className="w-4 h-4" />}
//                     >
//                         Reset {activeFiltersCount > 0 && `(${activeFiltersCount})`}
//                     </Button>
//                 )}
//             </div>
//         </div>
//     );
// });

// OrderFilters.displayName = 'OrderFilters';

// // ============================================
// // Main Component
// // ============================================
// const AdminOrderList = ({ params }) => {
//     const [status, setStatus] = useState(params?.status || INITIAL_FILTERS.status);
//     const [paymentStatus, setPaymentStatus] = useState(INITIAL_FILTERS.payment_status);

//     // Build filters object for API
//     const filters = useMemo(() => ({
//         status,
//         payment_status: paymentStatus,
//     }), [status, paymentStatus]);

//     const { data, isLoading, isError } = useAllOrders(filters);

//     const orders = useMemo(() => data?.data || [], [data]);

//     // Simple handlers without flickering
//     const handleStatusChange = useCallback((value) => {
//         setStatus(value);
//     }, []);

//     const handlePaymentStatusChange = useCallback((value) => {
//         setPaymentStatus(value);
//     }, []);

//     const handleResetFilters = useCallback(() => {
//         setStatus(INITIAL_FILTERS.status);
//         setPaymentStatus(INITIAL_FILTERS.payment_status);
//     }, []);

//     const hasActiveFilters = useMemo(() => {
//         return (
//             status !== INITIAL_FILTERS.status ||
//             paymentStatus !== INITIAL_FILTERS.payment_status
//         );
//     }, [status, paymentStatus]);

//     return (
//         <>
//             {/* Filters */}
//             <OrderFilters
//                 status={status}
//                 paymentStatus={paymentStatus}
//                 onStatusChange={handleStatusChange}
//                 onPaymentStatusChange={handlePaymentStatusChange}
//                 onReset={handleResetFilters}
//             />

//             {/* Content */}
//             {isLoading ? (
//                 <AdminOrderListSkeleton />
//             ) : isError ? (
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
//                     <div className="flex flex-col items-center justify-center py-24 px-6">
//                         <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
//                             Failed to Load Orders
//                         </h3>
//                         <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
//                             Something went wrong. Please try again later.
//                         </p>
//                     </div>
//                 </div>
//             ) : orders.length === 0 ? (
//                 <EmptyState
//                     hasFilters={hasActiveFilters}
//                     onClearFilters={handleResetFilters}
//                 />
//             ) : (
//                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                             <thead className="bg-gray-50 dark:bg-gray-900">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Order Reference
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Customer
//                                     </th>
//                                     <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Items
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Order Status
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Payment Status
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Delivery
//                                     </th>
//                                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Total
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 min-h-1/2">
//                                 {orders.map((order) => (
//                                     <AdminOrderCard
//                                         key={order.id}
//                                         order={order}
//                                     />
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default AdminOrderList;

'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { useAllOrders } from '@/queries/orders.query';
import { Package, DollarSign, X } from 'lucide-react';
import AdminOrderCard from './AdminOrderCard';
import EmptyState from '@/components/orders/EmptyState';
import Button from '@/components/ui/Button';
import SingleSelectForm from '@/components/form/SingleSelectForm';

// ============================================
// Constants - Updated to match backend enums
// ============================================
const ORDER_STATUSES = [
    { value: '', text: 'All Statuses' },
    { value: 'pending', text: 'Pending' },
    { value: 'pending_payment', text: 'Awaiting Payment' },
    { value: 'confirmed', text: 'Confirmed' },
    { value: 'processing', text: 'Processing' },
    { value: 'ready_for_pickup', text: 'Ready for Pickup' },
    { value: 'shipped', text: 'Shipped' },
    { value: 'out_for_delivery', text: 'Out for Delivery' },
    { value: 'delivered', text: 'Delivered' },
    { value: 'completed', text: 'Completed' },
    { value: 'cancelled', text: 'Cancelled' },
    { value: 'refunded', text: 'Refunded' },
    { value: 'failed', text: 'Failed' },
    { value: 'on_hold', text: 'On Hold' },
    { value: 'partially_shipped', text: 'Partially Shipped' },
    { value: 'returned', text: 'Returned' },
    { value: 'partially_returned', text: 'Partially Returned' },
];

const PAYMENT_STATUSES = [
    { value: '', text: 'All Payments' },
    { value: 'pending', text: 'Pending Payment' },
    { value: 'success', text: 'Success' },
    { value: 'paid', text: 'Paid' },
    { value: 'later', text: 'Pay Later' },
    { value: 'online', text: 'Paid Online' },
    { value: 'failed', text: 'Failed' },
    { value: 'refunded', text: 'Refunded' },
    { value: 'partially_refunded', text: 'Partially Refunded' },
    { value: 'authorized', text: 'Authorized' },
    { value: 'captured', text: 'Captured' },
    { value: 'voided', text: 'Voided' },
    { value: 'processing', text: 'Processing' },
    { value: 'declined', text: 'Declined' },
    { value: 'expired', text: 'Expired' },
    { value: 'disputed', text: 'Disputed' },
    { value: 'cancelled', text: 'Cancelled' },
];

const INITIAL_FILTERS = {
    status: '',
    payment_status: '',
};

// ============================================
// Skeleton Loader Component
// ============================================
const AdminOrderListSkeleton = memo(() => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
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
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                        <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-24"></div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-2">
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                                        <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-44"></div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex justify-center">
                                        <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-16"></div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex justify-end">
                                        <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    </div>
                                </td>
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

AdminOrderListSkeleton.displayName = 'AdminOrderListSkeleton';

// ============================================
// Filters Component - Using SingleSelectForm
// ============================================
const OrderFilters = memo(({ status, paymentStatus, onStatusChange, onPaymentStatusChange, onReset }) => {
    const hasActiveFilters = useMemo(() => {
        return status !== '' || paymentStatus !== '';
    }, [status, paymentStatus]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (status) count++;
        if (paymentStatus) count++;
        return count;
    }, [status, paymentStatus]);

    // Custom setValue function to handle changes
    const handleStatusSetValue = useCallback((name, value) => {
        onStatusChange(value);
    }, [onStatusChange]);

    const handlePaymentStatusSetValue = useCallback((name, value) => {
        onPaymentStatusChange(value);
    }, [onPaymentStatusChange]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 sm:px-6 lg:px-8 rounded-lg shadow">
            <div className="flex flex-wrap items-end gap-3">
                {/* Status Filter */}
                <div className="flex items-end gap-2 flex-1 min-w-[200px] max-w-[280px]">
                    <div className="flex-shrink-0 pb-2.5">
                        <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                        <SingleSelectForm
                            name="order_status"
                            options={ORDER_STATUSES}
                            placeholder="Select status"
                            searchable={true}
                            defaultValue={status}
                            setValue={handleStatusSetValue}
                            required={false}
                            maxHeight="20rem"
                        />
                    </div>
                </div>

                {/* Payment Status Filter */}
                <div className="flex items-end gap-2 flex-1 min-w-[200px] max-w-[280px]">
                    <div className="flex-shrink-0 pb-2.5">
                        <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                        <SingleSelectForm
                            name="payment_status"
                            options={PAYMENT_STATUSES}
                            placeholder="Select payment status"
                            searchable={true}
                            defaultValue={paymentStatus}
                            setValue={handlePaymentStatusSetValue}
                            required={false}
                            maxHeight="20rem"
                        />
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="pb-0.5">
                        <Button
                            variant="outline"
                            color="gray"
                            size="sm"
                            onClick={onReset}
                            startIcon={<X className="w-4 h-4" />}
                        >
                            Reset {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
});

OrderFilters.displayName = 'OrderFilters';

// ============================================
// Main Component
// ============================================
const AdminOrderList = ({ params }) => {
    const [status, setStatus] = useState(params?.status || INITIAL_FILTERS.status);
    const [paymentStatus, setPaymentStatus] = useState(INITIAL_FILTERS.payment_status);

    // Build filters object for API
    const filters = useMemo(() => ({
        status,
        payment_status: paymentStatus,
    }), [status, paymentStatus]);

    const { data, isLoading, isError } = useAllOrders(filters);

    const orders = useMemo(() => data?.data || [], [data]);

    // Handlers for filter changes
    const handleStatusChange = useCallback((value) => {
        setStatus(value);
    }, []);

    const handlePaymentStatusChange = useCallback((value) => {
        setPaymentStatus(value);
    }, []);

    const handleResetFilters = useCallback(() => {
        setStatus(INITIAL_FILTERS.status);
        setPaymentStatus(INITIAL_FILTERS.payment_status);
    }, []);

    const hasActiveFilters = useMemo(() => {
        return (
            status !== INITIAL_FILTERS.status ||
            paymentStatus !== INITIAL_FILTERS.payment_status
        );
    }, [status, paymentStatus]);

    return (
        <>
            {/* Filters */}
            <OrderFilters
                status={status}
                paymentStatus={paymentStatus}
                onStatusChange={handleStatusChange}
                onPaymentStatusChange={handlePaymentStatusChange}
                onReset={handleResetFilters}
            />

            {/* Content */}
            {isLoading ? (
                <AdminOrderListSkeleton />
            ) : isError ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-700">
                    <div className="flex flex-col items-center justify-center py-24 px-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
                            Failed to Load Orders
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                            Something went wrong. Please try again later.
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
                                    <AdminOrderCard
                                        key={order.id}
                                        order={order}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminOrderList;