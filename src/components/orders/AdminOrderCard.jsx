'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    CheckSquare,
    Square,
    Eye,
    Edit,
    MoreVertical,
    User,
    Package
} from 'lucide-react';
import { useUpdateOrderStatus } from '@/hooks/useOrders';
import TextBadge from '@/components/ui/TextBadge';
import Button from '@/components/ui/Button';

const AdminOrderCard = ({ order, isSelected, onToggleSelect }) => {
    const [showActions, setShowActions] = useState(false);
    const updateStatus = useUpdateOrderStatus();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const handleQuickStatusUpdate = (status) => {
        updateStatus.mutate({
            reference: order.reference,
            status,
        });
        setShowActions(false);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                        onClick={onToggleSelect}
                        className="mt-1 flex-shrink-0"
                    >
                        {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-green-600" />
                        ) : (
                            <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div>
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {order.reference}
                                    </h3>
                                    <TextBadge
                                        variant="solid"
                                        color={order.status_color}
                                        size="sm"
                                    >
                                        {order.status_label}
                                    </TextBadge>
                                    <TextBadge
                                        variant="light"
                                        color={order.payment_status_color}
                                        size="sm"
                                    >
                                        {order.payment_status_label}
                                    </TextBadge>
                                </div>

                                {/* Customer Info */}
                                {order.user && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">{order.user.full_name}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{order.user.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatCurrency(order.total)}
                                </p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-gray-600">Items</p>
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                    <Package className="w-3.5 h-3.5" />
                                    {order.items_count}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Delivery</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {order.delivery_method_label}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Created</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Progress</p>
                                <p className="text-sm font-semibold text-green-600">
                                    {order.progress_percentage}%
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                            <Link href={`/admin/orders/${order.reference}`}>
                                <Button
                                    color="green"
                                    variant="outline"
                                    size="sm"
                                    startIcon={<Eye className="w-4 h-4" />}
                                >
                                    View
                                </Button>
                            </Link>
                            <Link href={`/admin/orders/${order.reference}/edit`}>
                                <Button
                                    color="blue"
                                    variant="outline"
                                    size="sm"
                                    startIcon={<Edit className="w-4 h-4" />}
                                >
                                    Edit
                                </Button>
                            </Link>

                            {/* Quick Actions Dropdown */}
                            <div className="relative">
                                <Button
                                    color="gray"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowActions(!showActions)}
                                    startIcon={<MoreVertical className="w-4 h-4" />}
                                >
                                    Quick Actions
                                </Button>

                                {showActions && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowActions(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                            <button
                                                onClick={() => handleQuickStatusUpdate('confirmed')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
                                            >
                                                Mark as Confirmed
                                            </button>
                                            <button
                                                onClick={() => handleQuickStatusUpdate('processing')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                            >
                                                Mark as Processing
                                            </button>
                                            <button
                                                onClick={() => handleQuickStatusUpdate('shipped')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                            >
                                                Mark as Shipped
                                            </button>
                                            <button
                                                onClick={() => handleQuickStatusUpdate('delivered')}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg"
                                            >
                                                Mark as Delivered
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${order.progress_percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminOrderCard;