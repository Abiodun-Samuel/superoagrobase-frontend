'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import ContentPlaceholder from '../common/ContentPlaceholder';
import Paginator from '../common/Paginator';
import ProductCard from './ProductCard';
import PageLoader from '../ui/PageLoader';
import PageHero from '../page/PageLayout';
import ProductFilters from './ProductFilters';

export default function ProductsDetailsPage({ products = [], filters = {}, meta = {}, links = [] }) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const { category, subcategory, search } = filters;

    /**
     * Build page title based on active filters
     */
    const getPageTitle = () => {
        if (search) return `Search Results for "${search}"`;
        if (subcategory) return subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (category) return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return 'All Products';
    };

    /**
     * Build page description based on active filters
     */
    const getPageDescription = () => {
        const productCount = meta.total?.toLocaleString() || '0';
        if (search) {
            return `Found ${productCount} products matching your search. Browse our quality agricultural products and solutions.`;
        }
        if (subcategory || category) {
            return `Explore ${productCount} premium products in our ${subcategory || category} collection. Quality guaranteed for your agricultural needs.`;
        }
        return `Discover ${productCount} premium agricultural products. From seeds to tools, find everything you need for successful farming.`;
    };

    /**
     * Build breadcrumb navigation
     */
    const breadcrumbItems = [
        { label: 'Products', href: '/products' },
        ...(category ? [{
            label: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            href: `/products?category=${encodeURIComponent(category)}`
        }] : []),
        ...(subcategory ? [{
            label: subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            href: `/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
        }] : [])
    ];

    /**
     * Update URL with new query params - wrapped in transition for loading state
     */
    const updateUrlParams = (updates, resetPage) => {
        const params = new URLSearchParams(searchParams);

        const filterKeys = [
            'category', 'subcategory', 'search', 'sort',
            'per_page', 'brand', 'minPrice', 'maxPrice', 'inStock'
        ];

        if (resetPage) {
            filterKeys.forEach(key => params.delete(key));
            params.delete('page');
        } else {
            Object.entries(updates).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            });
        }

        startTransition(() => {
            router.push(`/products?${params.toString()}`);
        });
    };

    /**
    * Handle filter changes from ProductFilters component
    */
    const handleFilterChange = (newFilters, resetPage) => {
        updateUrlParams({ ...newFilters }, resetPage);
    };

    /**
     * Handle pagination
     */
    const handlePageChange = (page) => {
        if (!page) return;
        updateUrlParams({ page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasProducts = products.length > 0;
    const showPagination = hasProducts && meta.last_page > 1;

    return (
        <>
            {/* Page Hero */}
            <PageHero
                title={getPageTitle()}
                description={getPageDescription()}
                badge={search ? '🔍 Search Results' : category ? 'Category' : 'Products'}
                breadcrumbs={breadcrumbItems}
            />

            <main className="pb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Filter Component */}
                    <aside className="w-full lg:w-80 flex-shrink-0">
                        <ProductFilters
                            currentFilters={filters}
                            onFilterChange={handleFilterChange}
                            isLoading={isPending}
                        />
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Main Content with Loading State */}
                        <div className="relative">
                            {/* Loading Overlay */}
                            {isPending && <PageLoader text='Loading products...' showBlur />}

                            {!hasProducts ? (
                                <ContentPlaceholder
                                    color='red'
                                    title="No products found"
                                    description="Try adjusting your filters or search criteria to find what you're looking for"
                                />
                            ) : (
                                <>
                                    {/* Products Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                                        {products.map((product, index) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                priority={index < 4}
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
                </div>
            </main>
        </>
    );
}