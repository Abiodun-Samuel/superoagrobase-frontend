'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Share2, FileEdit } from 'lucide-react';
import RatingStars from '@/components/products/RatingStars';
import Button from '../ui/Button';
import Toast from '@/lib/toastify';

/**
 * Product Information and Add to Cart Section
 */
export default function ProductInfo({ product }) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (value) => {
        const newValue = parseInt(value) || 1;
        setQuantity(Math.max(1, Math.min(newValue, product.stock)));
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        // Add to cart logic here
        console.log(`Adding ${quantity} of ${product.title} to cart`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                Toast.info('Share failed:', err);
            }
        }
    };

    return (
        <div
            className="flex flex-col"
            itemScope
            itemType="https://schema.org/Product"
        >
            {/* Hidden SEO meta tags */}
            <meta itemProp="sku" content={product.id} />
            <meta itemProp="productID" content={product.slug} />
            <meta itemProp="brand" content={product.brands || 'SuperoAgroBase'} />
            <link itemProp="url" href={`https://superoagrobase.com/products/${product.slug}`} />


            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3" itemProp="name">
                {product.title}
            </h1>

            {/* Subtitle if exists */}
            {product.sub_title && (
                <p className="text-lg text-gray-600 mb-4">{product.sub_title}</p>
            )}

            {/* Rating */}
            {product.reviews_summary?.average_ratings > 0 && (
                <div
                    className="flex items-center gap-3 mb-6"
                    itemProp="aggregateRating"
                    itemScope
                    itemType="https://schema.org/AggregateRating"
                >
                    <meta itemProp="ratingValue" content={product.reviews_summary.average_ratings} />
                    <meta itemProp="reviewCount" content={product.reviews_summary.reviews_count || 0} />
                    <meta itemProp="bestRating" content="5" />
                    <meta itemProp="worstRating" content="1" />

                    <div className="flex items-center gap-2">
                        <RatingStars ratings={product.reviews_summary.average_ratings} />
                        <span className="text-sm font-medium text-gray-700">
                            {product.reviews_summary.average_ratings.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">
                        ({product.reviews_summary.reviews_count} {product.reviews_summary.reviews_count === 1 ? 'review' : 'reviews'})
                    </span>
                </div>
            )}

            {/* Price */}
            <div
                className="mb-6 pb-6 border-b border-gray-200"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
            >
                <meta itemProp="priceCurrency" content="NGN" />
                <meta itemProp="price" content={product.price} />
                <meta
                    itemProp="availability"
                    content={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
                />

                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-green-600">
                        ₦{Number(product.price).toLocaleString()}
                    </span>
                    {product.discount_price && (
                        <>
                            <span className="text-2xl text-gray-400 line-through">
                                ₦{Number(product.discount_price).toLocaleString()}
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                                Save {Math.round(((product.discount_price - product.price) / product.discount_price) * 100)}%
                            </span>
                        </>
                    )}
                </div>

                {product.pack_size && (
                    <p className="text-gray-600 mt-2">Pack Size: {product.pack_size}</p>
                )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
                {product.stock > 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-semibold">
                            In Stock {product.stock <= 10 && `(Only ${product.stock} left)`}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                        <span className="font-semibold">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-lg font-bold mb-3 text-gray-900">Product Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line" itemProp="description">
                    {product.description}
                </p>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Quantity
                    </label>
                    <div className="flex items-center" style={{ gap: '0.75rem' }}>
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                                className="p-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Decrease quantity"
                                type="button"
                            >
                                <Minus className="w-5 h-5" style={{ display: 'block' }} />
                            </button>

                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                                className="w-16 text-center font-semibold text-lg text-gray-900 border-x-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Product quantity"
                            />

                            <button
                                onClick={incrementQuantity}
                                disabled={quantity >= product.stock}
                                className="p-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Increase quantity"
                                type="button"
                            >
                                <Plus className="w-5 h-5" style={{ display: 'block' }} />
                            </button>
                        </div>

                        <span className="text-sm text-gray-600 font-medium">
                            {product.stock} available
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1/2"
                    aria-label="Add to cart"
                    startIcon={<ShoppingCart />}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                    href={'#review'}
                    color={'gray'}
                    title={'Write review '}
                    className="flex-1"
                    variant='outline'
                    aria-label="write a for this product"
                >
                    <FileEdit className="w-5 h-5" />
                </Button>
                <Button
                    className="flex-1"
                    variant='outline'
                    color={'gray'}
                    onClick={handleShare}
                    aria-label="Share product"
                >
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}