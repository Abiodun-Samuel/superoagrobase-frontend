'use client'

import { useState } from "react";
import { Star, Heart, Eye, ChevronRight, ShoppingCart } from 'lucide-react';


const ProductItem = ({ product }) => {
    const [wishlist, setWishlist] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(price);

    return (
        <div
            key={product.id}
            className="group relative bg-white rounded-2xl shadow hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
        >
            <div className="relative h-64 overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {product.badge && (
                    <div className={`${product.badgeColor} absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                        {product.badge}
                    </div>
                )}

                <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 ${wishlist.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                            }`}
                    >
                        <Heart className="w-5 h-5" />
                    </button>

                    <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-green-500 hover:text-white transition-all duration-300">
                        <Eye className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex flex-wrap items-center gap-1 mb-2">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                        {product.category}
                    </span>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                        {product.subcategories.map((sub, index) => (
                            <span key={index} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                {sub}
                            </span>
                        ))}
                    </div>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300 h-12">
                    {product.name}
                </h3>

                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                <div className="mb-4">
                    <span className="text-2xl font-black text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                </div>

                <div className="mb-4">
                    {product.inStock ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-600">
                                In Stock ({product.stockCount} available)
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-red-600">Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <button
                        disabled={!product.inStock}
                        className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${product.inStock
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{product.inStock ? 'Add to Cart' : 'Unavailable'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductItem