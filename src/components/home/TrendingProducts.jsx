'use client'

import { useMemo } from 'react';
import { ChevronRight, Flame, ShoppingBag, Zap } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import { ProductItemSkeleton } from '../products/ProductItemSkeleton';
import TextBadge from '../ui/TextBadge';
import { MOCK_PRODUCTS } from '@/utils/data';
import { useTrendingProducts } from '@/queries/products.query';

const SKELETON_COUNT = 4;
const GRID_CLASSES = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6";

const SectionHeader = () => (
    <header className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-3 sm:space-y-4">
        <TextBadge
            color="orange"
            variant="solid"
            startIcon={<Flame className="w-5 h-5" />}
            endIcon={<Zap className="w-5 h-5" />}
        >
            Hot Picks
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Trending <span className="text-[#F57C00]">Products</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Most viewed and highly demanded products by farmers nationwide
        </p>

        <TextBadge
            color="orange"
            startIcon={<ShoppingBag />}
            href="/products"
            variant="outline"
            endIcon={<ChevronRight />}
        >
            <span>View All Products</span>
        </TextBadge>
    </header>
);

const ProductGrid = ({ products, isLoading }) => {

    if (isLoading) {
        return (
            <div className={GRID_CLASSES}>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <ProductItemSkeleton key={`skeleton-${index}`} />
                ))}
            </div>
        );
    }


    return (
        <div className={GRID_CLASSES}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default function TrendingProducts() {
    const { data: trendingProducts = [], isError, isLoading } = useTrendingProducts()

    const products = useMemo(() => {
        if (isError || !trendingProducts || trendingProducts.length === 0) {
            return MOCK_PRODUCTS;
        }
        return trendingProducts;
    }, [isError, trendingProducts]);

    return (
        <section
            className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8"
            aria-labelledby="trending-products-heading"
        >
            <SectionHeader />
            <ProductGrid products={products} isLoading={isLoading} />
        </section>
    );
}