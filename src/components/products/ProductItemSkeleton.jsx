import { Package } from "lucide-react";

// Product Skeleton Loader
export const ProductItemSkeleton = () => (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden animate-pulse">
        {/* Image Skeleton */}
        <div className="relative h-64 bg-gray-200 flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
        </div>

        {/* Content Skeleton */}
        <div className="p-5 space-y-3">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4" />

            {/* Category badges */}
            <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-20" />
                <div className="h-3 w-3 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded-full w-24" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-12" />
            </div>

            {/* Price */}
            <div className="h-6 bg-gray-200 rounded w-32" />

            {/* Stock status */}
            <div className="h-5 bg-gray-200 rounded w-40" />

            {/* Button */}
            <div className="h-10 bg-gray-200 rounded-xl w-full" />
        </div>
    </div>
);