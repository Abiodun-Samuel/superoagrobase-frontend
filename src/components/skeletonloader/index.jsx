'use client'

import { Package } from "lucide-react";

export const HeroSectionImageSkeleton = () => (
    <div className="relative h-[500px] lg:h-[550px] rounded-lg overflow-hidden shadow bg-white">
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
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse" />

                {/* Remove Button Skeleton - Mobile */}
                <div className="sm:hidden ml-auto self-start w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
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
                    <div className="hidden sm:block w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
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
                                <div className="w-full xs:w-20 sm:w-24 h-10 bg-gray-200 rounded-lg animate-pulse" />
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
            <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse mb-6" />

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
                <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Free Delivery Info Skeleton */}
            <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
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

