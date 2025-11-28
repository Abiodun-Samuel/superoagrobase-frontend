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
import PageLoader from '../ui/PageLoader';

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
                                <PageLoader text='Loading products...' />
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