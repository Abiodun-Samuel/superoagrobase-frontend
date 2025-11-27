'use client'

import { useMemo } from "react";
import { ChevronRight, Package, Star, ShoppingBag } from "lucide-react";
import { ProductItemSkeleton } from "../products/ProductItemSkeleton";
import ProductCard from "../products/ProductCard";
import Button from "../ui/Button";
import { MOCK_PRODUCTS } from "@/utils/data";
import TextBadge from "../ui/TextBadge";

const SKELETON_COUNT = 4;
const GRID_CLASSES = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

const SectionHeader = () => (
    <header className="text-center mb-12 space-y-4">
        <TextBadge
            color="green"
            variant="light"
            size="lg"
            startIcon={<Star className="w-5 h-5" />}
            endIcon={<Package className="w-5 h-5" />}
        >
            Shop by Category
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Featured <span className="text-green-600">Products</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handpicked premium products trusted by thousands of farmers
        </p>
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

const ViewAllButton = () => (
    <div className="text-center mt-12">
        <Button
            startIcon={<ShoppingBag />}
            href="/products"
            className="max-w-xs"
            variant="outline"
            endIcon={<ChevronRight />}
        >
            <span>View All Products</span>
        </Button>
    </div>
);

// Main Component
export default function FeaturedProducts({
    isError = false,
    isLoading = false,
    featuredProducts = null
}) {

    const products = useMemo(() => {
        if (isError || !featuredProducts || featuredProducts.length === 0) {
            return MOCK_PRODUCTS;
        }
        return featuredProducts;
    }, [isError, featuredProducts]);

    return (
        <section className="my-24" aria-labelledby="featured-products-heading">
            <SectionHeader />
            <ProductGrid products={products} isLoading={isLoading} />
            {!isLoading && <ViewAllButton />}
        </section>
    );
}