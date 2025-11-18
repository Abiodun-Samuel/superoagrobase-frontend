'use client'

import { useRef, useState } from 'react'
import { ChevronRight, ChevronLeft, Flame, Zap } from 'lucide-react';
import ProductItem from '../products/ProductItem';

const TrendingProducts = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    const trendingProducts = [
        {
            id: 101,
            name: "Super Growth Organic Fertilizer",
            category: "Fertilizers",
            subcategories: ["Organic", "Growth Boosters"],
            price: 38000,
            rating: 4.9,
            reviews: 245,
            inStock: true,
            stockCount: 89,
            image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80",
            views: 2450,
            sales: 450
        },
        {
            id: 102,
            name: "Premium Rice Seeds - IR64",
            category: "Seeds",
            subcategories: ["Rice Seeds", "High Yield"],
            price: 32000,
            rating: 4.8,
            reviews: 198,
            inStock: true,
            stockCount: 156,
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80",
            views: 2100,
            sales: 380
        },
        {
            id: 103,
            name: "Bio-Pesticide Spray - 10L",
            category: "Pesticides",
            subcategories: ["Bio-Pesticides", "Eco-Friendly"],
            price: 42000,
            rating: 4.7,
            reviews: 167,
            inStock: true,
            stockCount: 67,
            image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=500&q=80",
            views: 1850,
            sales: 325
        },
        {
            id: 104,
            name: "Smart Sprinkler System Pro",
            category: "Irrigation",
            subcategories: ["Sprinklers", "Automation"],
            price: 95000,
            rating: 4.9,
            reviews: 134,
            inStock: true,
            stockCount: 34,
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
            views: 1680,
            sales: 210
        },
        {
            id: 105,
            name: "Soil pH Testing Kit Advanced",
            category: "Equipment",
            subcategories: ["Testing Equipment", "Soil Analysis"],
            price: 15000,
            rating: 4.6,
            reviews: 289,
            inStock: true,
            stockCount: 145,
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&q=80",
            views: 1560,
            sales: 580
        },
        {
            id: 106,
            name: "Tomato Seeds - Hybrid F1",
            category: "Seeds",
            subcategories: ["Vegetable Seeds", "Hybrid"],
            price: 8500,
            rating: 4.8,
            reviews: 312,
            inStock: true,
            stockCount: 234,
            image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&q=80",
            views: 2890,
            sales: 670
        }
    ];

    const itemsPerSlide = 4;
    const totalSlides = Math.ceil(trendingProducts.length / itemsPerSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };


    return (
        <section className="my-24">
            <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full mb-4">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-700">Hot Picks</span>
                    <Zap className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Trending <span className="text-orange-600">Products</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Most viewed and highly demanded products by farmers nationwide
                </p>
            </div>

            {/* Slider Container */}
            <div className="relative">
                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-110 border border-gray-200"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center text-gray-700 hover:text-green-600 transition-all duration-300 hover:scale-110 border border-gray-200"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slider Track */}
                <div className="overflow-hidden px-1 py-2">
                    <div
                        ref={sliderRef}
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                            <div key={slideIndex} className="w-full flex-shrink-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                                    {trendingProducts
                                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                                        .map((product) => (
                                            <ProductItem key={product?.id} product={product} />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slider Indicators */}
                <div className="flex justify-center items-center space-x-2 mt-8">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${currentSlide === index
                                ? 'bg-orange-600 w-8 h-3'
                                : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrendingProducts