// src/components/admin/orders/AdminOrderList.jsx

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAllOrders, useBulkUpdateStatus } from '@/hooks/useOrders';
import {
    Search,
    Filter,
    Calendar,
    Download,
    ChevronDown,
    CheckSquare,
    Square
} from 'lucide-react';
import AdminOrderCard from './AdminOrderCard';
import OrderListSkeleton from '@/components/orders/OrderListSkeleton';
import EmptyState from '@/components/orders/EmptyState';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import { debounce } from '@/utils/helpers';

const ORDER_STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_STATUSES = [
    { value: '', label: 'All Payments' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
];

const BULK_ACTIONS = [
    { value: 'confirmed', label: 'Mark as Confirmed' },
    { value: 'processing', label: 'Mark as Processing' },
    { value: 'shipped', label: 'Mark as Shipped' },
    { value: 'delivered', label: 'Mark as Delivered' },
    { value: 'cancelled', label: 'Mark as Cancelled' },
];

const AdminOrderList = () => {
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        payment_status: '',
        from_date: '',
        to_date: '',
        sort_by: 'created_at',
        sort_direction: 'desc',
    });

    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkAction, setBulkAction] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const { data, isLoading, isError } = useAllOrders(filters);
    const bulkUpdate = useBulkUpdateStatus();

    const orders = data?.data || [];

    // Debounced search
    const debouncedSearch = useMemo(
        () => debounce((value) => {
            setFilters((prev) => ({ ...prev, search: value }));
        }, 500),
        []
    );

    const handleSearchChange = useCallback((e) => {
        debouncedSearch(e.target.value);
    }, [debouncedSearch]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    // Selection handlers
    const toggleSelectAll = useCallback(() => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map((order) => order.reference));
        }
    }, [orders, selectedOrders]);

    const toggleSelectOrder = useCallback((reference) => {
        setSelectedOrders((prev) =>
            prev.includes(reference)
                ? prev.filter((ref) => ref !== reference)
                : [...prev, reference]
        );
    }, []);

    // Bulk action handler
    const handleBulkAction = useCallback(() => {
        if (!bulkAction || selectedOrders.length === 0) return;

        bulkUpdate.mutate(
            {
                references: selectedOrders,
                status: bulkAction,
            },
            {
                onSuccess: () => {
                    setSelectedOrders([]);
                    setBulkAction('');
                },
            }
        );
    }, [bulkAction, selectedOrders, bulkUpdate]);

    const clearFilters = useCallback(() => {
        setFilters({
            search: '',
            status: '',
            payment_status: '',
            from_date: '',
            to_date: '',
            sort_by: 'created_at',
            sort_direction: 'desc',
        });
    }, []);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.status) count++;
        if (filters.payment_status) count++;
        if (filters.from_date || filters.to_date) count++;
        return count;
    }, [filters]);

    const isAllSelected = orders.length > 0 && selectedOrders.length === orders.length;
    const isSomeSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Management</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage and track all customer orders
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                color="green"
                                variant="outline"
                                startIcon={<Download className="w-4 h-4" />}
                            >
                                Export
                            </Button>
                            <Button
                                color="green"
                                startIcon={<Filter className="w-4 h-4" />}
                                onClick={() => setShowFilters(!showFilters)}
                                className="sm:hidden"
                            >
                                Filters
                                {activeFiltersCount > 0 && (
                                    <TextBadge variant="solid" color="white" size="xs" className="ml-2">
                                        {activeFiltersCount}
                                    </TextBadge>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by order reference, customer name, email..."
                                onChange={handleSearchChange}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={`mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {ORDER_STATUSES.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.payment_status}
                            onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {PAYMENT_STATUSES.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={filters.from_date}
                            onChange={(e) => handleFilterChange('from_date', e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Bulk Actions */}
                    {selectedOrders.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <p className="text-sm font-medium text-green-900">
                                    {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                                </p>
                                <div className="flex gap-3 flex-1">
                                    <select
                                        value={bulkAction}
                                        onChange={(e) => setBulkAction(e.target.value)}
                                        className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Select Action</option>
                                        {BULK_ACTIONS.map((action) => (
                                            <option key={action.value} value={action.value}>
                                                {action.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        color="green"
                                        onClick={handleBulkAction}
                                        disabled={!bulkAction}
                                        loading={bulkUpdate.isPending}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        color="gray"
                                        variant="outline"
                                        onClick={() => setSelectedOrders([])}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <OrderListSkeleton />
                ) : isError ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-800 font-medium">Failed to load orders</p>
                    </div>
                ) : orders.length === 0 ? (
                    <EmptyState hasFilters={activeFiltersCount > 0} onClearFilters={clearFilters} />
                ) : (
                    <>
                        {/* Select All */}
                        <div className="mb-4 flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={toggleSelectAll}
                                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                {isAllSelected ? (
                                    <CheckSquare className="w-5 h-5 text-green-600" />
                                ) : isSomeSelected ? (
                                    <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                                        <div className="w-2 h-0.5 bg-white" />
                                    </div>
                                ) : (
                                    <Square className="w-5 h-5 text-gray-400" />
                                )}
                                Select All
                            </button>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <AdminOrderCard
                                    key={order.id}
                                    order={order}
                                    isSelected={selectedOrders.includes(order.reference)}
                                    onToggleSelect={() => toggleSelectOrder(order.reference)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminOrderList;