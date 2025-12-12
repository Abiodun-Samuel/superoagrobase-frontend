'use client';

import { useState, useEffect } from 'react';
import { Search, Package, Grid3x3, DollarSign, Tag, CheckCircle, SlidersHorizontal, X, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { useCategories } from '@/queries/categories.query';
import Button from '../ui/Button';
import { PER_PAGE_OPTIONS, SORT_OPTIONS } from '@/utils/data';

export default function ProductFilters({
    currentFilters = {},
    onFilterChange,
    isLoading = false
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();

    const [filters, setFilters] = useState({
        category: currentFilters.category || '',
        subcategory: currentFilters.subcategory || '',
        search: currentFilters.search || '',
        sort: currentFilters.sort || 'newest',
        per_page: currentFilters.per_page || 50,
        page: currentFilters.page || 1,
        brand: currentFilters.brand || '',
        minPrice: currentFilters.minPrice || '',
        maxPrice: currentFilters.maxPrice || '',
        inStock: currentFilters.inStock || false,
    });

    const selectedCategory = categories.find(cat => cat.slug === filters.category);
    const subcategories = selectedCategory?.subcategory || [];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            inStock: currentFilters.inStock === true || currentFilters.inStock === 'true'
        });
    }, [currentFilters]);

    const handleChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            ...(key === 'category' && { subcategory: '' })
        }));
    };

    const handleApply = () => {
        const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            //&& value !== false
            if (value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        onFilterChange(cleanFilters);
    };

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
            inStock: false,
        };
        setFilters(resetFilters);
        onFilterChange({}, true);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    const activeFilterCount = [
        filters.search,
        filters.category,
        filters.subcategory,
        filters.brand,
        filters.minPrice,
        filters.maxPrice,
        filters.inStock,
        filters.sort !== 'newest',
        filters.per_page !== 50,
    ].filter(Boolean).length;

    const hasActiveFilters = activeFilterCount > 0;

    return (
        <div className="w-full bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            {/* Header - Always visible, clickable on mobile */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer w-full bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 lg:cursor-default"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                            <SlidersHorizontal className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                Filters & Sort
                                {activeFilterCount > 0 && (
                                    <span className="bg-white text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </h2>
                            {activeFilterCount > 0 && (
                                <p className="text-xs text-green-100 mt-0.5">
                                    {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Toggle icon - only visible on mobile */}
                    <div className="lg:hidden">
                        {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-white" />
                        ) : (
                            <ChevronDown className="w-6 h-6 text-white" />
                        )}
                    </div>
                </div>
            </button>

            {/* Collapsible Content */}
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[5000px] lg:opacity-100 overflow-hidden'}`}>
                {/* Filters Content */}
                <div className="p-6 space-y-5">
                    {/* Search Filter */}
                    <div className="space-y-2">
                        <label htmlFor="search" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5 text-gray-600" />
                            Search Products
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                id="search"
                                value={filters.search}
                                onChange={(e) => handleChange('search', e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="e.g., seeds, fertilizer..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm group-hover:border-gray-300"
                            />
                            {filters.search && (
                                <p className="mt-1.5 text-xs text-gray-500">
                                    Searching for: <span className="font-medium text-gray-700">"{filters.search}"</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                        <label htmlFor="sort" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
                            Sort By
                        </label>
                        <select
                            id="sort"
                            value={filters.sort}
                            onChange={(e) => handleChange('sort', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 bg-white"
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
                        <label htmlFor="per_page" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Grid3x3 className="w-3.5 h-3.5 text-gray-600" />
                            Items Per Page
                        </label>
                        <select
                            id="per_page"
                            value={filters.per_page}
                            onChange={(e) => handleChange('per_page', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 bg-white"
                        >
                            {PER_PAGE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label} per page
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-gray-100" />

                    {/* Category Filter */}
                    <div className="space-y-2">
                        <label htmlFor="category" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-gray-600" />
                            Category
                        </label>
                        {categoriesLoading ? (
                            <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="animate-pulse h-5 bg-gray-200 rounded"></div>
                            </div>
                        ) : (
                            <>
                                <select
                                    id="category"
                                    value={filters.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 bg-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>
                                {filters.category && (
                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Selected: <span className="font-medium text-gray-700">{selectedCategory?.title}</span>
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Subcategory Filter */}
                    <div className="space-y-2">
                        <label htmlFor="subcategory" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Grid3x3 className="w-3.5 h-3.5 text-gray-600" />
                            Subcategory
                        </label>
                        <select
                            id="subcategory"
                            value={filters.subcategory}
                            onChange={(e) => handleChange('subcategory', e.target.value)}
                            disabled={!filters.category || subcategories.length === 0}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 bg-white"
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
                                Select a category first to view subcategories
                            </p>
                        )}
                        {filters.subcategory && (
                            <p className="mt-1.5 text-xs text-gray-500">
                                Selected: <span className="font-medium text-gray-700">{subcategories.find(s => s.slug === filters.subcategory)?.title}</span>
                            </p>
                        )}
                    </div>

                    {/* Brand Filter */}
                    <div className="space-y-2">
                        <label htmlFor="brand" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-gray-600" />
                            Brand
                        </label>
                        <input
                            type="text"
                            id="brand"
                            value={filters.brand}
                            onChange={(e) => handleChange('brand', e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., Apple, Nike, Samsung, Adidas..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                        />
                        {filters.brand && (
                            <p className="mt-1.5 text-xs text-gray-500">
                                Filtering by: <span className="font-medium text-gray-700">{filters.brand}</span>
                            </p>
                        )}
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-gray-600" />
                            Price Range
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="number"
                                    placeholder="Min (e.g., 10)"
                                    value={filters.minPrice}
                                    onChange={(e) => handleChange('minPrice', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Max (e.g., 1000)"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
                                />
                            </div>
                        </div>
                        {(filters.minPrice || filters.maxPrice) && (
                            <p className="mt-1.5 text-xs text-gray-500">
                                Range: <span className="font-medium text-gray-700">
                                    ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* In Stock Only */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <input
                            type="checkbox"
                            id="inStock"
                            checked={filters.inStock}
                            onChange={(e) => handleChange('inStock', e.target.checked)}
                            className="w-5 h-5 text-green-600 border-gray-300 rounded cursor-pointer  "
                        />
                        <label htmlFor="inStock" className="flex-1 text-sm font-medium text-gray-900 cursor-pointer flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Show In Stock Items Only
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white border-t-2 border-gray-100 p-6 space-y-3">
                    <Button
                        startIcon={<Filter />}
                        onClick={handleApply}
                        className='w-full'
                        isLoading={isLoading}
                    >
                        Apply Filters
                    </Button>

                    {hasActiveFilters && !isLoading && (
                        <Button className='w-full'
                            onClick={handleClear}
                            startIcon={<X />}
                            variant='outline'
                            color='gray'
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            </div>
        </div>
        // <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        //     {/* Header */}
        //     <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5">
        //         <div className="flex items-center justify-between">
        //             <div className="flex items-center gap-3">
        //                 <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
        //                     <SlidersHorizontal className="w-5 h-5 text-white" />
        //                 </div>
        //                 <div>
        //                     <h2 className="text-lg font-bold text-white flex items-center gap-2">
        //                         Filters & Sort
        //                         {activeFilterCount > 0 && (
        //                             <span className="bg-white text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
        //                                 {activeFilterCount}
        //                             </span>
        //                         )}
        //                     </h2>
        //                     {activeFilterCount > 0 && (
        //                         <p className="text-xs text-green-100 mt-0.5">
        //                             {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
        //                         </p>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Filters Content */}
        //     <div className="p-6 space-y-5">
        //         {/* Search Filter */}
        //         <div className="space-y-2">
        //             <label htmlFor="search" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        //                 <Search className="w-3.5 h-3.5 text-gray-600" />
        //                 Search Products
        //             </label>
        //             <div className="relative group">
        //                 <input
        //                     type="text"
        //                     id="search"
        //                     value={filters.search}
        //                     onChange={(e) => handleChange('search', e.target.value)}
        //                     onKeyPress={handleKeyPress}
        //                     placeholder="Search by name, keywords..."
        //                     className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm group-hover:border-gray-300"
        //                 />
        //                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
        //             </div>
        //         </div>

        //         {/* Sort Options */}
        //         <div className="space-y-2">
        //             <label htmlFor="sort" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        //                 <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
        //                 Sort By
        //             </label>
        //             <select
        //                 id="sort"
        //                 value={filters.sort}
        //                 onChange={(e) => handleChange('sort', e.target.value)}
        //                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 bg-white"
        //             >
        //                 {SORT_OPTIONS.map((option) => (
        //                     <option key={option.value} value={option.value}>
        //                         {option.icon} {option.label}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>

        //         {/* Per Page */}
        //         <div className="space-y-2">
        //             <label htmlFor="per_page" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        //                 <Grid3x3 className="w-3.5 h-3.5 text-gray-600" />
        //                 Items Per Page
        //             </label>
        //             <select
        //                 id="per_page"
        //                 value={filters.per_page}
        //                 onChange={(e) => handleChange('per_page', parseInt(e.target.value))}
        //                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 bg-white"
        //             >
        //                 {PER_PAGE_OPTIONS.map((option) => (
        //                     <option key={option.value} value={option.value}>
        //                         {option.label} per page
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>

        //         {/* Divider */}
        //         <div className="border-t-2 border-gray-100" />

        //         {/* Category Filter */}
        //         <div className="space-y-2">
        //             <label htmlFor="category" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        //                 <Package className="w-3.5 h-3.5 text-gray-600" />
        //                 Category
        //             </label>
        //             {categoriesLoading ? (
        //                 <div className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
        //                     <div className="animate-pulse h-5 bg-gray-200 rounded"></div>
        //                 </div>
        //             ) : (
        //                 <select
        //                     id="category"
        //                     value={filters.category}
        //                     onChange={(e) => handleChange('category', e.target.value)}
        //                     className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 bg-white"
        //                 >
        //                     <option value="">All Categories</option>
        //                     {categories.map((category) => (
        //                         <option key={category.id} value={category.slug}>
        //                             {category.title}
        //                         </option>
        //                     ))}
        //                 </select>
        //             )}
        //         </div>

        //         {/* Subcategory Filter */}
        //         <div className="space-y-2">
        //             <label htmlFor="subcategory" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        //                 <Grid3x3 className="w-3.5 h-3.5 text-gray-600" />
        //                 Subcategory
        //             </label>
        //             <select
        //                 id="subcategory"
        //                 value={filters.subcategory}
        //                 onChange={(e) => handleChange('subcategory', e.target.value)}
        //                 disabled={!filters.category || subcategories.length === 0}
        //                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 bg-white"
        //             >
        //                 <option value="">All Subcategories</option>
        //                 {subcategories.map((subcategory) => (
        //                     <option key={subcategory.id} value={subcategory.slug}>
        //                         {subcategory.title}
        //                     </option>
        //                 ))}
        //             </select>
        //             {!filters.category && (
        //                 <p className="text-xs text-gray-500 flex items-center gap-1">
        //                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        //                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        //                     </svg>
        //                     Select a category first
        //                 </p>
        //             )}
        //         </div>

        //         {/* Brand Filter */}
        //         <div className="space-y-2">
        //             <label htmlFor="brand" className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        //                 <Tag className="w-3.5 h-3.5 text-gray-600" />
        //                 Brand
        //             </label>
        //             <input
        //                 type="text"
        //                 id="brand"
        //                 value={filters.brand}
        //                 onChange={(e) => handleChange('brand', e.target.value)}
        //                 onKeyPress={handleKeyPress}
        //                 placeholder="Filter by brand name..."
        //                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
        //             />
        //         </div>

        //         {/* Price Range */}
        //         <div className="space-y-2">
        //             <label className="block text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        //                 <DollarSign className="w-3.5 h-3.5 text-gray-600" />
        //                 Price Range
        //             </label>
        //             <div className="grid grid-cols-2 gap-3">
        //                 <div>
        //                     <input
        //                         type="number"
        //                         placeholder="Min"
        //                         value={filters.minPrice}
        //                         onChange={(e) => handleChange('minPrice', e.target.value)}
        //                         onKeyPress={handleKeyPress}
        //                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
        //                     />
        //                 </div>
        //                 <div>
        //                     <input
        //                         type="number"
        //                         placeholder="Max"
        //                         value={filters.maxPrice}
        //                         onChange={(e) => handleChange('maxPrice', e.target.value)}
        //                         onKeyPress={handleKeyPress}
        //                         className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500   transition-all outline-none text-sm hover:border-gray-300"
        //                     />
        //                 </div>
        //             </div>
        //         </div>

        //         {/* In Stock Only */}
        //         <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        //             <input
        //                 type="checkbox"
        //                 id="inStock"
        //                 checked={filters.inStock}
        //                 onChange={(e) => handleChange('inStock', e.target.checked)}
        //                 className="w-5 h-5 text-green-600 border-gray-300 rounded cursor-pointer"
        //             />
        //             <label htmlFor="inStock" className="flex-1 text-sm font-medium text-gray-900 cursor-pointer flex items-center gap-1.5">
        //                 <CheckCircle className="w-4 h-4 text-green-600" />
        //                 In Stock Only
        //             </label>
        //         </div>
        //     </div>

        //     {/* Action Buttons */}
        //     <div className="bg-white border-t-2 border-gray-100 p-6 space-y-3">
        //         <Button
        //             startIcon={<Filter />}
        //             onClick={handleApply}
        //             className='w-full'
        //             isLoading={isLoading}
        //         >
        //             Apply Filters
        //         </Button>

        //         {hasActiveFilters && !isLoading && (
        //             <Button className='w-full'
        //                 onClick={handleClear}
        //                 startIcon={<X />}
        //                 variant='outline'
        //                 color='gray'
        //             >
        //                 Clear All Filters
        //             </Button>
        //         )}
        //     </div>
        // </div>
    );
}