'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
    Plus,
    Edit2,
    Trash2,
    Package,
    DollarSign,
    Box,
    Eye,
    AlertTriangle,
    Search,
    X,
    ChevronRight,
    Mail,
    Phone,
    Building2,
    Globe,
    MapPin,
} from 'lucide-react';
import { useVendorProducts, useUpdateVendorProducts, useDeleteVendorProducts } from '@/queries/vendor.query';
import { useModal } from '@/hooks/useModal';
import Button from '@/components/ui/Button';
import Modal from '@/components/modal/Modal';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import InputForm from '@/components/form/InputForm';
import SwitchForm from '@/components/form/SwitchForm';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import useAuth from '@/hooks/useAuth';

// ============================================
// SKELETON LOADERS
// ============================================

// Vendor Info Card Skeleton
const VendorInfoCardSkeleton = () => (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar & Primary Info Skeleton */}
            <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Info Skeleton */}
            <div className="flex-1 lg:border-l lg:border-gray-300 dark:border-gray-600 lg:pl-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-0.5 animate-pulse flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Stats Card Skeleton
const StatsCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3 animate-pulse" />
            </div>
            <div className="p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 animate-pulse">
                <div className="w-5 h-5" />
            </div>
        </div>
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
    </div>
);

// Product Filters Skeleton
const ProductFiltersSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input Skeleton */}
            <div className="flex-1">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>

            {/* Search Button Skeleton */}
            <div className="w-full lg:w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

            {/* Sort Dropdown Skeleton */}
            <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10 hidden lg:block animate-pulse" />
                <div className="w-full lg:w-44 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
        </div>
    </div>
);

// Table Row Skeleton
const TableRowSkeleton = () => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
        {/* Product */}
        <td className="p-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 animate-pulse" />
                <div className="min-w-0 space-y-2 flex-1">
                    <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
                </div>
            </div>
        </td>
        {/* Description */}
        <td className="p-4">
            <div className="space-y-1.5">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-xs animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 max-w-xs animate-pulse" />
            </div>
        </td>
        {/* Brand */}
        <td className="p-4">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </td>
        {/* Category */}
        <td className="p-4">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </td>
        {/* Subcategory */}
        <td className="p-4">
            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </td>
        {/* Price */}
        <td className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
        </td>
        {/* Stock */}
        <td className="p-4">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </td>
        {/* Status */}
        <td className="p-4">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        </td>
        {/* Actions */}
        <td className="p-4">
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        </td>
    </tr>
);

// Complete Page Skeleton
const PageSkeleton = () => (
    <div className="space-y-6 my-10">
        {/* Vendor Info Skeleton */}
        <VendorInfoCardSkeleton />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
                <StatsCardSkeleton key={i} />
            ))}
        </div>

        {/* Filters Skeleton */}
        <ProductFiltersSkeleton />

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Brand
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Subcategory
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(8)].map((_, i) => (
                            <TableRowSkeleton key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// ============================================
// Vendor Info Card Component
// ============================================
const VendorInfoCard = ({ vendor }) => {
    if (!vendor) return null;

    const vendorName = `${vendor.first_name || ''} ${vendor.last_name || ''}`.trim();
    const hasCompanyInfo = vendor.company_name || vendor.company_email || vendor.company_phone || vendor.company_address || vendor.company_website;

    return (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar & Primary Info */}
                <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                        <img
                            src={vendor.avatar || '/placeholder-avatar.png'}
                            alt={vendorName}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {vendorName}
                        </h2>
                        <div className="flex flex-col gap-2">
                            {vendor.email && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    <a
                                        href={`mailto:${vendor.email}`}
                                        className="hover:text-green-600 dark:hover:text-green-400 transition-colors truncate"
                                    >
                                        {vendor.email}
                                    </a>
                                </div>
                            )}
                            {vendor.phone_number && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    <a
                                        href={`tel:${vendor.phone_number}`}
                                        className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        {vendor.phone_number}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                {hasCompanyInfo && (
                    <div className="flex-1 lg:border-l lg:border-gray-300 dark:border-gray-600 lg:pl-6">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            Company Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {vendor.company_name && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Company Name</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {vendor.company_name}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {vendor.company_email && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Company Email</p>
                                        <a
                                            href={`mailto:${vendor.company_email}`}
                                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors truncate block"
                                        >
                                            {vendor.company_email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {vendor.company_phone && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Company Phone</p>
                                        <a
                                            href={`tel:${vendor.company_phone}`}
                                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                        >
                                            {vendor.company_phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {vendor.company_website && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Globe className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                                        <a
                                            href={vendor.company_website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors truncate block"
                                        >
                                            {vendor.company_website}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {vendor.company_address && (
                                <div className="flex items-start gap-2 text-sm sm:col-span-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {vendor.company_address}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================
// Stats Card Component
// ============================================
const StatsCard = ({ icon: Icon, label, value, color = "green" }) => {
    const colorClasses = {
        green: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400',
        blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                </div>
                <div className={`p-2.5 rounded-lg flex-shrink-0 ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 truncate" title={value}>
                {value}
            </h3>
        </div>
    );
};

// ============================================
// Empty State Component
// ============================================
const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">{description}</p>
        {action && action}
    </div>
);

// ============================================
// Product Filters Component
// ============================================
const ProductFilters = ({ filters, onFilterChange, onReset, isSearching }) => {
    const { register, watch, setValue, formState: { errors }, handleSubmit } = useForm({
        defaultValues: filters
    });

    const sortOptions = [
        { value: 'newest', text: 'Newest First' },
        { value: 'oldest', text: 'Oldest First' },
        { value: 'name_asc', text: 'Name: A-Z' },
        { value: 'name_desc', text: 'Name: Z-A' },
    ];

    const searchValue = watch('search');
    const sortValue = watch('sort');

    useEffect(() => {
        if (sortValue !== filters.sort) {
            onFilterChange({ sort: sortValue });
        }
    }, [sortValue, filters.sort, onFilterChange]);

    const handleSearchSubmit = (data) => {
        onFilterChange({ search: data.search });
    };

    const handleReset = () => {
        setValue('search', '');
        setValue('sort', 'newest');
        onReset();
    };

    const hasActiveFilters = searchValue || sortValue !== 'newest';

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <form onSubmit={handleSubmit(handleSearchSubmit)} className="flex flex-col lg:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1">
                    <InputForm
                        name="search"
                        type="text"
                        register={register}
                        error={errors.search?.message}
                        placeholder="Search products..."
                    />
                </div>

                {/* Search Button */}
                <Button
                    type="submit"
                    color="green"
                    size="md"
                    startIcon={<Search className="w-4 h-4" />}
                    loading={isSearching}
                    className="w-full lg:w-auto"
                >
                    Search
                </Button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:inline">Sort:</span>
                    <div className="w-full lg:w-44">
                        <SingleSelectForm
                            name="sort"
                            options={sortOptions}
                            register={register}
                            setValue={setValue}
                            placeholder="Sort by"
                            searchable={false}
                            defaultValue={filters.sort || 'newest'}
                        />
                    </div>
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        color="gray"
                        size="md"
                        onClick={handleReset}
                        startIcon={<X className="w-4 h-4" />}
                        className="w-full lg:w-auto"
                    >
                        Reset
                    </Button>
                )}
            </form>
        </div>
    );
};

// ============================================
// Product Table Row (Table View)
// ============================================
const ProductTableRow = ({ product, onEdit, onDelete }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <td className="p-4">
            <div className="flex items-center gap-3">
                <img
                    src={product.product?.image || '/placeholder.png'}
                    alt={product.product?.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0">
                    <Link
                        href={`/products/${product.product?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1 group w-fit"
                    >
                        <span className="truncate">{product.product?.title}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>
                    {product.product?.sub_title && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                            {product.product.sub_title}
                        </p>
                    )}
                    {product.product?.pack_size && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {product.product.pack_size}
                        </p>
                    )}
                </div>
            </div>
        </td>
        <td className="p-4">
            {product.product?.description ? (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
                    {product.product.description}
                </p>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </td>
        <td className="p-4">
            {product.product?.brands ? (
                <TextBadge size="xs" variant="light" color="orange">
                    {product.product.brands}
                </TextBadge>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </td>
        <td className="p-4">
            {product.product?.category?.title ? (
                <TextBadge size="xs" variant="light" color="blue">
                    {product.product.category.title}
                </TextBadge>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </td>
        <td className="p-4">
            {product.product?.subcategory?.title ? (
                <TextBadge size="xs" variant="light" color="indigo">
                    {product.product.subcategory.title}
                </TextBadge>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </td>
        <td className="p-4">
            <span className="font-semibold text-green-600 whitespace-nowrap">
                ₦{parseFloat(product.price).toLocaleString()}
            </span>
        </td>
        <td className="p-4">
            <TextBadge size="sm" variant="light" color="blue">
                {product.stock} units
            </TextBadge>
        </td>
        <td className="p-4">
            <TextBadge
                size="sm"
                variant="light"
                startIcon={product.is_available && <Eye className="w-3 h-3" />}
                color={product.is_available ? "green" : "gray"}
            >
                {product.is_available ? (
                    <>Available</>
                ) : (
                    <>Not Available</>
                )}
            </TextBadge>
        </td>
        <td className="p-4">
            <div className="flex gap-2">
                <IconBadge
                    icon={<Edit2 className="w-4 h-4" />}
                    size="sm"
                    variant="light"
                    color="blue"
                    onClick={() => onEdit(product)}
                    ariaLabel="Edit product"
                />
                <IconBadge
                    icon={<Trash2 className="w-4 h-4" />}
                    size="sm"
                    variant="light"
                    color="red"
                    onClick={() => onDelete(product)}
                    ariaLabel="Delete product"
                />
            </div>
        </td>
    </tr>
);

// ============================================
// Product Form Modal (Edit)
// ============================================
const ProductFormModal = ({ isOpen, onClose, onSubmit, product = null, isLoading }) => {
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm({
        defaultValues: { price: '', stock: '', is_available: false },
    });

    const priceValue = watch('price');
    const stockValue = watch('stock');

    React.useEffect(() => {
        if (product) {
            reset({
                price: product.price,
                stock: product.stock,
                is_available: product.is_available
            });
        } else {
            reset({ price: '', stock: '', is_available: true });
        }
    }, [product, reset]);

    const handleFormSubmit = (data) => {
        const price = parseFloat(data.price);
        const stock = parseInt(data.stock);

        // Validation: price and stock must be greater than 0
        if (isNaN(price) || price <= 0) {
            return;
        }
        if (isNaN(stock) || stock <= 0) {
            return;
        }

        onSubmit({
            ...data,
            is_available: !!data.is_available,
            price: price,
            stock: stock
        });
    };

    // Check if form is valid
    const isPriceValid = priceValue && parseFloat(priceValue) > 0;
    const isStockValid = stockValue && parseInt(stockValue) > 0;
    const isFormValid = isPriceValid && isStockValid;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Product" maxWidth="max-w-lg">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {product && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <img
                            src={product.product?.image || '/placeholder.png'}
                            alt={product.product?.title}
                            className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {product.product?.title}
                            </h4>
                            {product.product?.pack_size && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {product.product.pack_size}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update the pricing, stock quantity, and availability status for this product in your catalog.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputForm
                        label="Your Price (₦)"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        register={register}
                        error={errors.price?.message || (priceValue && parseFloat(priceValue) <= 0 ? 'Price must be greater than 0' : '')}
                        placeholder="0.00"
                        required
                    />
                    <InputForm
                        label="Stock Quantity"
                        name="stock"
                        type="number"
                        min="1"
                        register={register}
                        error={errors.stock?.message || (stockValue && parseInt(stockValue) <= 0 ? 'Stock must be greater than 0' : '')}
                        placeholder="0"
                        required
                    />
                </div>

                <SwitchForm
                    label="Availability Status"
                    name="is_available"
                    control={control}
                    description="Toggle product visibility for customers"
                    color="green"
                />

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="green"
                        loading={isLoading}
                        disabled={isLoading || !isFormValid}
                        className="flex-1"
                    >
                        Update Product
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

// ============================================
// Delete Confirmation Modal
// ============================================
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, product, isLoading }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Remove Product from Catalog" maxWidth="max-w-md">
        <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Remove Product?
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to remove{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {product?.product?.title}
                </span>{' '}
                from your catalog? This action cannot be undone and the product will no longer be visible to customers.
            </p>

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    color="gray"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    onClick={onConfirm}
                    loading={isLoading}
                    disabled={isLoading}
                    className="flex-1"
                >
                    Remove Product
                </Button>
            </div>
        </div>
    </Modal>
);

// ============================================
// Main VendorProducts Component
// ============================================
const VendorProducts = ({ vendorId }) => {
    const router = useRouter();
    const { user } = useAuth();
    const [filters, setFilters] = useState({
        search: '',
        sort: 'newest',
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal(false);
    const { isOpen: isDeleteOpen, openModal: openDelete, closeModal: closeDelete } = useModal(false);

    const { data: productsData, isLoading } = useVendorProducts({
        vendor_id: vendorId || user?.id,
        search: filters.search,
        sort: filters.sort,
    });

    const { mutate: updateProducts, isPending: isUpdating, isSuccess: isUpdateSuccess } = useUpdateVendorProducts();
    const { mutate: deleteProducts, isPending: isDeleting, isSuccess: isDeleteSuccess } = useDeleteVendorProducts();

    useEffect(() => {
        if (isUpdateSuccess) {
            closeForm();
            setEditingProduct(null);
        }
    }, [isUpdateSuccess, closeForm]);

    useEffect(() => {
        if (isDeleteSuccess) {
            closeDelete();
            setSelectedProduct(null);
        }
    }, [isDeleteSuccess, closeDelete]);

    const products = useMemo(() => productsData?.data || [], [productsData]);
    const meta = useMemo(() => productsData?.meta || {}, [productsData]);

    // Extract vendor info from first product
    const vendorInfo = useMemo(() => {
        if (products.length > 0 && products[0].vendor) {
            return products[0].vendor;
        }
        return null;
    }, [products]);

    const stats = useMemo(() => ({
        total: meta.total || products.length,
        available: products.filter(p => p.is_available).length,
        totalStock: products.reduce((sum, p) => sum + p.stock, 0),
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    }), [products, meta.total]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
        }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({
            search: '',
            sort: 'newest',
        });
    }, []);

    const handleEdit = useCallback((product) => {
        setEditingProduct(product);
        openForm();
    }, [openForm]);

    const handleDelete = useCallback((product) => {
        setSelectedProduct(product);
        openDelete();
    }, [openDelete]);

    const handleFormSubmit = useCallback((formData) => {
        if (editingProduct) {
            updateProducts([{ id: editingProduct.id, ...formData }]);
        }
    }, [editingProduct, updateProducts]);

    const handleDeleteConfirm = useCallback(() => {
        if (selectedProduct) {
            deleteProducts([selectedProduct.id]);
        }
    }, [selectedProduct, deleteProducts]);

    const handleCloseForm = useCallback(() => {
        closeForm();
        setEditingProduct(null);
    }, [closeForm]);

    const hasActiveFilters = filters.search || filters.sort !== 'newest';

    // Show complete page skeleton while loading
    if (isLoading) {
        return <PageSkeleton />;
    }

    return (
        <div className="space-y-6 my-10">
            {/* Vendor Info Card */}
            {vendorInfo && <VendorInfoCard vendor={vendorInfo} />}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatsCard icon={Package} label="Total Products" value={stats.total} color="blue" />
                <StatsCard icon={Eye} label="Available" value={stats.available} color="green" />
                <StatsCard icon={Box} label="Total Stock" value={stats.totalStock.toLocaleString()} color="purple" />
                <StatsCard icon={DollarSign} label="Inventory Value" value={`₦${stats.totalValue.toLocaleString()}`} color="orange" />
            </div>

            {/* Filters */}
            <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                isSearching={isLoading}
            />

            {/* Products Table */}
            {products.length === 0 ? (
                <EmptyState
                    icon={Package}
                    title={hasActiveFilters ? "No products found" : "No products yet"}
                    description={hasActiveFilters ? "Try adjusting your search or filters" : "Start by adding products to your catalog"}
                    action={
                        !hasActiveFilters && (
                            <Button
                                href={vendorId ? `/account/products/add?vendor_id=${vendorId}` : '/account/products/add'}
                                color="green"
                                startIcon={<Plus className="w-5 h-5" />}
                            >
                                Add Your First Products
                            </Button>
                        )
                    }
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Brand
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Subcategory
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-10 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <ProductTableRow
                                        key={product.id}
                                        product={product}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ProductFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                product={editingProduct}
                isLoading={isUpdating}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    closeDelete();
                    setSelectedProduct(null);
                }}
                onConfirm={handleDeleteConfirm}
                product={selectedProduct}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default VendorProducts;