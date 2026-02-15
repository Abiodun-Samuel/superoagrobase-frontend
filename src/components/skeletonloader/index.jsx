'use client'

import { Package } from "lucide-react";

export const HeroSectionImageSkeleton = () => (
    <div className="relative h-[500px] lg:h-[550px] rounded-xl overflow-hidden shadow bg-white">
        <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-green-600/20 relative animate-pulse">
            <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                    {Array.from({ length: 36 }, (_, i) => (
                        <div key={`skeleton-grid-${i}`} className="border border-green-600" />
                    ))}
                </div>
            </div>

            <div className="relative h-full flex flex-col justify-between p-8">
                <div className="flex justify-center items-start">
                    <div className="h-8 w-40 bg-gray-300 rounded-full" />
                </div>

                <div className="flex-1 flex items-center justify-center py-8">
                    <div className="relative w-80 h-80 lg:w-96 lg:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Package className="w-24 h-24 text-gray-400" />
                    </div>
                </div>

                <div className="flex justify-center space-x-2">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={`skeleton-indicator-${i}`} className="w-3 h-3 bg-gray-300 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CartItemSkeleton = () => {
    return (
        <div className="
            flex flex-col sm:flex-row 
            gap-3 sm:gap-4 
            p-3 sm:p-4 md:p-6
            bg-white border border-gray-200 rounded-xl
        ">
            {/* Mobile: Image + Remove Button Row */}
            <div className="flex sm:block gap-3">
                {/* Image Skeleton */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-200 rounded-xl animate-pulse" />

                {/* Remove Button Skeleton - Mobile */}
                <div className="sm:hidden ml-auto self-start w-9 h-9 bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                {/* Header Section */}
                <div className="flex justify-between items-start gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* Title */}
                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-full sm:w-3/4 animate-pulse" />
                        {/* Brand */}
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 sm:w-1/2 animate-pulse" />

                        {/* Tags */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-6 w-16 sm:w-20 bg-gray-200 rounded-md animate-pulse" />
                            <div className="h-6 w-12 sm:w-16 bg-gray-200 rounded-md animate-pulse" />
                        </div>
                    </div>

                    {/* Remove Button Skeleton - Desktop */}
                    <div className="hidden sm:block w-10 h-10 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                </div>

                {/* Price and Quantity Section */}
                <div className="
                    flex flex-col xs:flex-row gap-1
                    items-stretch xs:items-end
                    pt-2 sm:pt-0
                ">
                    {/* Quantity Selector Skeleton */}
                    <div className="flex-shrink-0 space-y-1">
                        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                            {/* Input Skeleton */}
                            <div className="relative flex-shrink-0">
                                <div className="w-full xs:w-20 sm:w-24 h-10 bg-gray-200 rounded-xl animate-pulse" />
                                {/* Max stock badge skeleton */}
                                <div className="absolute -top-2 -right-2 w-8 h-5 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden sm:block flex-1" />

                    {/* Price Skeleton */}
                    <div className="
                        flex xs:flex-col 
                        justify-between xs:justify-end 
                        items-center xs:items-end 
                        gap-2
                    ">
                        <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded animate-pulse order-2 xs:order-1" />
                        <div className="h-5 sm:h-6 md:h-7 w-24 sm:w-28 bg-gray-200 rounded animate-pulse order-1 xs:order-2" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderSummarySkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
            {/* Title */}
            <div className="h-7 w-40 bg-gray-200 rounded-xl animate-pulse mb-6" />

            {/* Summary Lines */}
            <div className="space-y-3 mb-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                ))}

                {/* Total Line */}
                <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="space-y-3">
                <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse" />
                <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Free Delivery Info Skeleton */}
            <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-xl">
                <div className="flex gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Security Badge Skeleton */}
            <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
};

export const CartPageSkeleton = () => {
    return (
        <div className="grid w-full lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((item) => (
                    <CartItemSkeleton key={item} />
                ))}
            </div>

            {/* Order Summary Skeleton */}
            <div className="lg:col-span-1">
                <OrderSummarySkeleton />
            </div>
        </div>
    );
};

export const OrderListSkeleton = () => {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
                >
                    {/* Progress bar skeleton */}
                    <div className="h-1.5 bg-gray-200" />

                    <div className="p-4 sm:p-6">
                        {/* Header skeleton */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-32 bg-gray-200 rounded" />
                                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                    <div className="h-4 w-20 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
                                <div className="h-8 w-28 bg-gray-200 rounded" />
                            </div>
                        </div>

                        {/* Details grid skeleton */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                    <div className="h-5 w-32 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>

                        {/* Actions skeleton */}
                        <div className="mt-6 flex gap-3">
                            <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
                            <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const UserDetailsSkeleton = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 space-y-10 my-10">
            <div className="mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                    {/* Back Button Bar */}
                    <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse" />
                    </div>

                    {/* Main Content */}
                    <div className="px-6 py-6 sm:px-8">
                        <div className="flex flex-col sm:flex-row gap-5 items-start">
                            {/* Avatar Skeleton */}
                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse ring-4 ring-white dark:ring-gray-800" />
                                    {/* Profile status indicator skeleton */}
                                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 ring-2 ring-white dark:ring-gray-800 animate-pulse" />
                                </div>
                            </div>

                            {/* User Details Skeleton */}
                            <div className="flex-1 space-y-3.5 text-center sm:text-left w-full">
                                {/* Name and Role */}
                                <div className="space-y-1.5">
                                    <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse mx-auto sm:mx-0" />
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse" />
                                        <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse" />
                                        <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse" />
                                    </div>
                                </div>

                                {/* Contact Information Skeleton */}
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-2.5 justify-center sm:justify-start">
                                            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" style={{ width: i === 1 ? '200px' : i === 2 ? '140px' : '180px' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons & Stats Skeleton */}
                            <div className="flex flex-col gap-3 items-center sm:items-end">
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                                </div>

                                {/* Completion Stats (Desktop) */}
                                <div className="hidden sm:flex flex-col items-center justify-center px-6 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 w-32">
                                    <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse mb-2" />
                                    <div className="h-9 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse mb-2" />
                                    <div className="h-5 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="px-6 py-3.5 sm:px-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-4 w-36 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
                            <div className="flex items-center gap-2 sm:hidden">
                                <div className="h-5 w-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse" />
                                <div className="h-4 w-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 animate-pulse w-3/4" />
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information Card */}
                    <InfoCardSkeleton
                        iconColor="blue"
                        title="Contact Information"
                        items={2}
                    />

                    {/* Location Card */}
                    <InfoCardSkeleton
                        iconColor="green"
                        title="Location"
                        items={3}
                    />

                    {/* Account Information Card */}
                    <InfoCardSkeleton
                        iconColor="purple"
                        title="Account Information"
                        items={3}
                    />

                    {/* Personal Information Card */}
                    <InfoCardSkeleton
                        iconColor="orange"
                        title="Personal Information"
                        items={2}
                    />
                </div>

                {/* Company Information Card (Optional) */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-300 to-indigo-400 dark:from-indigo-600 dark:to-indigo-700" />
                        <div className="h-6 w-44 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
                                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Info Card Skeleton Component
const InfoCardSkeleton = ({ iconColor, title, items }) => {
    const iconColorClass = {
        blue: 'from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-700',
        green: 'from-green-300 to-green-400 dark:from-green-600 dark:to-green-700',
        purple: 'from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700',
        orange: 'from-orange-300 to-orange-400 dark:from-orange-600 dark:to-orange-700',
    }[iconColor];

    // Deterministic widths to avoid hydration mismatch
    const widths = ['75%', '85%', '65%'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-5 h-5 rounded bg-gradient-to-br ${iconColorClass}`} />
                <div className="h-6 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
            </div>

            {/* Card Items */}
            <div className="space-y-4">
                {Array.from({ length: items }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 mt-0.5" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" />
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded" style={{ width: widths[i % widths.length] }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};