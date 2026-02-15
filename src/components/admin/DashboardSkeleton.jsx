import { memo } from 'react';

const DashboardSkeleton = memo(() => {
    return (
        <div className="space-y-8 pb-8">
            {/* Page Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
            </div>

            {/* Overview Stats Skeleton */}
            <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Revenue Cards Skeleton */}
            <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-green-200 dark:bg-green-700 rounded-lg"></div>
                                <div className="h-6 bg-green-100 dark:bg-green-900 rounded-full w-16"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                <div className="h-8 bg-green-200 dark:bg-green-700 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Row Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
                            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                        </div>
                        <div className="p-6">
                            <div className="h-80 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tables Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, tableIndex) => (
                    <div
                        key={tableIndex}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        {[...Array(4)].map((_, i) => (
                                            <th key={i} className="px-4 py-3">
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse">{''}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {[...Array(6)].map((_, rowIndex) => (
                                        <tr key={rowIndex} className="animate-pulse">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                            </td>
                                            <td className="px-4 py-3 flex justify-center">
                                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Segments Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse"
                        >
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

DashboardSkeleton.displayName = 'DashboardSkeleton';

export default DashboardSkeleton;