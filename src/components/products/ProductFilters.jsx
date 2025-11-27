'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useCategories } from '@/queries/categories.query';
import { useRouter } from 'next/navigation';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First', icon: '🆕' },
    { value: 'oldest', label: 'Oldest First', icon: '📅' },
    { value: 'price_asc', label: 'Price: Low to High', icon: '💰' },
    { value: 'price_desc', label: 'Price: High to Low', icon: '💎' },
    { value: 'name_asc', label: 'Name: A to Z', icon: '🔤' },
    { value: 'name_desc', label: 'Name: Z to A', icon: '🔡' },
    { value: 'popular', label: 'Most Popular', icon: '🔥' }
];

const PER_PAGE_OPTIONS = [
    { value: 20, label: '20 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
    { value: 150, label: '150 per page' }
];

export default function ProductFilters({
    currentFilters = {},
    onFilterChange,
    onClose,
    isLoading = false,
    isOpen = false
}) {
    const router = useRouter();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

    const [filters, setFilters] = useState({
        category: currentFilters.category || '',
        subcategory: currentFilters.subcategory || '',
        search: currentFilters.search || '',
        sort: currentFilters.sort || 'newest',
        per_page: currentFilters.per_page || 50,
        brand: currentFilters.brand || '',
        minPrice: currentFilters.minPrice || '',
        maxPrice: currentFilters.maxPrice || '',
        inStock: currentFilters.inStock || false
    });

    // Get subcategories for selected category
    const selectedCategory = categories.find(cat => cat.slug === filters.category);
    const subcategories = selectedCategory?.subcategory || [];

    // Sync with currentFilters when they change
    useEffect(() => {
        setFilters({
            category: currentFilters.category || '',
            subcategory: currentFilters.subcategory || '',
            search: currentFilters.search || '',
            sort: currentFilters.sort || 'newest',
            per_page: currentFilters.per_page || 50,
            brand: currentFilters.brand || '',
            minPrice: currentFilters.minPrice || '',
            maxPrice: currentFilters.maxPrice || '',
            inStock: currentFilters.inStock || false
        });
    }, [currentFilters]);

    /**
     * Handle input changes
     */
    const handleChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            ...(key === 'category' && { subcategory: '' })
        }));
    };

    /**
     * Apply filters
     */
    const handleApply = () => {
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== '' && value !== false) {
                acc[key] = value;
            }
            return acc;
        }, {});

        onFilterChange(cleanFilters);
    };

    /**
     * Clear all filters
     */
    const handleClear = () => {
        const resetFilters = {
            category: '',
            subcategory: '',
            search: '',
            sort: 'newest',
            per_page: 50,
            brand: '',
            minPrice: '',
            maxPrice: '',
            inStock: false
        };
        setFilters(resetFilters);
        onFilterChange({});
        router.push('/products');
    };

    /**
     * Handle Enter key press
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    const hasActiveFilters =
        filters.search ||
        filters.category ||
        filters.subcategory ||
        filters.brand ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.inStock ||
        filters.sort !== 'newest' ||
        filters.per_page !== 50;

    const activeFilterCount = [
        filters.search,
        filters.category,
        filters.subcategory,
        filters.brand,
        filters.minPrice,
        filters.maxPrice,
        filters.inStock,
        filters.sort !== 'newest',
        filters.per_page !== 50
    ].filter(Boolean).length;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Filter Panel */}
            <div className={`
                fixed lg:relative top-0 right-0 h-screen lg:h-auto
                w-full sm:w-96 lg:w-full
                bg-white lg:bg-transparent
                z-50 lg:z-auto
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
                <div className="lg:relative lg:bg-white lg:rounded-2xl lg:shadow lg:border lg:border-gray-100">
                    {/* Header */}
                    <div className="relative top-0 bg-gradient-to-r from-green-600 to-green-700 lg:rounded-t-2xl px-6 py-4 lg:py-5 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        Filters & Sort
                                    </h2>
                                    {activeFilterCount > 0 && (
                                        <p className="text-xs text-green-100">
                                            {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="lg:hidden text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                                aria-label="Close filters"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Filters Content */}
                    <div className="p-6 space-y-6">
                        {/* Search Filter */}
                        <div className="space-y-2">
                            <label htmlFor="search" className="block text-sm font-semibold text-gray-900">
                                🔍 Search Products
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="search"
                                    value={filters.search}
                                    onChange={(e) => handleChange('search', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Search by name, keywords..."
                                    className="w-full pl-11 pr-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm group-hover:border-gray-300"
                                />
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="space-y-2">
                            <label htmlFor="sort" className="block text-sm font-semibold text-gray-900">
                                📊 Sort By
                            </label>
                            <select
                                id="sort"
                                value={filters.sort}
                                onChange={(e) => handleChange('sort', e.target.value)}
                                className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.icon} {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Per Page */}
                        <div className="space-y-2">
                            <label htmlFor="per_page" className="block text-sm font-semibold text-gray-900">
                                📄 Items Per Page
                            </label>
                            <select
                                id="per_page"
                                value={filters.per_page}
                                onChange={(e) => handleChange('per_page', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                            >
                                {PER_PAGE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-gray-100" />

                        {/* Category Filter */}
                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
                                📦 Category
                            </label>
                            {categoriesLoading ? (
                                <div className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl bg-gray-50">
                                    <div className="animate-pulse h-5 bg-gray-200 rounded"></div>
                                </div>
                            ) : (
                                <select
                                    id="category"
                                    value={filters.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 bg-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Subcategory Filter */}
                        <div className="space-y-2">
                            <label htmlFor="subcategory" className="block text-sm font-semibold text-gray-900">
                                📂 Subcategory
                            </label>
                            <select
                                id="subcategory"
                                value={filters.subcategory}
                                onChange={(e) => handleChange('subcategory', e.target.value)}
                                disabled={!filters.category || subcategories.length === 0}
                                className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <option value="">All Subcategories</option>
                                {subcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.slug}>
                                        {subcategory.title}
                                    </option>
                                ))}
                            </select>
                            {!filters.category && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Select a category first
                                </p>
                            )}
                        </div>

                        {/* Brand Filter */}
                        <div className="space-y-2">
                            <label htmlFor="brand" className="block text-sm font-semibold text-gray-900">
                                🏷️ Brand
                            </label>
                            <input
                                type="text"
                                id="brand"
                                value={filters.brand}
                                onChange={(e) => handleChange('brand', e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Filter by brand name..."
                                className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                            />
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                💵 Price Range
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleChange('minPrice', e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleChange('maxPrice', e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-4 py-3 border-1 border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* In Stock Only */}
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-1 border-green-100">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={filters.inStock}
                                onChange={(e) => handleChange('inStock', e.target.checked)}
                                className="w-5 h-5 text-green-600 border-1 border-gray-300 rounded   cursor-pointer"
                            />
                            <label htmlFor="inStock" className="flex-1 text-sm font-medium text-gray-900 cursor-pointer">
                                ✅ In Stock Only
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="relative bottom-0 bg-white lg:rounded-b-2xl border-t-2 border-gray-100 p-6 space-y-3">
                        <Button
                            onClick={handleApply}
                            className="w-full"
                            color="green"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Applying Filters...
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Apply Filters</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </>
                            )}
                        </Button>

                        {hasActiveFilters && !isLoading && (
                            <Button
                                onClick={handleClear}
                                variant="outline"
                                color="gray"
                                className="w-full hover:bg-gray-50"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}