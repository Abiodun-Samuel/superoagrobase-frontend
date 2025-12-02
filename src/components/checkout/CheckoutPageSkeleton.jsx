const CheckoutPageSkeleton = () => {
    return (
        <div className="min-h-screen mx-auto animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Skeleton */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Information Skeleton */}
                    <div className="bg-white rounded-2xl shadow p-5">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-48"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-11 bg-gray-200 rounded-lg"></div>
                            </div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-11 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Details Skeleton */}
                    <div className="bg-white rounded-2xl shadow p-5">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-11 bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                                    <div className="h-11 bg-gray-200 rounded-lg"></div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                                    <div className="h-11 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address Skeleton */}
                    <div className="bg-white rounded-2xl shadow p-5">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-44"></div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-11 bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                    <div className="h-11 bg-gray-200 rounded-lg"></div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                                    <div className="h-11 bg-gray-200 rounded-lg"></div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-14 mb-2"></div>
                                    <div className="h-11 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                            {/* Save shipping toggle skeleton */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-7 bg-gray-200 rounded-full ml-4"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-56"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Method Skeleton */}
                    <div className="bg-white rounded-2xl shadow p-5">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 rounded-xl border-2 border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 bg-gray-200 rounded w-28"></div>
                                                {i === 1 && <div className="h-5 bg-gray-200 rounded-full w-16"></div>}
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-40 mt-2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method Skeleton */}
                    <div className="bg-white rounded-2xl shadow p-5">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 rounded-xl border-2 border-gray-200">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 bg-gray-200 rounded w-32"></div>
                                                {i === 1 && <div className="h-5 bg-gray-200 rounded-full w-14"></div>}
                                            </div>
                                            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-36 mt-2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button Skeleton */}
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>

                {/* Order Summary Sidebar Skeleton */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                        <div className="h-7 bg-gray-200 rounded w-36 mb-4"></div>

                        {/* Cart Items Skeleton */}
                        <div className="space-y-4 mb-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 pb-4 border-b border-gray-100">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Lines Skeleton */}
                        <div className="space-y-3 pt-4 border-t-2 border-gray-100">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                                <div className="h-8 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>

                        {/* Security Badge Skeleton */}
                        <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-48"></div>
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="mt-6 space-y-3">
                            <div className="h-12 bg-gray-200 rounded-xl"></div>
                            <div className="h-12 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                /* Enhanced shimmer effect */
                .bg-gray-200 {
                    background: linear-gradient(
                        90deg,
                        #e5e7eb 0%,
                        #f3f4f6 50%,
                        #e5e7eb 100%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default CheckoutPageSkeleton;