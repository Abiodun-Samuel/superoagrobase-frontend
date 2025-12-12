'use client'

import { useGetOrderByReference } from '@/queries/orders.query';
import React, { useState } from 'react';
import { Package, User, MapPin, CreditCard, Truck, CheckCircle, Clock, Phone, Mail, Download, Printer, ChevronRight, Calendar, Tag, Shield, AlertCircle } from 'lucide-react';

// Advanced Status Timeline Component
const StatusTimeline = ({ status, createdAt, paidAt, shippedAt, deliveredAt }) => {
    const steps = [
        { id: 'placed', label: 'Order Placed', icon: Package, date: createdAt, active: true },
        { id: 'paid', label: 'Payment Confirmed', icon: CheckCircle, date: paidAt, active: !!paidAt },
        { id: 'processing', label: 'Processing', icon: Clock, date: null, active: status === 'processing' },
        { id: 'shipped', label: 'Shipped', icon: Truck, date: shippedAt, active: !!shippedAt },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle, date: deliveredAt, active: !!deliveredAt },
    ];

    const getStepIndex = () => {
        if (deliveredAt) return 4;
        if (shippedAt) return 3;
        if (status === 'processing') return 2;
        if (paidAt) return 1;
        return 0;
    };

    const currentStep = getStepIndex();

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-max md:min-w-0">
                <div className="flex justify-between items-start gap-4 relative px-4 md:px-0">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center flex-1 min-w-[100px] md:min-w-0 relative">
                                <div className={`relative z-10 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-500 ${isCompleted
                                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-500 shadow-lg'
                                    : 'bg-white border-gray-300'
                                    } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-6 md:top-7 left-1/2 w-full h-0.5" style={{ marginLeft: '50%' }}>
                                        <div className={`h-full transition-all duration-700 ${index < currentStep ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gray-200'
                                            }`} />
                                    </div>
                                )}

                                <div className="mt-4 text-center">
                                    <p className={`text-xs md:text-sm font-medium mb-1 whitespace-nowrap ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {step.label}
                                    </p>
                                    {step.date && (
                                        <p className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Premium Status Badge
const StatusBadge = ({ status }) => {
    const statusConfig = {
        processing: {
            gradient: 'from-blue-500 to-blue-600',
            label: 'Processing Order',
            icon: Clock
        },
        paid: {
            gradient: 'from-emerald-500 to-green-600',
            label: 'Payment Received',
            icon: CheckCircle
        },
        pending: {
            gradient: 'from-amber-500 to-orange-600',
            label: 'Awaiting Payment',
            icon: AlertCircle
        },
        shipped: {
            gradient: 'from-purple-500 to-purple-600',
            label: 'In Transit',
            icon: Truck
        },
        delivered: {
            gradient: 'from-green-500 to-emerald-600',
            label: 'Delivered',
            icon: CheckCircle
        },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${config.gradient} shadow-lg text-white font-medium text-sm`}>
            <Icon className="w-4 h-4" />
            {config.label}
        </div>
    );
};

// Info Card with Icon
const InfoCard = ({ icon: Icon, label, value, accent = 'emerald' }) => {
    const accentColors = {
        emerald: 'from-emerald-500 to-green-600',
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600'
    };

    return (
        <div className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accentColors[accent]} opacity-5 rounded-xl transform rotate-12 group-hover:scale-110 transition-transform duration-300`} />
            <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${accentColors[accent]} shadow mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-1 font-medium">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

// Product Card with Advanced Styling
const ProductCard = ({ item }) => {
    return (
        <div className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/5 to-green-600/5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative flex flex-col sm:flex-row gap-6">
                <div className="relative flex-shrink-0">
                    <div className="w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                        <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        x{item.quantity}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                {item.product.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
                                    <Package className="w-3 h-3" />
                                    {item.product.pack_size}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium">
                                    <Tag className="w-3 h-3" />
                                    SKU: {item.product.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                            <p className="text-lg font-semibold text-gray-900">₦{parseFloat(item.price_at_purchase).toLocaleString()}</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                            <p className="text-lg font-semibold text-gray-900">{item.quantity} units</p>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div className="ml-auto">
                            <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                ₦{parseFloat(item.subtotal).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Order Summary Card
const OrderSummaryCard = ({ subtotal, tax, taxRate, shipping, total }) => {
    return (
        <div className="sticky top-6 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full transform translate-x-20 -translate-y-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6" />
                        <h3 className="text-xl font-bold">Order Summary</h3>
                    </div>
                    <p className="text-slate-300 text-sm">Secure checkout</p>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-gray-900 font-semibold">₦{parseFloat(subtotal).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium">Tax</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                            {(parseFloat(taxRate) * 100).toFixed(1)}%
                        </span>
                    </div>
                    <span className="text-gray-900 font-semibold">₦{parseFloat(tax).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Shipping</span>
                    {parseFloat(shipping) === 0 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
                            <CheckCircle className="w-3 h-3" />
                            FREE
                        </span>
                    ) : (
                        <span className="text-gray-900 font-semibold">₦{parseFloat(shipping).toLocaleString()}</span>
                    )}
                </div>

                <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                        <div className="text-right">
                            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                ₦{parseFloat(total).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                        <Download className="w-4 h-4" />
                        Download Invoice
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:border-gray-300">
                        <Printer className="w-4 h-4" />
                        Print Order
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
const OrderDetailsPage = ({ reference }) => {
    const { data: orderData, isLoading } = useGetOrderByReference({ reference })
    if (isLoading) return 'loading'
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="hover:text-emerald-600 cursor-pointer transition-colors">Orders</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="font-semibold text-gray-900">#{orderData.reference || `ORD-${orderData.id}`}</span>
                            </div>
                        </div>
                        <StatusBadge status={orderData.status} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-white rounded-xl p-6 md:p-8 mb-8 shadow-xl overflow-hidden relative border border-gray-100">
                    <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-emerald-50 to-green-50 rounded-full transform translate-x-32 md:translate-x-48 -translate-y-32 md:-translate-y-48 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full transform -translate-x-24 md:-translate-x-32 translate-y-24 md:translate-y-32 opacity-50" />

                    <div className="relative">
                        <div className="flex flex-col gap-6 mb-8">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Order #{orderData.reference || `ORD-${orderData.id}`}</h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">
                                        {new Date(orderData.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <StatusTimeline
                            status={orderData.status}
                            createdAt={orderData.created_at}
                            paidAt={orderData.paid_at}
                            shippedAt={orderData.shipped_at}
                            deliveredAt={orderData.delivered_at}
                        />
                    </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <InfoCard
                        icon={User}
                        label="Customer"
                        value={orderData.user.full_name}
                        accent="emerald"
                    />
                    <InfoCard
                        icon={CreditCard}
                        label="Payment Method"
                        value={orderData.payment_method.charAt(0).toUpperCase() + orderData.payment_method.slice(1)}
                        accent="blue"
                    />
                    <InfoCard
                        icon={Truck}
                        label="Delivery Method"
                        value={orderData.delivery_method.charAt(0).toUpperCase() + orderData.delivery_method.slice(1)}
                        accent="purple"
                    />
                    <InfoCard
                        icon={Package}
                        label="Total Items"
                        value={`${orderData.items.reduce((sum, item) => sum + item.quantity, 0)} Units`}
                        accent="orange"
                    />
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {/* Order Items */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {orderData.items.map((item) => (
                                    <ProductCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Customer Information</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Full Name</label>
                                        <p className="text-lg font-semibold text-gray-900">{orderData.user.full_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Email Address</label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <p className="text-gray-900 break-all">{orderData.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <p className="text-gray-900">{orderData.user.phone_number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <OrderSummaryCard
                            subtotal={orderData.subtotal}
                            tax={orderData.tax}
                            taxRate={orderData.tax_rate}
                            shipping={orderData.shipping}
                            total={orderData.total}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;