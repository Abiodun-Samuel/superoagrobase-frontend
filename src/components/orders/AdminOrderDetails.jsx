'use client';

import { useOrder, useUpdateOrder } from '@/queries/orders.query';
import {
    Package,
    MapPin,
    CreditCard,
    Truck,
    User,
    Mail,
    Phone,
    X,
    Clock,
    CheckCircle2,
    AlertCircle,
    Store,
    Edit,
    Save,
    MessageCircle,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import Modal from '../modal/Modal';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import InputForm from '@/components/form/InputForm';
import { useForm } from 'react-hook-form';
import { useModal } from '@/hooks/useModal';

// Status options based on your enums
const ORDER_STATUS_OPTIONS = [
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

const PAYMENT_STATUS_OPTIONS = [
    { value: 'pending', text: 'Pending Payment' },
    { value: 'paid', text: 'Paid' },
    { value: 'success', text: 'Success' },
    { value: 'online', text: 'Paid Online' },
    { value: 'later', text: 'Pay Later' },
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


const AdminOrderDetails = ({ reference }) => {
    const router = useRouter();
    const { isOpen: isStatusModalOpen, openModal: openStatusModal, closeModal: closeStatusModal } = useModal(false);
    const { isOpen: isTimestampsModalOpen, openModal: openTimestampsModal, closeModal: closeTimestampsModal } = useModal(false);

    const { data, isLoading, isError } = useOrder(reference);
    const updateOrder = useUpdateOrder();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm();

    const order = data?.data;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleOpenStatusModal = () => {
        setValue('status', order.status);
        setValue('payment_status', order.payment_status);
        openStatusModal();
    };

    const handleOpenTimestampsModal = () => {
        setValue('confirmed_at', order.confirmed_at?.split('T')[0]);
        setValue('paid_at', order.paid_at?.split('T')[0]);
        setValue('shipped_at', order.shipped_at?.split('T')[0]);
        setValue('delivered_at', order.delivered_at?.split('T')[0]);
        openTimestampsModal();
    };

    const onSubmit = (formData) => {
        updateOrder.mutate(
            { reference, data: formData },
            {
                onSuccess: () => {
                    closeStatusModal();
                    closeTimestampsModal();
                    reset();
                },
            }
        );
    };

    if (isLoading) {
        return <OrderDetailsSkeleton />;
    }

    if (isError || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 sm:p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Order Not Found</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                        We couldn't find this order.
                    </p>
                    <Link href="/dashboard/orders">
                        <Button color="green" className="w-full">View All Orders</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Professional Header - White Background */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4 sm:mb-6">
                {/* Header Content */}
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Back Button Row */}
                    <div className="mb-4 sm:mb-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Orders</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                        {/* Left Section - Order Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-green-100 shadow-sm flex-shrink-0">
                                    <Package className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Order Reference
                                        </span>
                                        <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300" />
                                        <span className="text-xs text-gray-500">
                                            {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight break-all sm:break-normal">
                                        {order.reference}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                                            <Package className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-600 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                                            </span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Action Button */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 w-full sm:w-auto">
                            <Button
                                color="green"
                                variant="solid"
                                onClick={handleOpenStatusModal}
                                className="shadow-sm hover:shadow-md transition-all w-full sm:w-auto justify-center"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Update Status
                            </Button>
                        </div>
                    </div>

                    {/* Status Badges Section */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {/* Order Status */}
                            <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Order Status
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                                </div>
                                <TextBadge variant="solid" color={order.status_color} size="md">
                                    {order.status_label}
                                </TextBadge>
                            </div>

                            {/* Payment Status */}
                            <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Payment Status
                                    </span>
                                    <CreditCard className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                </div>
                                <TextBadge variant="solid" color={order.payment_status_color} size="md">
                                    {order.payment_status_label}
                                </TextBadge>
                            </div>

                            {/* Progress */}
                            <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Progress
                                    </span>
                                    <span className="text-base sm:text-lg font-bold text-green-600 flex-shrink-0">
                                        {order.progress_percentage}%
                                    </span>
                                </div>
                                <div className="relative w-full h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-sm"
                                        style={{ width: `${order.progress_percentage}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Customer & Order Items */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                </div>
                                <span className="text-sm sm:text-base lg:text-lg">Customer Information</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <IconBadge
                                        icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                        variant="light"
                                        color="blue"
                                        size="md"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {order.user.full_name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <IconBadge
                                        icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                        variant="light"
                                        color="purple"
                                        size="md"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <a
                                            href={`mailto:${order.user.email}`}
                                            className="text-sm font-semibold text-purple-600 hover:text-purple-700 truncate block"
                                        >
                                            {order.user.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 sm:col-span-2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <IconBadge
                                        icon={<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                        variant="light"
                                        color="orange"
                                        size="md"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                        <a
                                            href={`tel:${order.user.phone_number}`}
                                            className="text-sm font-semibold text-orange-600 hover:text-orange-700 truncate block"
                                        >
                                            {order.user.phone_number}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Status Timeline */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <span className="text-sm sm:text-base lg:text-lg">Order Timeline</span>
                            </h2>
                            {!order?.can_cancel && <IconBadge
                                className="flex-shrink-0"
                                onClick={handleOpenTimestampsModal}
                                icon={<Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                variant="light"
                                color="gray"
                                size="md"
                            />}
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {/* Order Placed */}
                            <div className="flex gap-3 sm:gap-4">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-green-100">
                                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                    </div>
                                    {(!order.delivered_at && !order.cancelled_at) && (
                                        <div className="w-0.5 h-10 sm:h-12 bg-gray-200 my-1" />
                                    )}
                                </div>
                                <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                                    <p className="font-semibold text-sm sm:text-base text-gray-900">Order Placed</p>
                                    <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(order.created_at)}</p>
                                </div>
                            </div>

                            {/* Confirmed */}
                            <div className="flex gap-3 sm:gap-4">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${order.confirmed_at ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${order.confirmed_at ? 'text-green-600' : 'text-gray-400'
                                            }`} />
                                    </div>
                                    {order.confirmed_at && !order.delivered_at && !order.cancelled_at && (
                                        <div className="w-0.5 h-10 sm:h-12 bg-gray-200 my-1" />
                                    )}
                                </div>
                                <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                                    <p className={`font-semibold text-sm sm:text-base ${order.confirmed_at ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        Order Confirmed
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(order.confirmed_at)}</p>
                                </div>
                            </div>

                            {/* Paid */}
                            <div className="flex gap-3 sm:gap-4">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${order.paid_at ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        <CreditCard className={`w-4 h-4 sm:w-5 sm:h-5 ${order.paid_at ? 'text-green-600' : 'text-gray-400'
                                            }`} />
                                    </div>
                                    {order.paid_at && !order.delivered_at && !order.cancelled_at && (
                                        <div className="w-0.5 h-10 sm:h-12 bg-gray-200 my-1" />
                                    )}
                                </div>
                                <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                                    <p className={`font-semibold text-sm sm:text-base ${order.paid_at ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        Payment {order.is_paid ? 'Completed' : 'Pending'}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(order.paid_at)}</p>
                                </div>
                            </div>

                            {/* Shipped */}
                            {order.delivery_method !== 'pickup' && (
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="flex flex-col items-center flex-shrink-0">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${order.shipped_at ? 'bg-green-100' : 'bg-gray-100'
                                            }`}>
                                            <Truck className={`w-4 h-4 sm:w-5 sm:h-5 ${order.shipped_at ? 'text-green-600' : 'text-gray-400'
                                                }`} />
                                        </div>
                                        {order.shipped_at && !order.delivered_at && !order.cancelled_at && (
                                            <div className="w-0.5 h-10 sm:h-12 bg-gray-200 my-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                                        <p className={`font-semibold text-sm sm:text-base ${order.shipped_at ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            Order Shipped
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(order.shipped_at)}</p>
                                    </div>
                                </div>
                            )}

                            {/* Delivered */}
                            <div className="flex gap-3 sm:gap-4">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${order.delivered_at ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                        <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${order.delivered_at ? 'text-green-600' : 'text-gray-400'
                                            }`} />
                                    </div>
                                </div>
                                <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                                    <p className={`font-semibold text-sm sm:text-base ${order.delivered_at ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {order.delivery_method === 'pickup' ? 'Picked Up' : 'Delivered'}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(order.delivered_at)}</p>
                                </div>
                            </div>

                            {/* Cancelled */}
                            {order.cancelled_at && (
                                <div className="flex gap-3 sm:gap-4">
                                    <div className="flex flex-col items-center flex-shrink-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-red-100">
                                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm sm:text-base text-gray-900">Order Cancelled</p>
                                        <p className="text-xs sm:text-sm text-gray-600 break-words">{formatDate(order.cancelled_at)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <span className="text-sm sm:text-base lg:text-lg">Order Items ({order.items_count})</span>
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 hover:bg-gray-50 transition-colors">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm mx-auto sm:mx-0">
                                        <img
                                            src={item.product.image || '/placeholder.png'}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <Link target='_blank' href={`/dashboard/products/${item?.product?.slug}`} className="font-bold text-gray-900 mb-1.5 text-sm sm:text-base lg:text-lg line-clamp-2">
                                            {item.product.title}
                                        </Link>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                                                {item.product.pack_size}
                                            </span>
                                            <span className="text-xs sm:text-sm text-gray-600">
                                                Qty: <span className="font-semibold text-gray-900">{item.quantity}</span>
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {formatCurrency(item.price_at_purchase)} per unit
                                        </p>
                                    </div>
                                    <div className="text-center sm:text-right flex-shrink-0">
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
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
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm sm:text-base lg:text-lg">Payment History</span>
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.transactions.map((transaction) => (
                                    <div key={transaction.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <TextBadge
                                                        variant="solid"
                                                        color={transaction.status_color}
                                                        size="sm"
                                                    >
                                                        {transaction.status_label}
                                                    </TextBadge>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                        {transaction.channel_label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-mono break-all">
                                                    {transaction.reference}
                                                </p>
                                            </div>
                                            <p className="text-lg sm:text-xl font-bold text-gray-900 flex-shrink-0">
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
                <div className="space-y-4 sm:space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900">Order Summary</h2>
                        </div>
                        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(order.subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-gray-600">Tax ({(order.tax_rate * 100).toFixed(1)}%)</span>
                                <span className="font-semibold text-gray-900">
                                    {formatCurrency(order.tax)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-gray-900">
                                    {order.shipping === "0.00" ? "Free" : formatCurrency(order.shipping)}
                                </span>
                            </div>
                            <div className="pt-3 sm:pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm sm:text-base font-bold text-gray-900">Total Amount</span>
                                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {formatCurrency(order.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <span className="text-sm sm:text-base lg:text-lg">Payment Details</span>
                            </h2>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-between mb-2 gap-2">
                                    <p className="text-xs text-gray-600 font-medium">Payment Status</p>
                                    <TextBadge
                                        variant="solid"
                                        color={order.payment_status_color}
                                        size="sm"
                                    >
                                        {order.payment_status_label}
                                    </TextBadge>
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                    {order.is_paid ? 'Paid in full' : 'Payment pending'}
                                </p>
                            </div>

                            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 font-medium mb-2">Payment Method</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                                    {order.payment_method === 'later' ? 'Pay Later' : order.payment_method || 'Not specified'}
                                </p>
                            </div>

                            {order.payment_gateway && (
                                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-600 font-medium mb-2">Payment Gateway</p>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 capitalize break-words">
                                        {order.payment_gateway}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {order.delivery_method === 'pickup' ? (
                                        <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                    ) : (
                                        <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                    )}
                                </div>
                                <span className="text-sm sm:text-base lg:text-lg">Delivery Details</span>
                            </h2>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                <p className="text-xs text-green-700 font-medium mb-1">Delivery Method</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-900">
                                    {order.delivery_method_label}
                                </p>
                            </div>

                            {order.delivery_details && (
                                <>
                                    <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <IconBadge
                                                icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                variant="light"
                                                color="blue"
                                                size="md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-600 mb-1">Customer Name</p>
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                                    {order.delivery_details.first_name} {order.delivery_details.last_name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <IconBadge
                                                icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                variant="light"
                                                color="purple"
                                                size="md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-600 mb-1">Email</p>
                                                <a
                                                    href={`mailto:${order.delivery_details.email}`}
                                                    className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 truncate block"
                                                >
                                                    {order.delivery_details.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <IconBadge
                                                icon={<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                variant="light"
                                                color="orange"
                                                size="md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-600 mb-1">Phone</p>
                                                <a
                                                    href={`tel:${order.delivery_details.phone_number}`}
                                                    className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 truncate block"
                                                >
                                                    {order.delivery_details.phone_number}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {order.delivery_details.whatsapp_number && (
                                        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <IconBadge
                                                    icon={<MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                    variant="light"
                                                    color="green"
                                                    size="md"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-600 mb-1">WhatsApp</p>
                                                    <a
                                                        href={`https://wa.me/${order.delivery_details.whatsapp_number.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs sm:text-sm font-semibold text-green-600 hover:text-green-700 truncate block"
                                                    >
                                                        {order.delivery_details.whatsapp_number}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {order.delivery_method !== 'pickup' && order.delivery_address && (
                                        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <IconBadge
                                                    icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                    variant="light"
                                                    color="red"
                                                    size="md"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed break-words">
                                                        {order.delivery_address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Order & Payment Status Modal */}
            <Modal
                isOpen={isStatusModalOpen}
                onClose={closeStatusModal}
                title="Update Order & Payment Status"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <SingleSelectForm
                        label="Order Status"
                        name="status"
                        expandParent
                        options={ORDER_STATUS_OPTIONS}
                        register={register}
                        setValue={setValue}
                        error={errors.status?.message}
                        defaultValue={order?.status}
                        required
                    />
                    <SingleSelectForm
                        label="Payment Status"
                        name="payment_status"
                        expandParent
                        options={PAYMENT_STATUS_OPTIONS}
                        register={register}
                        setValue={setValue}
                        error={errors.payment_status?.message}
                        defaultValue={order?.payment_status}
                        required
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            color="gray"
                            variant="outline"
                            onClick={closeStatusModal}
                            className="flex-1 w-full sm:w-auto"
                            disabled={updateOrder.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="green"
                            className="flex-1 w-full sm:w-auto"
                            loading={updateOrder.isPending}
                            startIcon={<Save className="w-4 h-4" />}
                        >
                            {updateOrder.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Update Timestamps Modal */}
            <Modal
                isOpen={isTimestampsModalOpen}
                onClose={closeTimestampsModal}
                title="Update Order Timestamps"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <InputForm
                        label="Confirmed At"
                        name="confirmed_at"
                        type="date"
                        register={register}
                        error={errors.confirmed_at?.message}
                    />
                    {!order?.is_paid && (
                        <InputForm
                            label="Paid At"
                            name="paid_at"
                            type="date"
                            register={register}
                            error={errors.paid_at?.message}
                        />
                    )}
                    <InputForm
                        label="Shipped At"
                        name="shipped_at"
                        type="date"
                        register={register}
                        error={errors.shipped_at?.message}
                    />
                    <InputForm
                        label="Delivered At"
                        name="delivered_at"
                        type="date"
                        register={register}
                        error={errors.delivered_at?.message}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            color="gray"
                            variant="outline"
                            onClick={closeTimestampsModal}
                            className="flex-1 w-full sm:w-auto"
                            disabled={updateOrder.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="green"
                            className="flex-1 w-full sm:w-auto"
                            loading={updateOrder.isPending}
                            startIcon={<Save className="w-4 h-4" />}
                        >
                            {updateOrder.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const OrderDetailsSkeleton = () => {
    return (
        <div className="w-full space-y-4 sm:space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                        {/* Left Section */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                                {/* Icon Skeleton */}
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-xl sm:rounded-2xl flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    {/* Label and Date */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <div className="h-3 w-28 bg-gray-200 rounded" />
                                        <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-200" />
                                        <div className="h-3 w-32 bg-gray-200 rounded" />
                                    </div>
                                    {/* Reference Number */}
                                    <div className="h-7 sm:h-8 w-48 sm:w-64 bg-gray-300 rounded mb-2 sm:mb-3" />
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <div className="h-7 sm:h-8 w-20 sm:w-24 bg-gray-200 rounded-lg" />
                                        <div className="h-7 sm:h-8 w-24 sm:w-28 bg-gray-200 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Button */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 w-full sm:w-auto">
                            <div className="h-10 w-full sm:w-36 bg-gray-200 rounded-lg" />
                        </div>
                    </div>

                    {/* Status Cards Section */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <div className="h-3 w-20 sm:w-24 bg-gray-200 rounded" />
                                        <div className="h-3 w-3 bg-gray-200 rounded-full flex-shrink-0" />
                                    </div>
                                    <div className="h-5 sm:h-6 w-24 sm:w-28 bg-gray-300 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Customer Information Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="h-4 sm:h-5 w-36 sm:w-48 bg-gray-300 rounded" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {[1, 2].map((item) => (
                                <div key={item} className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="h-3 w-12 sm:w-16 bg-gray-200 rounded mb-2" />
                                            <div className="h-3 sm:h-4 w-full bg-gray-300 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 sm:col-span-2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="h-3 w-12 sm:w-16 bg-gray-200 rounded mb-2" />
                                        <div className="h-3 sm:h-4 w-full bg-gray-300 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                                <div className="h-4 sm:h-5 w-28 sm:w-32 bg-gray-300 rounded" />
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="flex gap-3 sm:gap-4">
                                    <div className="flex flex-col items-center flex-shrink-0">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
                                        {item < 4 && <div className="w-0.5 h-10 sm:h-12 bg-gray-200 my-1" />}
                                    </div>
                                    <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                                        <div className="h-3.5 sm:h-4 w-28 sm:w-32 bg-gray-300 rounded mb-2" />
                                        <div className="h-3 w-36 sm:w-48 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Items Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                                <div className="h-4 sm:h-5 w-32 sm:w-40 bg-gray-300 rounded" />
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {[1, 2].map((item) => (
                                <div key={item} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl flex-shrink-0 mx-auto sm:mx-0" />
                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="h-4 sm:h-5 w-3/4 bg-gray-300 rounded mb-2 sm:mb-3" />
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded-lg" />
                                            <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded" />
                                        </div>
                                        <div className="h-3 w-24 sm:w-32 bg-gray-200 rounded" />
                                    </div>
                                    {/* Price */}
                                    <div className="text-center sm:text-right flex-shrink-0">
                                        <div className="h-5 sm:h-6 w-20 sm:w-24 bg-gray-300 rounded mb-2 mx-auto sm:ml-auto sm:mr-0" />
                                        <div className="h-3 w-10 sm:w-12 bg-gray-200 rounded mx-auto sm:ml-auto sm:mr-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Order Summary Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <div className="h-4 sm:h-5 w-28 sm:w-32 bg-gray-300 rounded" />
                        </div>
                        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex justify-between items-center">
                                    <div className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200 rounded" />
                                    <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-300 rounded" />
                                </div>
                            ))}
                            <div className="pt-3 sm:pt-4 border-t-2 border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="h-4 sm:h-5 w-20 sm:w-24 bg-gray-300 rounded" />
                                    <div className="h-6 sm:h-8 w-24 sm:w-32 bg-gray-400 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="h-4 sm:h-5 w-32 sm:w-36 bg-gray-300 rounded" />
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-3 w-20 sm:w-24 bg-gray-200 rounded" />
                                        <div className="h-4 sm:h-5 w-16 sm:w-20 bg-gray-300 rounded" />
                                    </div>
                                    <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-300 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Information Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="h-4 sm:h-5 w-32 sm:w-36 bg-gray-300 rounded" />
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {/* Delivery Method */}
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                                <div className="h-3 w-24 sm:w-28 bg-gray-200 rounded mb-2" />
                                <div className="h-3 sm:h-4 w-28 sm:w-32 bg-gray-300 rounded" />
                            </div>

                            {/* Contact Details */}
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="h-3 w-12 sm:w-16 bg-gray-200 rounded mb-2" />
                                            <div className="h-3 sm:h-4 w-full bg-gray-300 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;