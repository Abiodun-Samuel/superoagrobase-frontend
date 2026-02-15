'use client';

import React, { useState, useMemo, useCallback, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
    Package,
    Sparkles,
    ChevronRight,
    ArrowRight,
    X,
    Search,
    Trash2,
    ShoppingBag,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useAddVendorProducts } from '@/queries/vendor.query';
import { useProducts } from '@/queries/products.query';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import InputForm from '@/components/form/InputForm';
import SwitchForm from '@/components/form/SwitchForm';
import Paginator from '../common/Paginator';
import useAuth from '@/hooks/useAuth';
import Alert from '../common/Alert';

// ============================================
// Table Row Skeleton Loader
// ============================================
const TableRowSkeleton = memo(() => (
    <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-6 py-4 w-12">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
        </td>
        <td className="px-6 py-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
        </td>
    </tr>
));

TableRowSkeleton.displayName = 'TableRowSkeleton';

// ============================================
// Filters Component
// ============================================
const ProductFilters = memo(({ filters, onFilterChange, onReset, selectedCount, onClearAll }) => {
    const { register, watch, setValue, formState: { errors }, handleSubmit } = useForm({
        defaultValues: filters
    });

    const sortOptions = useMemo(() => [
        { value: 'newest', text: 'Newest First' },
        { value: 'oldest', text: 'Oldest First' },
        { value: 'name_asc', text: 'Name: A-Z' },
        { value: 'name_desc', text: 'Name: Z-A' },
    ], []);

    const perPageOptions = useMemo(() => [
        { value: '12', text: '12 per page' },
        { value: '24', text: '24 per page' },
        { value: '50', text: '50 per page' },
        { value: '100', text: '100 per page' },
    ], []);

    const searchValue = watch('search');
    const sortValue = watch('sort');
    const perPageValue = watch('per_page');

    useEffect(() => {
        if (sortValue !== filters.sort) {
            onFilterChange({ sort: sortValue });
        }
    }, [sortValue, filters.sort, onFilterChange]);

    useEffect(() => {
        if (perPageValue !== filters.per_page) {
            onFilterChange({ per_page: perPageValue });
        }
    }, [perPageValue, filters.per_page, onFilterChange]);

    const handleSearchSubmit = useCallback((data) => {
        onFilterChange({ search: data.search });
    }, [onFilterChange]);

    const handleReset = useCallback(() => {
        setValue('search', '');
        setValue('sort', 'newest');
        setValue('per_page', '50');
        onReset();
    }, [setValue, onReset]);

    const hasActiveFilters = searchValue || sortValue !== 'newest' || perPageValue !== '50';

    return (
        <div className="bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 rounded-lg shadow">
            <div className="flex flex-col gap-3">
                {/* Search and Clear */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSubmit(handleSearchSubmit)} className="flex-1 flex gap-2">
                        <div className="flex-1">
                            <InputForm
                                name="search"
                                type="text"
                                register={register}
                                error={errors.search?.message}
                                placeholder="Search by name, category, brand, or pack size..."
                            />
                        </div>
                        <Button
                            type="submit"
                            color="green"
                            size="md"
                            startIcon={<Search className="w-4 h-4" />}
                        >
                            Search
                        </Button>
                    </form>

                    {selectedCount > 0 && (
                        <Button
                            variant="outline"
                            color="red"
                            size="md"
                            onClick={onClearAll}
                            startIcon={<X className="w-4 h-4" />}
                        >
                            Clear ({selectedCount})
                        </Button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
                        <div className="w-44">
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

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</span>
                        <div className="w-44">
                            <SingleSelectForm
                                name="per_page"
                                options={perPageOptions}
                                register={register}
                                setValue={setValue}
                                placeholder="Per page"
                                searchable={false}
                                defaultValue={filters.per_page || '50'}
                            />
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            color="gray"
                            size="sm"
                            onClick={handleReset}
                            startIcon={<X className="w-4 h-4" />}
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});

ProductFilters.displayName = 'ProductFilters';

// ============================================
// Product Table Row Component
// ============================================
const ProductTableRow = memo(({ product, isSelected, onToggle }) => {
    const handleRowClick = useCallback((e) => {
        // Prevent toggle when clicking on links or interactive elements
        if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'INPUT') {
            return;
        }
        onToggle();
    }, [onToggle]);

    const handleCheckboxClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <tr
            onClick={handleRowClick}
            className={`border-b border-gray-200 dark:border-gray-700 transition-all cursor-pointer group ${isSelected
                ? 'bg-green-50 dark:bg-green-950/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
        >
            <td className="px-6 py-4 w-12" onClick={handleCheckboxClick}>
                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={onToggle}
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0 cursor-pointer transition-transform hover:scale-110"
                        aria-label={`Select ${product.title}`}
                    />
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                        <img
                            src={product.image || '/placeholder.png'}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-md transition-shadow"
                        />
                        {product.is_featured && (
                            <div className="absolute -top-1 -right-1">
                                <div className="bg-orange-500 rounded-full p-1 shadow-lg">
                                    <Sparkles className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-semibold text-gray-900 dark:text-gray-100 text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1 group/link w-fit"
                        >
                            <span className="truncate">{product.title}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                        </Link>
                        {product.sub_title && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                {product.sub_title}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                {product.description ? (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
                        {product.description}
                    </p>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </td>

            <td className="px-6 py-4">
                {product.pack_size ? (
                    <TextBadge size="xs" variant="light" color="purple">
                        {product.pack_size}
                    </TextBadge>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </td>

            <td className="px-6 py-4">
                {product.brands ? (
                    <TextBadge size="xs" variant="light" color="orange">
                        {product.brands}
                    </TextBadge>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </td>

            <td className="px-6 py-4">
                {product.category?.title ? (
                    <TextBadge size="xs" variant="light" color="blue">
                        {product.category.title}
                    </TextBadge>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </td>

            <td className="px-6 py-4">
                {product.subcategory?.title ? (
                    <TextBadge size="xs" variant="light" color="indigo">
                        {product.subcategory.title}
                    </TextBadge>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </td>
        </tr>
    );
});

ProductTableRow.displayName = 'ProductTableRow';

// ============================================
// Empty State Component
// ============================================
const EmptyState = memo(({ hasFilters, onClearFilters }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full blur-2xl opacity-50" />
                <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-full border-4 border-white dark:border-gray-700 shadow-xl">
                    <Package className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
                {hasFilters ? 'No Products Match Your Search' : 'No Products Available'}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8 leading-relaxed">
                {hasFilters
                    ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                    : 'Our product inventory is currently being updated. Please check back soon.'
                }
            </p>

            {hasFilters && (
                <Button
                    variant="outline"
                    color="gray"
                    onClick={onClearFilters}
                    startIcon={<X className="w-4 h-4" />}
                >
                    Clear Filters
                </Button>
            )}
        </div>
    </div>
));

EmptyState.displayName = 'EmptyState';

// ============================================
// Optimized Product Settings Item Component
// ============================================
const ProductSettingsItem = memo(({
    product,
    settings,
    onUpdate,
    onRemove,
    index
}) => {
    const { control } = useForm();

    // Validation helpers
    const validatePrice = useCallback((value) => {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
    }, []);

    const validateStock = useCallback((value) => {
        const numValue = parseInt(value);
        return !isNaN(numValue) && numValue > 0;
    }, []);

    // Debounced handlers with validation
    const handlePriceChange = useCallback((e) => {
        const value = e.target.value;
        if (value === '' || validatePrice(value)) {
            onUpdate(product.id, 'price', value);
        }
    }, [product.id, onUpdate, validatePrice]);

    const handleStockChange = useCallback((e) => {
        const value = e.target.value;
        if (value === '' || validateStock(value)) {
            onUpdate(product.id, 'stock', value);
        }
    }, [product.id, onUpdate, validateStock]);

    const handleAvailabilityChange = useCallback((checked) => {
        onUpdate(product.id, 'is_available', checked);
    }, [product.id, onUpdate]);

    const handleRemoveClick = useCallback(() => {
        onRemove(product.id);
    }, [product.id, onRemove]);

    // Validation errors
    const priceError = settings.price !== '' && !validatePrice(settings.price);
    const stockError = settings.stock !== '' && !validateStock(settings.stock);

    return (
        <div
            className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all animate-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            {/* Product Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <img
                    src={product.image || '/placeholder.png'}
                    alt={product.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate">
                        {product.title}
                    </h3>
                    {product.sub_title && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {product.sub_title}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleRemoveClick}
                    className="p-1.5 sm:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    aria-label={`Remove ${product.title}`}
                >
                    <Trash2 className="w-4 h-4 text-red-600" />
                </button>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Price */}
                <div className="sm:col-span-1">
                    <InputForm
                        label="Price (₦)"
                        name={`price_${product.id}`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        register={() => ({
                            value: settings.price || '',
                            onChange: handlePriceChange
                        })}
                        error={priceError ? 'Price must be greater than 0' : ''}
                        required
                    />
                </div>

                {/* Stock */}
                <div className="sm:col-span-1">
                    <InputForm
                        label="Stock"
                        name={`stock_${product.id}`}
                        type="number"
                        min="1"
                        placeholder="0"
                        register={() => ({
                            value: settings.stock || '',
                            onChange: handleStockChange
                        })}
                        error={stockError ? 'Stock must be greater than 0' : ''}
                        required
                    />
                </div>

                {/* Availability Switch */}
                <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-[6.5px]">
                        <SwitchForm
                            label="Available for Sale"
                            name={`is_available_${product.id}`}
                            control={control}
                            defaultValue={settings.is_available ?? true}
                            color="green"
                            onChange={handleAvailabilityChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

ProductSettingsItem.displayName = 'ProductSettingsItem';

// ============================================
// Product Settings Modal Component
// ============================================
const ProductSettingsModal = memo(({
    selectedProducts,
    productSettings,
    onUpdate,
    onSave,
    onCancel,
    onRemove,
    isSaving,
    isError,
    error
}) => {
    const canSave = useMemo(() => {
        if (selectedProducts.length === 0) return false;

        return selectedProducts.every(product => {
            const settings = productSettings[product.id];
            if (!settings) return false;

            const price = parseFloat(settings.price);
            const stock = parseInt(settings.stock);

            return settings.price &&
                settings.stock !== undefined &&
                settings.stock !== '' &&
                !isNaN(price) &&
                !isNaN(stock) &&
                price > 0 &&
                stock > 0;
        });
    }, [selectedProducts, productSettings]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-900 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1.5 sm:p-2 bg-green-600 rounded-lg flex-shrink-0">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                                    Configure Products
                                </h2>
                                <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">
                                    {selectedProducts.length} item{selectedProducts.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                        {selectedProducts.map((product, index) => (
                            <ProductSettingsItem
                                key={product.id}
                                product={product}
                                settings={productSettings[product.id] || {}}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                                index={index}
                            />
                        ))}
                    </div>
                    {isError && <Alert className='mt-5' error={error} />}
                </div>


                {/* Footer */}
                <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl flex-shrink-0">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                            {canSave ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="font-medium text-green-700 dark:text-green-400">Ready to add</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                    <span className="font-medium text-orange-700 dark:text-orange-400">
                                        Price and stock must be greater than 0
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                variant="outline"
                                color="gray"
                                onClick={onCancel}
                                disabled={isSaving}
                                className="flex-1 sm:flex-initial"
                            >
                                Cancel
                            </Button>
                            <Button
                                color="green"
                                onClick={onSave}
                                disabled={!canSave}
                                loading={isSaving}
                                endIcon={<ArrowRight className="w-4 h-4" />}
                                className="flex-1 sm:flex-initial"
                            >
                                Add to Catalog
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProductSettingsModal.displayName = 'ProductSettingsModal';

// ============================================
// Main Component
// ============================================
const AddVendorProducts = ({ vendorId }) => {
    const router = useRouter();
    const { user } = useAuth();

    const [filters, setFilters] = useState({
        search: '',
        sort: 'newest',
        per_page: '50',
        page: 1
    });

    const [selectedProductIds, setSelectedProductIds] = useState(new Set());
    const [selectedProductsMap, setSelectedProductsMap] = useState(new Map());
    const [productSettings, setProductSettings] = useState({});
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const { data: productsData, isLoading } = useProducts({
        in_stock: true,
        search: filters.search,
        sort: filters.sort,
        per_page: parseInt(filters.per_page),
        page: filters.page
    });

    const allProducts = useMemo(() => productsData?.data || [], [productsData]);
    const meta = useMemo(() => productsData?.meta || {}, [productsData]);
    const links = useMemo(() => productsData?.links || [], [productsData]);

    const { mutate: addProducts, isPending: isAdding, isSuccess: isAddSuccess, isError, error } = useAddVendorProducts();

    useEffect(() => {
        if (isAddSuccess) {
            const href = vendorId ? `/account/products?vendor_id=${vendorId}` : '/account/products'
            router.push(href);
        }
    }, [isAddSuccess, router]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1
        }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({
            search: '',
            sort: 'newest',
            per_page: '50',
            page: 1
        });
    }, []);

    const handlePageChange = useCallback((page) => {
        setFilters(prev => ({ ...prev, page: parseInt(page) }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const toggleProduct = useCallback((product) => {
        setSelectedProductIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(product.id)) {
                newSet.delete(product.id);
                setSelectedProductsMap(prevMap => {
                    const newMap = new Map(prevMap);
                    newMap.delete(product.id);
                    return newMap;
                });
                setProductSettings(settings => {
                    const { [product.id]: removed, ...rest } = settings;
                    return rest;
                });
            } else {
                newSet.add(product.id);
                setSelectedProductsMap(prevMap => {
                    const newMap = new Map(prevMap);
                    newMap.set(product.id, product);
                    return newMap;
                });
                if (!productSettings[product.id]) {
                    setProductSettings(settings => ({
                        ...settings,
                        [product.id]: { price: '', stock: '', is_available: true }
                    }));
                }
            }
            return newSet;
        });
    }, [productSettings]);

    const updateProductSetting = useCallback((productId, field, value) => {
        setProductSettings(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: value
            }
        }));
    }, []);

    const removeProduct = useCallback((productId) => {
        setSelectedProductIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
        });
        setSelectedProductsMap(prevMap => {
            const newMap = new Map(prevMap);
            newMap.delete(productId);
            return newMap;
        });
        setProductSettings(settings => {
            const { [productId]: removed, ...rest } = settings;
            return rest;
        });
    }, []);

    const clearAll = useCallback(() => {
        setSelectedProductIds(new Set());
        setSelectedProductsMap(new Map());
        setProductSettings({});
    }, []);

    const handleContinue = useCallback(() => {
        setShowSettingsModal(true);
    }, []);

    const handleSave = useCallback(() => {
        const formattedData = Array.from(selectedProductIds).map(productId => {
            const settings = productSettings[productId];
            return {
                product_id: productId,
                price: parseFloat(settings.price),
                stock: parseInt(settings.stock),
                is_available: settings.is_available ?? true,
                vendor_id: vendorId || user?.id,
            };
        });
        addProducts(formattedData);
    }, [selectedProductIds, productSettings, addProducts, user?.id, vendorId]);

    const selectedCount = selectedProductIds.size;
    const selectedProductsArray = useMemo(() =>
        Array.from(selectedProductsMap.values()),
        [selectedProductsMap]
    );

    const handleSelectAll = useCallback((e) => {
        if (e.target.checked) {
            const newIds = new Set(selectedProductIds);
            const newMap = new Map(selectedProductsMap);
            const newSettings = { ...productSettings };

            allProducts.forEach(p => {
                newIds.add(p.id);
                newMap.set(p.id, p);
                if (!newSettings[p.id]) {
                    newSettings[p.id] = { price: '', stock: '', is_available: true };
                }
            });

            setSelectedProductIds(newIds);
            setSelectedProductsMap(newMap);
            setProductSettings(newSettings);
        } else {
            const newIds = new Set(selectedProductIds);
            const newMap = new Map(selectedProductsMap);
            const newSettings = { ...productSettings };

            allProducts.forEach(p => {
                newIds.delete(p.id);
                newMap.delete(p.id);
                delete newSettings[p.id];
            });

            setSelectedProductIds(newIds);
            setSelectedProductsMap(newMap);
            setProductSettings(newSettings);
        }
    }, [allProducts, selectedProductIds, selectedProductsMap, productSettings]);

    const isAllSelected = useMemo(() =>
        allProducts.length > 0 && allProducts.every(p => selectedProductIds.has(p.id)),
        [allProducts, selectedProductIds]
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 space-y-10 my-10">
            {/* Filters */}
            <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                selectedCount={selectedCount}
                onClearAll={clearAll}
            />

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 w-12">{''}
                                            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pack Size</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Brand</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subcategory</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {[...Array(8)].map((_, i) => (
                                        <TableRowSkeleton key={i} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : allProducts.length === 0 ? (
                    <EmptyState hasFilters={!!filters.search} onClearFilters={handleResetFilters} />
                ) : (
                    <>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={isAllSelected}
                                                    onChange={handleSelectAll}
                                                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-offset-0 cursor-pointer"
                                                    aria-label="Select all products"
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Pack Size</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Brand</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subcategory</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {allProducts.map((product) => (
                                            <ProductTableRow
                                                key={product.id}
                                                product={product}
                                                isSelected={selectedProductIds.has(product.id)}
                                                onToggle={() => toggleProduct(product)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {meta.last_page > 1 && (
                            <div className="">
                                <Paginator
                                    paginationData={meta}
                                    links={links}
                                    setPage={handlePageChange}
                                    limit={3}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Fixed Bottom Bar */}
            {selectedCount > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-green-500 shadow-2xl z-40 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex p-2 bg-green-600 rounded-lg shadow-lg">
                                    <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {selectedCount} Product{selectedCount !== 1 ? 's' : ''} Selected
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                                        Configure pricing next
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Button
                                    variant="outline"
                                    color="gray"
                                    size="sm"
                                    onClick={clearAll}
                                    startIcon={<X className="w-4 h-4" />}
                                    className="hidden sm:flex"
                                >
                                    Clear
                                </Button>

                                <Button
                                    color="green"
                                    size="md"
                                    onClick={handleContinue}
                                    endIcon={<ArrowRight className="w-4 h-4" />}
                                    className="shadow-lg"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <ProductSettingsModal
                    selectedProducts={selectedProductsArray}
                    productSettings={productSettings}
                    onUpdate={updateProductSetting}
                    onRemove={removeProduct}
                    onSave={handleSave}
                    onCancel={() => setShowSettingsModal(false)}
                    isSaving={isAdding}
                    isError={isError}
                    error={error}
                />
            )}
        </div>
    );
};

export default AddVendorProducts;