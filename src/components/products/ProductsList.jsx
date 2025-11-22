'use client'
import { useFeaturedProducts } from "@/queries/product.query"
import { Star, ChevronRight } from 'lucide-react';
import ProductItem from '../products/ProductItem';
import Button from "../ui/Button";


const ProductsList = () => {
    const { data: featuredProducts } = useFeaturedProducts()

    return (
        <section className="my-24">
            <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
                    <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Top Rated Products</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Featured <span className="text-green-600">Products</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Handpicked premium products trusted by thousands of farmers
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts?.map(product => (
                    <ProductItem key={product?.id} product={product} />
                ))}
            </div>

            <div className="text-center mt-12">
                <Button href={'/products'} startIcon={<ChevronRight className="w-5 h-5" />}>
                    <span>View All Products</span>
                </Button>
            </div>
        </section>
    )
}

export default ProductsList