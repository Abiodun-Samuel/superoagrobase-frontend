import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';

const ProductListSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Filter Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                    <div className="h-5 bg-gray-200 rounded w-20" />
                </div>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
                        <div className="w-24 h-10 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="w-4 h-4 bg-gray-200 rounded" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-16" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-20" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-24" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-16" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-12" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-14" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-16" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-16" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-14" />
                                </TableCell>
                                <TableCell isHeader className="px-6 py-3">
                                    <div className="h-3 bg-gray-200 rounded w-16" />
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200">
                            {[...Array(10)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    {/* Checkbox */}
                                    <TableCell className="px-6 py-4">
                                        <div className="w-4 h-4 bg-gray-200 rounded" />
                                    </TableCell>
                                    {/* Product */}
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-32" />
                                                <div className="h-3 bg-gray-200 rounded w-24" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/* Category */}
                                    <TableCell className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded w-24" />
                                    </TableCell>
                                    {/* Subcategory */}
                                    <TableCell className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded w-24" />
                                    </TableCell>
                                    {/* Brand */}
                                    <TableCell className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded w-20" />
                                    </TableCell>
                                    {/* Price */}
                                    <TableCell className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-20" />
                                    </TableCell>
                                    {/* Stock */}
                                    <TableCell className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded w-16" />
                                    </TableCell>
                                    {/* Vendors */}
                                    <TableCell className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded w-20" />
                                    </TableCell>
                                    {/* Featured */}
                                    <TableCell className="px-6 py-4">
                                        <div className="w-5 h-5 bg-gray-200 rounded-full" />
                                    </TableCell>
                                    {/* Status */}
                                    <TableCell className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded w-20" />
                                    </TableCell>
                                    {/* Actions */}
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {[...Array(3)].map((_, j) => (
                                                <div key={j} className="w-8 h-8 bg-gray-200 rounded-full" />
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ProductListSkeleton;