// 'use client';

// import { useRouter, useSearchParams } from 'next/navigation';
// import { useState } from 'react';
// import Breadcrumb from '../common/Breadcrumb';
// import ContentPlaceholder from '../common/ContentPlaceholder';
// import Paginator from '../common/Paginator';
// import Button from '../ui/Button';
// import ProductFilters from './ProductFilters';
// import ProductCard from './ProductCard';

// const SORT_OPTIONS = [
//     { value: 'newest', label: 'Newest First' },
//     { value: 'oldest', label: 'Oldest First' },
//     { value: 'price_asc', label: 'Price: Low to High' },
//     { value: 'price_desc', label: 'Price: High to Low' },
//     { value: 'name_asc', label: 'Name: A to Z' },
//     { value: 'name_desc', label: 'Name: Z to A' },
//     { value: 'popular', label: 'Most Popular' }
// ];

// export default function ProductsPageDetails({
//     products = [],
//     filters = {},
//     meta = {},
//     links = []
// }) {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const [isFilterOpen, setIsFilterOpen] = useState(false);

//     const { category, subcategory, search, sort = 'newest' } = filters;

//     /**
//      * Build page title based on active filters
//      */
//     const getPageTitle = () => {
//         if (search) return `Search Results for "${search}"`;
//         if (subcategory) return subcategory;
//         if (category) return category;
//         return 'All Products';
//     };

//     /**
//      * Build breadcrumb navigation
//      */
//     const breadcrumbItems = [
//         { name: 'Home', url: '/' },
//         { name: 'Products', url: '/products' },
//         ...(category ? [{
//             name: category,
//             url: `/products?category=${encodeURIComponent(category)}`
//         }] : []),
//         ...(subcategory ? [{
//             name: subcategory,
//             url: `/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
//         }] : [])
//     ];

//     /**
//      * Update URL with new query params
//      */
//     const updateUrlParams = (updates) => {
//         const params = new URLSearchParams(searchParams);

//         Object.entries(updates).forEach(([key, value]) => {
//             if (value) {
//                 params.set(key, value);
//             } else {
//                 params.delete(key);
//             }
//         });

//         router.push(`/products?${params.toString()}`);
//     };

//     /**
//      * Handle sort change
//      */
//     const handleSortChange = (e) => {
//         updateUrlParams({ sort: e.target.value });
//     };

//     /**
//      * Handle pagination - matches Paginator component signature
//      */
//     const handlePageChange = (page) => {
//         if (!page) return;
//         updateUrlParams({ page });
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     /**
//      * Handle filter changes from ProductFilters component
//      */
//     const handleFilterChange = (newFilters) => {
//         updateUrlParams({ ...newFilters, page: null }); // Reset to page 1 on filter change
//     };

//     const hasProducts = products.length > 0;
//     const showPagination = hasProducts && meta.last_page > 1;

//     console.log(showPagination, hasProducts)

//     return (
//         <main className="container mx-auto px-4 py-8">
//             <Breadcrumb breadcrumbItems={breadcrumbItems} />

//             {/* Header Section */}
//             <div className="mb-6">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                             {getPageTitle()}
//                         </h1>
//                         {hasProducts && (
//                             <p className="text-sm text-gray-600">
//                                 Showing {meta.from} - {meta.to} of {meta.total} products
//                             </p>
//                         )}
//                     </div>

//                     {/* Filter & Sort Controls */}
//                     <div className="flex items-center gap-3">
//                         {/* Mobile Filter Toggle */}
//                         <Button
//                             variant="outline"
//                             color="gray"
//                             onClick={() => setIsFilterOpen(!isFilterOpen)}
//                             className="lg:hidden"
//                         >
//                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//                             </svg>
//                             Filters
//                         </Button>

//                         {/* Sort Dropdown */}
//                         {hasProducts && (
//                             <div className="flex items-center gap-2">
//                                 <label htmlFor="sort" className="text-sm font-medium text-gray-700 hidden sm:block">
//                                     Sort:
//                                 </label>
//                                 <select
//                                     id="sort"
//                                     value={sort}
//                                     onChange={handleSortChange}
//                                     className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
//                                 >
//                                     {SORT_OPTIONS.map(option => (
//                                         <option key={option.value} value={option.value}>
//                                             {option.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex flex-col lg:flex-row gap-8">
//                 {/* Filters Sidebar */}
//                 <aside className={`
//                     lg:w-72 lg:flex-shrink-0 sticky
//                     ${isFilterOpen ? 'block' : 'hidden lg:block'}
//                 `}>
//                     <ProductFilters
//                         currentFilters={filters}
//                         onFilterChange={handleFilterChange}
//                         onClose={() => setIsFilterOpen(false)}
//                     />
//                 </aside>

//                 {/* Products Grid */}
//                 <div className="flex-1">
//                     {!hasProducts ? (
//                         <div className="text-center py-12">
//                             <ContentPlaceholder
//                                 color="red"
//                                 className='w-full'
//                                 title="No products found"
//                                 description="Try adjusting your filters or search criteria"
//                             />
//                         </div>
//                     ) : (
//                         <>
//                             {/* Products Grid */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                                 {products.map((product) => (
//                                     <ProductCard
//                                         key={product.id}
//                                         product={product}
//                                     />
//                                 ))}
//                             </div>

//                             {/* Pagination */}
//                             {showPagination && (
//                                 <div className="mt-8">
//                                     <Paginator
//                                         paginationData={meta}
//                                         links={links}
//                                         setPage={handlePageChange}
//                                         limit={3}
//                                     />
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </main>
//     );
// }

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import Breadcrumb from '../common/Breadcrumb';
import ContentPlaceholder from '../common/ContentPlaceholder';
import Paginator from '../common/Paginator';
import Button from '../ui/Button';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import { Filter } from 'lucide-react';

export default function ProductsPageDetails({
    products = [],
    filters = {},
    meta = {},
    links = []
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const { category, subcategory, search } = filters;

    /**
     * Build page title based on active filters
     */
    const getPageTitle = () => {
        if (search) return `Search Results for "${search}"`;
        if (subcategory) return subcategory;
        if (category) return category;
        return 'All Products';
    };

    /**
     * Build breadcrumb navigation
     */
    const breadcrumbItems = [
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        ...(category ? [{
            name: category,
            url: `/products?category=${encodeURIComponent(category)}`
        }] : []),
        ...(subcategory ? [{
            name: subcategory,
            url: `/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
        }] : [])
    ];

    /**
     * Update URL with new query params - wrapped in transition for loading state
     */
    const updateUrlParams = (updates) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        startTransition(() => {
            router.push(`/products?${params.toString()}`);
        });
    };

    /**
     * Handle pagination
     */
    const handlePageChange = (page) => {
        if (!page) return;
        updateUrlParams({ page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Handle filter changes from ProductFilters component
     */
    const handleFilterChange = (newFilters) => {
        updateUrlParams({ ...newFilters, page: null }); // Reset to page 1
        setIsFilterOpen(false); // Close mobile filter
    };

    const hasProducts = products.length > 0;
    const showPagination = hasProducts && meta.last_page > 1;

    return (
        <main className="container mx-auto px-4 py-8">
            <Breadcrumb breadcrumbItems={breadcrumbItems} />

            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {getPageTitle()}
                        </h1>
                        {hasProducts && (
                            <p className="text-sm text-gray-600">
                                Showing {meta.from} - {meta.to} of {meta.total?.toLocaleString()} products
                            </p>
                        )}
                    </div>

                    {/* Mobile Filter Toggle */}
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        startIcon={<Filter />}
                        className="lg:hidden"
                    >
                        Filters & Sort
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar - Sticky */}
                <aside className={`
                    lg:w-80 lg:flex-shrink-0
                    ${isFilterOpen ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'}
                `}>
                    <ProductFilters
                        currentFilters={filters}
                        onFilterChange={handleFilterChange}
                        onClose={() => setIsFilterOpen(false)}
                        isLoading={isPending}
                        isOpen={isFilterOpen}
                    />
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    {!hasProducts ? (
                        <div className="text-center">
                            <ContentPlaceholder
                                color="red"
                                className='w-full'
                                title="No products found"
                                description="Try adjusting your filters or search criteria"
                            />
                        </div>
                    ) : (
                        <>
                            {/* Loading Overlay */}
                            {isPending && (
                                <div className="fixed top-0 right-0 left-0 bottom-0 min-h-screen inset-0 bg-white/60 backdrop-blur-sm z-100 flex items-center justify-center pt-20">
                                    <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-3">
                                        <svg className="animate-spin h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Loading products...</span>
                                    </div>
                                </div>
                            )}

                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {showPagination && (
                                <div className="mt-8">
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
            </div>
        </main>
    );
}