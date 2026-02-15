'use client';

import { useState, useMemo, useEffect, useCallback, useReducer, memo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
    Package,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Star,
    TrendingUp,
    DollarSign,
    Box,
    Tag,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Users,
    StarOff,
    Plus,
    Share2,
    Check,
} from 'lucide-react';
import { useAdminProducts, useBulkUpdateFeaturedProducts, useDeleteProduct } from '@/queries/products.query';
import { useCategories } from '@/queries/categories.query';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import InputForm from '@/components/form/InputForm';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import Paginator from '@/components/common/Paginator';
import ProductListSkeleton from './ProductListSkeleton';
import DeleteProductModal from './DeleteProductModal';
import { truncateText, unslugify } from '@/utils/helper';
import { useModal } from '@/hooks/useModal';

// ==================== CONSTANTS ====================
const PER_PAGE = 50;

const STATUS_OPTIONS = [
    { value: '', text: 'All Status' },
    { value: 'in_stock', text: 'In Stock' },
    { value: 'out_of_stock', text: 'Out of Stock' },
    { value: 'low_stock', text: 'Low Stock' },
];

const FEATURED_OPTIONS = [
    { value: '', text: 'All Products' },
    { value: 'true', text: 'Featured Only' },
    { value: 'false', text: 'Non-Featured' },
];

const STATUS_COLOR_MAP = {
    in_stock: 'green',
    out_of_stock: 'red',
    low_stock: 'orange',
};

// ==================== REDUCER ====================
const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, search: action.payload };
        case 'SET_CATEGORY':
            return { ...state, category_id: action.payload, subcategory_id: '' };
        case 'SET_SUBCATEGORY':
            return { ...state, subcategory_id: action.payload };
        case 'SET_STATUS':
            return { ...state, status: action.payload };
        case 'SET_FEATURED':
            return { ...state, is_featured: action.payload };
        case 'SET_SORT':
            return { ...state, sort_by: action.payload.column, sort_direction: action.payload.direction };
        case 'RESET':
            return action.payload;
        case 'SYNC_FROM_URL':
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

// ==================== UTILITY FUNCTIONS ====================
const getInitialFilters = (searchParams) => ({
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    subcategory_id: searchParams.get('subcategory_id') || '',
    status: searchParams.get('status') || '',
    is_featured: searchParams.get('is_featured') || '',
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_direction: searchParams.get('sort_direction') || 'desc',
});

const getStatusColor = (status) => STATUS_COLOR_MAP[status?.toLowerCase()] || 'gray';

const buildURLFromFilters = (filters, page) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
    });
    if (page > 1) params.set('page', page.toString());
    return params.toString();
};

// ==================== MEMOIZED SUB-COMPONENTS ====================

