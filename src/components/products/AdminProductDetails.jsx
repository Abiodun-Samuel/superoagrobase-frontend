'use client';

import { useAdminProduct, useDeleteProduct, useBulkUpdateFeaturedProducts } from '@/queries/products.query';
import {
    Package,
    Edit,
    Trash2,
    ArrowLeft,
    Eye,
    ShoppingCart,
    Star,
    Tag,
    DollarSign,
    Box,
    Image as ImageIcon,
    AlertCircle,
    Calendar,
    BarChart3,
    Sparkles,
    Mail,
    Phone,
    TrendingDown,
    Store,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import Avatar from '@/components/ui/Avatar';
import DeleteProductModal from './DeleteProductModal';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';
import { formatCount } from '@/utils/helper';

const AdminProductDetails = ({ slug }) => {
    const router = useRouter();
    const { data: product, isLoading, isError } = useAdminProduct(slug);
    const updateProduct = useBulkUpdateFeaturedProducts();
    const deleteProduct = useDeleteProduct();

    const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal(false);
    const [selectedImage, setSelectedImage] = useState(null);

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
        });
    };

    const handleToggleFeatured = () => {
        updateProduct.mutate({
            product_ids: [product.id],
            is_featured: !product.is_featured,
        });
    };

    const handleDelete = (productId) => {
        deleteProduct.mutate(productId, {
            onSuccess: () => {
                closeDeleteModal();
                router.push('/dashboard/products');
            },
        });
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    if (isLoading) {
        return <ProductDetailsSkeleton />;
    }

    if (isError || !product) {
        return (
            // Beautiful Product Not Found Error State

            <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl border border-orange-100 dark:border-orange-900/30 overflow-hidden">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-300/20 dark:bg-orange-400/5 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative px-6 py-12 sm:px-12 sm:py-16">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        {/* Icon with Animated Ring */}
                        <div className="relative inline-flex items-center justify-center mb-2">
                            <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/20 rounded-full animate-ping opacity-20" />
                            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 rounded-2xl shadow-lg border border-orange-200/50 dark:border-orange-800/30">
                                <Package className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Product Not Found
                            </h3>
                            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                We couldn't find the product you're looking for. It may have been removed or doesn't exist.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="relative py-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-orange-200/50 dark:border-orange-800/30" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                                    What would you like to do?
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <Button
                                onClick={() => router.push('/dashboard/products')}
                                startIcon={<ArrowLeft className="w-4 h-4" />}
                                className="shadow-lg hover:shadow-xl"
                            >
                                Back to Products
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="bg-white dark:bg-gray-800"
                            >
                                Refresh Page
                            </Button>
                        </div>

                        {/* Helper Text */}
                        <p className="text-xs text-gray-500 dark:text-gray-500 pt-2">
                            Need help? Contact our{' '}
                            <button
                                onClick={() => router.push('/dashboard/support')}
                                className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
                            >
                                support team
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const displayImage = selectedImage || product.image;
    const imageGallery = product.images && Array.isArray(product.images) ? product.images : [];
    const allImages = [product.image, ...imageGallery].filter(Boolean);

    // Calculate discount percentage if applicable
    const discountPercent = product.discount_price
        ? (((product.price - product.discount_price) / product.price) * 100).toFixed(0)
        : 0;

    // Calculate base price savings
    const basePriceSavings = product.base_price && product.price < product.base_price
        ? (((product.base_price - product.price) / product.base_price) * 100).toFixed(0)
        : 0;

    return (
        <div className="w-full">
            {/* Professional Header */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4 sm:mb-6">
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Back Button */}
                    <div className="mb-4 sm:mb-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Products</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                        {/* Left Section - Product Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-green-100 shadow-sm flex-shrink-0">
                                    <Package className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Product Details
                                        </span>
                                        <div className="hidden sm:block h-1 w-1 rounded-full bg-gray-300" />
                                        <span className="text-xs text-gray-500">
                                            {product.brands || 'No Brand'}
                                        </span>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                                        {product.title}
                                    </h1>
                                    {product.sub_title && (
                                        <p className="text-sm sm:text-base text-gray-600 mb-3">
                                            {product.sub_title}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                                            <Box className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-600 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                {product.pack_size}
                                            </span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                                            <DollarSign className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-green-600 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm font-semibold text-green-700">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </div>
                                        {product.discount_price && (
                                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
                                                <Tag className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-600 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm font-semibold text-red-600">
                                                    {formatCurrency(product.discount_price)}
                                                </span>
                                                <span className="text-xs font-bold text-red-600">
                                                    -{discountPercent}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 w-full sm:w-auto">
                            <Button
                                color={product.is_featured ? "orange" : "gray"}
                                variant="solid"
                                onClick={handleToggleFeatured}
                                loading={updateProduct.isPending}
                                className="w-full sm:w-auto justify-center"
                                startIcon={<Star className="w-4 h-4" />}
                            >
                                {product.is_featured ? 'Unfeature' : 'Feature'}
                            </Button>
                            <Link href={`/dashboard/products/edit/${product.slug}`} className="w-full sm:w-auto">
                                <Button
                                    color="green"
                                    variant="solid"
                                    className="w-full justify-center"
                                    startIcon={<Edit className="w-4 h-4" />}
                                >
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                color="red"
                                variant="outline"
                                onClick={openDeleteModal}
                                className="w-full sm:w-auto justify-center"
                                startIcon={<Trash2 className="w-4 h-4" />}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="flex flex-wrap items-center gap-2">
                            {product.is_featured && (
                                <TextBadge startIcon={<Sparkles className="w-3.5 h-3.5" />} variant="solid" color="orange" size="sm">
                                    Featured
                                </TextBadge>
                            )}
                            <TextBadge
                                variant="solid"
                                color={product.stock > 10 ? "green" : product.stock > 0 ? "orange" : "red"}
                                size="sm"
                            >
                                {product.status === 'in_stock' ? 'In Stock' : product.status === 'out_of_stock' ? 'Out of Stock' : 'Limited Stock'}
                            </TextBadge>
                            {product.badges?.map((badge, index) => (
                                <TextBadge key={index} variant="light" color="blue" size="sm">
                                    {badge}
                                </TextBadge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Product Image - Smaller and Optimized */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                            </div>
                            <span className="text-sm sm:text-base lg:text-lg">Product Images</span>
                        </h2>

                        <div className="flex flex-col items-center">
                            {/* Main Display Image - Smaller */}
                            <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
                                <img
                                    src={displayImage || '/placeholder.png'}
                                    alt={product.title}
                                    className="w-full h-full object-contain p-6"
                                />
                            </div>

                            {/* Image Gallery Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 w-full max-w-md">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleImageClick(image)}
                                            className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${displayImage === image
                                                ? 'border-green-500 ring-2 ring-green-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={image || '/placeholder.png'}
                                                alt={`${product.title} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vendors Section - Redesigned */}
                    {product.has_vendor_pricing && product.vendors && product.vendors.length > 0 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm sm:text-base">Vendors ({product.vendors.length})</span>
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {product.vendors.map((vendorItem) => {
                                    const vendor = vendorItem.vendor;
                                    const initials = `${vendor.first_name?.charAt(0) || ''}${vendor.last_name?.charAt(0) || ''}`;

                                    return (
                                        <div key={vendorItem.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                                            {/* Vendor Header with Avatar */}
                                            <div className="flex items-start gap-3 mb-3">
                                                <Avatar
                                                    src={vendor.avatar}
                                                    alt={`${vendor.first_name} ${vendor.last_name}`}
                                                    initials={initials}
                                                    size="md"
                                                    shape="circle"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                                                        {vendor.first_name} {vendor.last_name}
                                                    </h3>

                                                    {/* Email - Clickable */}
                                                    <a
                                                        href={`mailto:${vendor.email}`}
                                                        className="group flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors mb-1"
                                                    >
                                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate group-hover:underline">{vendor.email}</span>
                                                    </a>

                                                    {/* Phone - Clickable */}
                                                    {vendor.phone_number && (
                                                        <a
                                                            href={`tel:${vendor.phone_number}`}
                                                            className="group flex items-center gap-1.5 text-xs text-gray-600 hover:text-green-600 transition-colors"
                                                        >
                                                            <Phone className="w-3 h-3 flex-shrink-0" />
                                                            <span className="group-hover:underline">{vendor.phone_number}</span>
                                                        </a>
                                                    )}

                                                    {/* Company Details if available */}
                                                    {(vendor.company_name || vendor.company_email || vendor.company_phone) && (
                                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                                            {vendor.company_name && (
                                                                <p className="text-xs text-gray-700 font-medium mb-1">
                                                                    {vendor.company_name}
                                                                </p>
                                                            )}
                                                            {vendor.company_email && (
                                                                <a
                                                                    href={`mailto:${vendor.company_email}`}
                                                                    className="text-xs text-gray-500 hover:text-blue-600 block"
                                                                >
                                                                    {vendor.company_email}
                                                                </a>
                                                            )}
                                                            {vendor.company_phone && (
                                                                <a
                                                                    href={`tel:${vendor.company_phone}`}
                                                                    className="text-xs text-gray-500 hover:text-green-600 block"
                                                                >
                                                                    {vendor.company_phone}
                                                                </a>
                                                            )
                                                            }
                                                        </div>
                                                    )
                                                    }
                                                </div>

                                                {/* Availability Badge */}
                                                <TextBadge
                                                    variant="solid"
                                                    color={vendorItem.is_available ? "green" : "red"}
                                                    size="xs"
                                                >
                                                    {vendorItem.is_available ? 'Active' : 'Inactive'}
                                                </TextBadge>
                                            </div>

                                            {/* Pricing Grid */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="p-2.5 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                                                    <p className="text-xs text-blue-600 mb-0.5 font-medium">Price</p>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {formatCurrency(vendorItem.price)}
                                                    </p>
                                                </div>
                                                <div className="p-2.5 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                                                    <p className="text-xs text-green-600 mb-0.5 font-medium">Stock</p>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {vendorItem.stock} units
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div >
                    )
                    }

                    {/* Product Description */}
                    {product.description && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                                Description
                            </h2>
                            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                                <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Ingredients */}
                    {product.ingredients && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                                Ingredients / Composition
                            </h2>
                            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                                <p className="whitespace-pre-line leading-relaxed">{product.ingredients}</p>
                            </div>
                        </div>
                    )}

                    {/* Keywords */}
                    {product.keywords && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                                Keywords
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {product.keywords.split(',').map((keyword, index) => (
                                    <TextBadge key={index} variant="light" color="gray" size="sm">
                                        {keyword.trim()}
                                    </TextBadge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Statistics */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                            </div>
                            <span className="text-sm sm:text-base">Statistics</span>
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-blue-600 font-medium">Total Views</span>
                                    <Eye className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {formatCount(product.view_count) || 0}
                                </p>
                            </div>
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-green-600 font-medium">Total Sales</span>
                                    <ShoppingCart className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {product.sales_count?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Information - Enhanced */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                            </div>
                            <span className="text-sm sm:text-base">Pricing & Stock</span>
                        </h2>
                        <div className="space-y-3">
                            {/* Base Price */}
                            {product.base_price && (
                                <div className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                                    <p className="text-xs text-gray-600 mb-1 font-medium">Base Price</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                                        {formatCurrency(product.base_price)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Original pricing</p>
                                </div>
                            )}

                            {/* Current/Vendor Price */}
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200">
                                <p className="text-xs text-green-600 font-medium mb-1">Current Price</p>
                                <p className="text-lg sm:text-xl font-bold text-green-700">
                                    {formatCurrency(product.price)}
                                </p>
                                {basePriceSavings > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <TrendingDown className="w-3 h-3 text-green-600" />
                                        <p className="text-xs text-green-600 font-semibold">
                                            Save {basePriceSavings}% from base
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Sale Price */}
                            {product.discount_price && (
                                <div className="p-3 sm:p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200">
                                    <p className="text-xs text-red-600 font-medium mb-1">Sale Price</p>
                                    <p className="text-lg sm:text-xl font-bold text-red-600">
                                        {formatCurrency(product.discount_price)}
                                    </p>
                                    <p className="text-xs text-red-600 font-semibold mt-1">
                                        Save {discountPercent}% off
                                    </p>
                                </div>
                            )}

                            {/* Stock Information */}
                            <div className="grid grid-cols-2 gap-2">
                                {product.base_stock && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-600 mb-1">Base Stock</p>
                                        <p className="text-base font-bold text-gray-900">
                                            {product.base_stock}
                                        </p>
                                    </div>
                                )}
                                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-xs text-green-600 mb-1 font-medium">Available</p>
                                    <p className="text-base font-bold text-green-700">
                                        {product.stock}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Information */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                            Category
                        </h2>
                        <div className="space-y-3">
                            {product.category && (
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-600 mb-2 font-medium">Category</p>
                                    <div className="flex items-center gap-2">
                                        {product.category.image && (
                                            <img
                                                src={product.category.image}
                                                alt={product.category.title}
                                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                                            />
                                        )}
                                        <p className="text-sm font-semibold text-gray-900">
                                            {product.category.title}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {product.subcategory && (
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-600 mb-2 font-medium">Subcategory</p>
                                    <div className="flex items-center gap-2">
                                        {product.subcategory.image && (
                                            <img
                                                src={product.subcategory.image}
                                                alt={product.subcategory.title}
                                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                                            />
                                        )}
                                        <p className="text-sm font-semibold text-gray-900">
                                            {product.subcategory.title}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                            </div>
                            <span className="text-sm sm:text-base">Timeline</span>
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Created</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                    {formatDate(product.created_at)}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                    {formatDate(product.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

            {/* Delete Modal */}
            < DeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                product={product}
                onConfirm={handleDelete}
                isDeleting={deleteProduct.isPending}
            />
        </div >
    );
};

const ProductDetailsSkeleton = () => {
    return (
        <div className="w-full space-y-4 sm:space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="mb-4 sm:mb-6">
                        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-xl sm:rounded-2xl flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
                                    <div className="h-7 sm:h-8 w-64 bg-gray-300 rounded mb-3" />
                                    <div className="h-4 w-48 bg-gray-200 rounded mb-3" />
                                    <div className="flex flex-wrap gap-2">
                                        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                                        <div className="h-8 w-28 bg-gray-200 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-lg" />
                            <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-lg" />
                            <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Images Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="h-5 w-32 bg-gray-300 rounded mb-4" />
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-sm aspect-square bg-gray-200 rounded-xl mb-4" />
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 w-full max-w-md">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="h-5 w-32 bg-gray-300 rounded mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Stats Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="h-5 w-32 bg-gray-300 rounded mb-4" />
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                                    <div className="h-7 w-24 bg-gray-300 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="h-5 w-32 bg-gray-300 rounded mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                                    <div className="h-6 w-32 bg-gray-300 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vendor Skeleton */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="h-5 w-32 bg-gray-300 rounded mb-4" />
                        {[1, 2].map((i) => (
                            <div key={i} className="mb-4 last:mb-0">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                                        <div className="h-3 w-40 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDetails;