'use client';

import { Star, ChevronRight } from 'lucide-react';
import { featuredProducts } from '@/utils/data';
import ProductItem from '../products/ProductItem';

export default function FeaturedProducts() {

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts?.map(product => (
                    <ProductItem key={product?.id} product={product} />
                ))}
            </div>

            <div className="text-center mt-12">
                <button className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:scale-105">
                    <span>View All Products</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}
