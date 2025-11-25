'use client'

import { useState, useMemo, useCallback, useEffect } from "react";
import { Star, Heart, Eye, ChevronRight, ShoppingCart } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import TextBadge from "../ui/TextBadge";
import { BADGE_COLORS } from "@/utils/data";
import RatingStars from "./RatingStars";
import { getPriceValidUntil } from "@/utils/helper";

const ProductItem = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [displayBadge, setDisplayBadge] = useState(null);

    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(price);
    }, []);

    useEffect(() => {
        if (product.badges && product.badges.length > 0) {
            const randomIndex = Math.floor(Math.random() * product.badges.length);
            setDisplayBadge(product.badges[randomIndex]);
        }
    }, [product.badges]);

    // Get badge color
    const badgeColor = useMemo(() => {
        return BADGE_COLORS[displayBadge] || 'green';
    }, [displayBadge]);

    // Toggle wishlist
    const handleWishlistToggle = useCallback((e) => {
        e.preventDefault();
        setIsWishlisted(prev => !prev);
    }, []);

    // Calculate stock status
    const stockStatus = useMemo(() => {
        if (product.stock === 0) {
            return { available: false, label: 'Out of Stock', color: 'red' };
        }
        if (product.stock < 10) {
            return { available: true, label: `Low Stock (${product.stock} left)`, color: 'orange' };
        }
        return { available: true, label: `In Stock (${product.stock} available)`, color: 'green' };
    }, [product.stock]);

    return (
        <>

            <article
                className="group relative bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                itemScope
                itemType="https://schema.org/Product"
            >
                {/* Product Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-50">
                    <Link href={`/products/${product.slug}`}>
                        <div className="relative w-full h-full">
                            <Image
                                fill
                                src={product.image}
                                alt={`${product.title} - ${product.category?.title || 'Agricultural Product'} available at SuperAgroBase Nigeria`}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                itemProp="image"
                            />
                        </div>
                    </Link>

                    {displayBadge && (
                        <div className="absolute top-3 left-3 z-10">
                            <TextBadge color={badgeColor} size="sm">
                                {displayBadge}
                            </TextBadge>
                        </div>
                    )}

                    {/* Action Buttons - Top Right */}
                    <div
                        className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                            }`}
                    >
                        <button
                            onClick={handleWishlistToggle}
                            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 ${isWishlisted
                                ? 'bg-red-500 text-white scale-110'
                                : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white hover:scale-110'
                                }`}
                            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>

                        <Link
                            href={`/products/${product.slug}`}
                            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-green-500 hover:text-white hover:scale-110 transition-all duration-300"
                            aria-label={`View ${product.title}`}
                        >
                            <Eye className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Product Information */}
                <div className="p-5 flex flex-col flex-grow space-y-3">
                    {/* Hidden meta tags for SEO */}
                    <meta itemProp="name" content={product.title} />
                    <meta itemProp="sku" content={product.id} />
                    <meta itemProp="productID" content={product.slug} />
                    <meta itemProp="brand" content={product.brands || "SuperAgroBase"} />

                    {/* Product Title */}
                    <Link
                        href={`/products/${product.slug}`}
                        className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors duration-300 line-clamp-2"
                    >
                        {product.title}
                    </Link>

                    {/* Category Breadcrumb */}
                    {product.category && product.subcategory && (
                        <div className="flex flex-wrap items-center gap-1" itemProp="category">
                            <TextBadge
                                href={`/products/categories/${product.category.slug}`}
                                color="green"
                                size="xs"
                            >
                                {product.category.title}
                            </TextBadge>
                            <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <TextBadge
                                href={`/products/categories/${product.category.slug}/${product.subcategory.slug}`}
                                color="white"
                                size="xs"
                            >
                                {product.subcategory.title}
                            </TextBadge>
                        </div>
                    )}

                    {/* Rating with SEO markup */}
                    <div className="flex items-center gap-2" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                        <meta itemProp="ratingValue" content={product?.reviews_summary?.average_ratings || 1} />
                        <meta itemProp="reviewCount" content={product?.reviews_summary?.reviews_count || 1} />
                        <meta itemProp="bestRating" content="5" />
                        <meta itemProp="worstRating" content="1" />
                        <RatingStars ratings={product?.reviews_summary?.average_ratings} />
                    </div>

                    {/* Price with SEO markup */}
                    <div className="flex items-baseline gap-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <meta itemProp="priceCurrency" content="NGN" />
                        <meta itemProp="priceValidUntil" content={getPriceValidUntil()} />
                        <meta itemProp="price" content={product.price} />
                        <meta itemProp="availability" content={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                        <link itemProp="url" href={`https://superoagrobase.com/products/${product.slug}`} />
                        <span className="text-2xl font-black text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.discount_price && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.discount_price)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stockStatus.color === 'green' ? 'bg-green-500 animate-pulse' :
                            stockStatus.color === 'orange' ? 'bg-orange-500' :
                                'bg-red-500'
                            }`} />
                        <span className={`text-sm font-medium ${stockStatus.color === 'green' ? 'text-green-600' :
                            stockStatus.color === 'orange' ? 'text-orange-600' :
                                'text-red-600'
                            }`}>
                            {stockStatus.label}
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-auto pt-2">
                        <Button
                            disabled={!stockStatus.available}
                            startIcon={<ShoppingCart className="w-5 h-5" />}
                        >
                            {stockStatus.available ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                    </div>
                </div>
            </article>
        </>
    );
};

export default ProductItem