// Page Header Component
const PageHeader = memo(({ onShareFilters, isShared }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Products
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your product catalog
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                color={isShared ? 'green' : 'gray'}
                size="sm"
                onClick={onShareFilters}
                startIcon={isShared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                title="Copy shareable URL with current filters"
            >
                {isShared ? 'Link Copied!' : 'Share Filters'}
            </Button>
            <Button
                color="green"
                href="/dashboard/products/add"
                startIcon={<Plus className="w-5 h-5" />}
            >
                Add Product
            </Button>
        </div>
    </div>
));
PageHeader.displayName = 'PageHeader';

// Bulk Actions Bar Component
const BulkActionsBar = memo(({
    selectedCount,
    onMarkFeatured,
    onRemoveFeatured,
    onClear,
    isUpdating
}) => (
    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                        {selectedCount} Product{selectedCount !== 1 ? 's' : ''} Selected
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        Choose an action to apply to selected products
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <Button
                    variant="outline"
                    color="green"
                    size="sm"
                    onClick={onMarkFeatured}
                    startIcon={<Star className="w-4 h-4" />}
                    disabled={isUpdating}
                    loading={isUpdating}
                >
                    Mark Featured
                </Button>
                <Button
                    variant="outline"
                    color="gray"
                    size="sm"
                    onClick={onRemoveFeatured}
                    startIcon={<StarOff className="w-4 h-4" />}
                    disabled={isUpdating}
                    loading={isUpdating}
                >
                    Remove Featured
                </Button>
                <Button
                    variant="outline"
                    color="gray"
                    size="sm"
                    onClick={onClear}
                    startIcon={<X className="w-4 h-4" />}
                >
                    Clear
                </Button>
            </div>
        </div>
    </div>
));
BulkActionsBar.displayName = 'BulkActionsBar';

// Active Filters Summary Component
const ActiveFiltersSummary = memo(({ filters, categories, subcategories }) => {
    const hasActiveFilters = filters.search || filters.category_id ||
        filters.subcategory_id || filters.status || filters.is_featured;

    if (!hasActiveFilters) return null;

    return (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {filters.search && (
                <TextBadge variant="light" color="blue" size="sm">
                    Search: {truncateText(filters.search, 20)}
                </TextBadge>
            )}
            {filters.category_id && (
                <TextBadge variant="light" color="purple" size="sm">
                    Category: {categories.find(c => c.id === parseInt(filters.category_id))?.title}
                </TextBadge>
            )}
            {filters.subcategory_id && (
                <TextBadge variant="light" color="indigo" size="sm">
                    Subcategory: {subcategories.find(s => s.id === parseInt(filters.subcategory_id))?.title}
                </TextBadge>
            )}
            {filters.status && (
                <TextBadge variant="light" color={getStatusColor(filters.status)} size="sm">
                    Status: {STATUS_OPTIONS.find(s => s.value === filters.status)?.text}
                </TextBadge>
            )}
            {filters.is_featured && (
                <TextBadge variant="light" color="yellow" size="sm">
                    Featured: {FEATURED_OPTIONS.find(f => f.value === filters.is_featured)?.text}
                </TextBadge>
            )}
        </div>
    );
});
ActiveFiltersSummary.displayName = 'ActiveFiltersSummary';

// Sort Button Component
const SortButton = memo(({ column, currentColumn, direction, onClick, children }) => {
    const isActive = currentColumn === column;
    const Icon = !isActive ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown;
    const iconColor = isActive ? 'text-green-600' : 'text-gray-400';

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
            {children}
            <Icon className={`w-4 h-4 ${iconColor}`} />
        </button>
    );
});
SortButton.displayName = 'SortButton';

// Product Row Component
const ProductRow = memo(({
    product,
    isSelected,
    onSelect,
    onToggleFeatured,
    onDelete,
    isUpdating,
    isDeleting
}) => (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
        <TableCell className="px-6 py-4">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(product.id)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-3">
                <img
                    src={product.image || '/placeholder.png'}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    loading="lazy"
                />
                <div className="min-w-0">
                    <Link
                        href={`/dashboard/products/${product.slug}`}
                        className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors line-clamp-1"
                    >
                        {product.title}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {product.pack_size || 'N/A'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <TrendingUp className="w-3 h-3" />
                            {product.view_count || 0}
                        </div>
                        {product.badges?.[0] && (
                            <TextBadge variant="light" color="purple" size="xs">
                                {product.badges[0]}
                            </TextBadge>
                        )}
                    </div>
                </div>
            </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            {product.category ? (
                <TextBadge variant="light" color="blue" size="sm">
                    {truncateText(product.category.title, 15)}
                </TextBadge>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            {product.subcategory ? (
                <TextBadge variant="light" color="indigo" size="sm">
                    {truncateText(product.subcategory.title, 15)}
                </TextBadge>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            {product.brands ? (
                <TextBadge startIcon={<Tag />} variant="light" color="orange" size="sm">
                    {truncateText(product.brands, 12)}
                </TextBadge>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                    ₦{product.price?.toLocaleString() || '0'}
                </div>
                {product.discount_price && (
                    <div className="text-xs text-gray-500 line-through">
                        ₦{parseFloat(product.discount_price).toLocaleString()}
                    </div>
                )}
            </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-1">
                <Box className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {product.stock || 0}
                </span>
            </div>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            {product.has_vendor_pricing && product.vendors?.length > 0 ? (
                <TextBadge startIcon={<Users />} variant="light" color="purple" size="sm">
                    {product.vendors.length} vendor{product.vendors.length !== 1 ? 's' : ''}
                </TextBadge>
            ) : (
                <span className="text-xs text-gray-400">-</span>
            )}
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <button
                onClick={() => onToggleFeatured(product)}
                disabled={isUpdating}
                className="group relative"
                aria-label={product.is_featured ? 'Remove from featured' : 'Mark as featured'}
            >
                {product.is_featured ? (
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 hover:text-yellow-600 transition-colors" />
                ) : (
                    <Star className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-yellow-500 transition-colors" />
                )}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {product.is_featured ? 'Remove from featured' : 'Mark as featured'}
                </span>
            </button>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap">
            <TextBadge
                variant="light"
                color={getStatusColor(product.status)}
                size="sm"
                className="capitalize"
            >
                {unslugify(product.status)}
            </TextBadge>
        </TableCell>
        <TableCell className="px-6 py-4 whitespace-nowrap text-right">
            <div className="flex items-center justify-end gap-2">
                <IconBadge
                    variant="light"
                    color="blue"
                    size="sm"
                    shape="circle"
                    icon={<Eye className="w-4 h-4" />}
                    href={`/dashboard/products/${product.slug}`}
                    ariaLabel="View product"
                />
                <IconBadge
                    variant="light"
                    color="green"
                    size="sm"
                    shape="circle"
                    icon={<Edit className="w-4 h-4" />}
                    href={`/dashboard/products/${product.slug}/edit`}
                    ariaLabel="Edit product"
                />
                <IconBadge
                    variant="light"
                    color="red"
                    size="sm"
                    shape="circle"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => onDelete(product)}
                    disabled={isDeleting}
                    ariaLabel="Delete product"
                />
            </div>
        </TableCell>
    </TableRow>
));
ProductRow.displayName = 'ProductRow';

// ==================== MAIN COMPONENT ====================
const AdminProductList = () => {
    const searchParams = useSearchParams();

    // Initialize filters from URL only once on mount
    const initialFiltersRef = useRef(getInitialFilters(searchParams));
    const initialPageRef = useRef(parseInt(searchParams.get('page') || '1'));

    // State management - DECOUPLED from router
    const [filters, dispatchFilters] = useReducer(filterReducer, initialFiltersRef.current);
    const [page, setPage] = useState(initialPageRef.current);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isShared, setIsShared] = useState(false);

    // Modal states
    const deleteModal = useModal(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Form
    const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: filters,
    });

    // Watch form values
    const categoryValue = watch('category_id');
    const subcategoryValue = watch('subcategory_id');
    const statusValue = watch('status');
    const featuredValue = watch('is_featured');

    // Fetch data
    const { data: categoriesData } = useCategories();
    const categories = useMemo(() => categoriesData || [], [categoriesData]);

    const subcategories = useMemo(() => {
        if (!categoryValue) return [];
        const selectedCategory = categories.find(c => c.id === parseInt(categoryValue));
        return selectedCategory?.subcategory || [];
    }, [categoryValue, categories]);

    const categoryOptions = useMemo(() => [
        { value: '', text: 'All Categories' },
        ...categories.map(cat => ({ value: cat.id.toString(), text: cat.title }))
    ], [categories]);

    const subcategoryOptions = useMemo(() => [
        { value: '', text: 'All Subcategories' },
        ...subcategories.map(sub => ({ value: sub.id.toString(), text: sub.title }))
    ], [subcategories]);

    // Active filters for API - This is what triggers data fetching
    const activeFilters = useMemo(() => ({
        search: filters.search,
        category_id: filters.category_id,
        subcategory_id: filters.subcategory_id,
        status: filters.status,
        is_featured: filters.is_featured,
        sort_by: filters.sort_by,
        sort_direction: filters.sort_direction,
        page,
        per_page: PER_PAGE,
    }), [filters, page]);

    const hasActiveFilters = useMemo(() =>
        filters.search || filters.category_id || filters.subcategory_id || filters.status || filters.is_featured,
        [filters]
    );

    // Fetch products - NO router dependency
    const { data, isLoading, isError, error } = useAdminProducts(activeFilters);
    const { mutateAsync: updateProduct, isPending: isUpdating } = useBulkUpdateFeaturedProducts();
    const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

    const products = useMemo(() => data?.data || [], [data?.data]);
    const meta = useMemo(() => data?.meta || {}, [data?.meta]);
    const links = useMemo(() => data?.links || [], [data?.links]);

    // NO automatic URL syncing - router is completely disconnected from filters!
    // This prevents the re-render loop

    // Handle form changes - NO router updates
    useEffect(() => {
        if (categoryValue !== filters.category_id) {
            dispatchFilters({ type: 'SET_CATEGORY', payload: categoryValue });
            setValue('subcategory_id', '');
            setPage(1);
        }
    }, [categoryValue, filters.category_id, setValue]);

    useEffect(() => {
        if (subcategoryValue !== filters.subcategory_id) {
            dispatchFilters({ type: 'SET_SUBCATEGORY', payload: subcategoryValue });
            setPage(1);
        }
    }, [subcategoryValue, filters.subcategory_id]);

    useEffect(() => {
        if (statusValue !== filters.status) {
            dispatchFilters({ type: 'SET_STATUS', payload: statusValue });
            setPage(1);
        }
    }, [statusValue, filters.status]);

    useEffect(() => {
        if (featuredValue !== filters.is_featured) {
            dispatchFilters({ type: 'SET_FEATURED', payload: featuredValue });
            setPage(1);
        }
    }, [featuredValue, filters.is_featured]);

    useEffect(() => {
        setSelectAll(selectedProducts.length === products.length && products.length > 0);
    }, [selectedProducts.length, products.length]);

    // ==================== HANDLERS ====================

    const handleSearchSubmit = useCallback((data) => {
        dispatchFilters({ type: 'SET_SEARCH', payload: data.search });
        setPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        const defaultFilters = {
            search: '', category_id: '', subcategory_id: '', status: '', is_featured: '',
            sort_by: 'created_at', sort_direction: 'desc',
        };
        setValue('search', ''); setValue('category_id', ''); setValue('subcategory_id', '');
        setValue('status', ''); setValue('is_featured', '');
        dispatchFilters({ type: 'RESET', payload: defaultFilters });
        setPage(1);
    }, [setValue]);

    const handleSort = useCallback((column) => {
        const newDirection = filters.sort_by === column && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        dispatchFilters({ type: 'SET_SORT', payload: { column, direction: newDirection } });
        setPage(1);
    }, [filters.sort_by, filters.sort_direction]);

    const handleSelectAll = useCallback(() => {
        setSelectedProducts(selectAll ? [] : products.map(p => p.id));
        setSelectAll(!selectAll);
    }, [selectAll, products]);

    const handleSelectProduct = useCallback((productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    }, []);

    const handleToggleFeatured = useCallback((product) => {
        updateProduct({ product_ids: [product.id], is_featured: !product.is_featured });
    }, [updateProduct]);

    const handleBulkFeatured = useCallback(async (isFeatured) => {
        try {
            await updateProduct({ product_ids: selectedProducts, is_featured: isFeatured });
            setSelectedProducts([]);
            setSelectAll(false);
        } catch (error) { }
    }, [selectedProducts, updateProduct]);

    const handleDeleteProduct = useCallback((product) => {
        setSelectedProduct(product);
        deleteModal.openModal();
    }, [deleteModal]);

    const confirmDelete = useCallback((productId) => {
        deleteProduct(productId, {
            onSuccess: () => {
                deleteModal.closeModal();
                setSelectedProduct(null);
            },
        });
    }, [deleteProduct, deleteModal]);

    const handlePageChange = useCallback((newPage) => {
        setPage(parseInt(newPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedProducts([]);
        setSelectAll(false);
    }, []);

    // Share filters - manually sync to URL and copy link
    const handleShareFilters = useCallback(() => {
        const urlParams = buildURLFromFilters(filters, page);
        const shareableUrl = `${window.location.origin}${window.location.pathname}?${urlParams}`;

        // Update URL without triggering re-render
        window.history.replaceState({}, '', `?${urlParams}`);

        // Copy to clipboard
        navigator.clipboard.writeText(shareableUrl).then(() => {
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        });
    }, [filters, page]);

    // ==================== RENDER ====================

    return (
        <div className="space-y-6 my-10">
            {/* Page Header */}
            <PageHeader onShareFilters={handleShareFilters} isShared={isShared} />

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedProducts.length}
                    onMarkFeatured={() => handleBulkFeatured(true)}
                    onRemoveFeatured={() => handleBulkFeatured(false)}
                    onClear={handleClearSelection}
                    isUpdating={isUpdating}
                />
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                    {hasActiveFilters && (
                        <Button variant="outline" color="gray" size="sm" onClick={handleClearFilters} className="ml-auto">
                            Clear All
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit(handleSearchSubmit)} className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <InputForm
                                name="search"
                                type="text"
                                register={register}
                                error={errors.search?.message}
                                placeholder="Search by title, brand, or keywords..."
                            />
                        </div>
                        <Button type="submit" color="green" size="md" startIcon={<Search className="w-4 h-4" />}>
                            Search
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <SingleSelectForm
                            name="category_id"
                            placeholder="Filter by category"
                            options={categoryOptions}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={categoryValue}
                        />
                        <SingleSelectForm
                            name="subcategory_id"
                            placeholder="Filter by subcategory"
                            options={subcategoryOptions}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={subcategoryValue}
                            disabled={!categoryValue}
                        />
                        <SingleSelectForm
                            name="status"
                            placeholder="Filter by status"
                            options={STATUS_OPTIONS}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={statusValue}
                        />
                        <SingleSelectForm
                            name="is_featured"
                            placeholder="Filter by featured"
                            options={FEATURED_OPTIONS}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={featuredValue}
                        />
                    </div>
                </form>

                <ActiveFiltersSummary filters={filters} categories={categories} subcategories={subcategories} />
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoading && <ProductListSkeleton />}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to Load Products</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                            {error?.response?.data?.message || 'An error occurred while fetching products'}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Products Found</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            {hasActiveFilters
                                ? 'No products match your current filters. Try adjusting your search criteria.'
                                : 'Get started by adding your first product to the catalog.'}
                        </p>
                        {hasActiveFilters ? (
                            <Button variant="outline" color="gray" onClick={handleClearFilters}>Clear Filters</Button>
                        ) : (
                            <Button color="green" href="/dashboard/products/add" startIcon={<Plus className="w-4 h-4" />}>
                                Add Product
                            </Button>
                        )}
                    </div>
                )}

                {!isLoading && !isError && products.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                    <TableRow>
                                        <TableCell isHeader className="px-6 py-3 w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <SortButton column="title" currentColumn={filters.sort_by} direction={filters.sort_direction} onClick={() => handleSort('title')}>
                                                Product
                                            </SortButton>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subcategory</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Brand</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <SortButton column="price" currentColumn={filters.sort_by} direction={filters.sort_direction} onClick={() => handleSort('price')}>
                                                Price
                                            </SortButton>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <SortButton column="stock" currentColumn={filters.sort_by} direction={filters.sort_direction} onClick={() => handleSort('stock')}>
                                                Stock
                                            </SortButton>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendors</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Featured</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {products.map((product) => (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            isSelected={selectedProducts.includes(product.id)}
                                            onSelect={handleSelectProduct}
                                            onToggleFeatured={handleToggleFeatured}
                                            onDelete={handleDeleteProduct}
                                            isUpdating={isUpdating}
                                            isDeleting={isDeleting}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {meta.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <Paginator paginationData={meta} links={links} setPage={handlePageChange} limit={3} />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Modal */}
            <DeleteProductModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                product={selectedProduct}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default memo(AdminProductList);