'use client';

import { memo, useCallback, useState } from 'react';
import { Minus, Plus, ShoppingCart, Share2, FileEdit, ChevronRight } from 'lucide-react';
import RatingStars from '@/components/products/RatingStars';
import Button from '../ui/Button';
import Toast from '@/lib/toastify';
import TextBadge from '../ui/TextBadge';
import { formatCurrency } from '@/utils/helper';

// Constants
const SCHEMA = {
    PRODUCT: 'https://schema.org/Product',
    OFFER: 'https://schema.org/Offer',
    RATING: 'https://schema.org/AggregateRating',
    IN_STOCK: 'https://schema.org/InStock',
    OUT_OF_STOCK: 'https://schema.org/OutOfStock',
};

const SPACING = {
    section: 'mb-6',
    sectionLarge: 'mb-8',
    gap: { gap: '0.75rem' },
};

// Sub-components
const ProductSchema = memo(({ product }) => (
    <>
        <meta itemProp="sku" content={product.id} />
        <meta itemProp="productID" content={product.slug} />
        <meta itemProp="brand" content={product.brands || 'SuperoAgroBase'} />
        <link itemProp="url" href={`https://superoagrobase.com/products/${product.slug}`} />
    </>
));
ProductSchema.displayName = 'ProductSchema';

const ProductTitle = memo(({ title, subtitle }) => (
    <>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2" itemProp="name">
            {title}
        </h1>
        {subtitle && (
            <p className="text-lg text-gray-600 mb-4">{subtitle}</p>
        )}
    </>
));
ProductTitle.displayName = 'ProductTitle';

const CategoryBreadcrumb = memo(({ category, subcategory }) => {
    if (!category || !subcategory) return null;

    return (
        <div className="flex flex-wrap items-center mb-4" style={SPACING.gap} itemProp="category">
            <TextBadge
                href={`/products?category=${category.slug}`}
                color="green"
                size="sm"
            >
                {category.title}
            </TextBadge>
            <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <TextBadge
                href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
                color="white"
                size="sm"
            >
                {subcategory.title}
            </TextBadge>
        </div>
    );
});
CategoryBreadcrumb.displayName = 'CategoryBreadcrumb';

const ProductRating = memo(({ reviewsSummary }) => {
    if (!reviewsSummary?.average_ratings || reviewsSummary.average_ratings <= 0) {
        return null;
    }

    const { average_ratings, reviews_count = 0 } = reviewsSummary;
    const reviewText = reviews_count === 1 ? 'review' : 'reviews';

    return (
        <div
            className="flex items-center mb-4"
            style={SPACING.gap}
            itemProp="aggregateRating"
            itemScope
            itemType={SCHEMA.RATING}
        >
            <meta itemProp="ratingValue" content={average_ratings} />
            <meta itemProp="reviewCount" content={reviews_count} />
            <meta itemProp="bestRating" content="5" />
            <meta itemProp="worstRating" content="1" />

            <div className="flex items-center" style={{ gap: '0.5rem' }}>
                <RatingStars ratings={average_ratings} />
                <span className="text-sm font-medium text-gray-700">
                    {average_ratings.toFixed(1)}
                </span>
            </div>
            <span className="text-sm text-gray-500">
                ({reviews_count} {reviewText})
            </span>
        </div>
    );
});
ProductRating.displayName = 'ProductRating';

const PriceSection = memo(({ product }) => {
    return (
        <div
            className="pb-6 mb-6 border-b border-gray-200"
            itemProp="offers"
            itemScope
            itemType={SCHEMA.OFFER}
        >
            <meta itemProp="priceCurrency" content="NGN" />
            <meta itemProp="price" content={formatCurrency(product.price)} />
            <meta
                itemProp="availability"
                content={product.stock > 0 ? SCHEMA.IN_STOCK : SCHEMA.OUT_OF_STOCK}
            />

            <div className="flex items-baseline flex-wrap mb-2" style={SPACING.gap}>
                <span className="text-4xl font-bold text-green-600">
                    {formatCurrency(product.price)}
                </span>
            </div>

            {product.pack_size && (
                <p className="text-gray-600">Pack Size: {product.pack_size}</p>
            )}
        </div>
    );
});
PriceSection.displayName = 'PriceSection';

const StockStatus = memo(({ stock }) => {
    const isInStock = stock > 0;
    const isLowStock = stock <= 10 && stock > 0;

    return (
        <div className={SPACING.section}>
            {isInStock ? (
                <div className="flex items-center text-green-600" style={{ gap: '0.5rem' }}>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-semibold">
                        In Stock {isLowStock && `(Only ${stock} left)`}
                    </span>
                </div>
            ) : (
                <div className="flex items-center text-red-600" style={{ gap: '0.5rem' }}>
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                    <span className="font-semibold">Out of Stock</span>
                </div>
            )}
        </div>
    );
});
StockStatus.displayName = 'StockStatus';

const ProductDescription = memo(({ description }) => (
    <div className="pb-8 mb-8 border-b border-gray-200">
        <h2 className="text-lg font-bold mb-3 text-gray-900">Product Description</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line" itemProp="description">
            {description}
        </p>
    </div>
));
ProductDescription.displayName = 'ProductDescription';

const QuantitySelector = memo(({
    quantity,
    stock,
    onIncrement,
    onDecrement,
    onChange
}) => {
    if (stock <= 0) return null;

    return (
        <div className={SPACING.section}>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
            </label>
            <div className="flex items-center" style={SPACING.gap}>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                        onClick={onDecrement}
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
                        max={stock}
                        value={quantity}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-16 text-center font-semibold text-lg text-gray-900 border-x-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-label="Product quantity"
                    />

                    <button
                        onClick={onIncrement}
                        disabled={quantity >= stock}
                        className="p-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                        type="button"
                    >
                        <Plus className="w-5 h-5" style={{ display: 'block' }} />
                    </button>
                </div>

                <span className="text-sm text-gray-600 font-medium">
                    {stock} available
                </span>
            </div>
        </div>
    );
});
QuantitySelector.displayName = 'QuantitySelector';

const ActionButtons = memo(({ stock, onAddToCart, onShare }) => (
    <div className="flex" style={{ gap: '0.75rem' }}>
        <Button
            onClick={onAddToCart}
            disabled={stock <= 0}
            className="flex-1"
            aria-label="Add to cart"
            startIcon={<ShoppingCart />}
        >
            {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Button
            href="#review"
            color="gray"
            variant="outline"
            aria-label="Write a review for this product"
            style={{ flexShrink: 0 }}
        >
            <FileEdit className="w-5 h-5" />
        </Button>
        <Button
            variant="outline"
            color="gray"
            onClick={onShare}
            aria-label="Share product"
            style={{ flexShrink: 0 }}
        >
            <Share2 className="w-5 h-5" />
        </Button>
    </div>
));
ActionButtons.displayName = 'ActionButtons';

// Main Component
export default function ProductInfo({ product }) {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = useCallback((value) => {
        const newValue = parseInt(value, 10) || 1;
        setQuantity(Math.max(1, Math.min(newValue, product.stock)));
    }, [product.stock]);

    const incrementQuantity = useCallback(() => {
        setQuantity((prev) => Math.min(prev + 1, product.stock));
    }, [product.stock]);

    const decrementQuantity = useCallback(() => {
        setQuantity((prev) => Math.max(prev - 1, 1));
    }, []);

    const handleAddToCart = useCallback(() => {
        // Add to cart logic here
        Toast.success(`Added ${quantity} ${product.title} to cart`);
    }, [quantity, product.title]);

    const handleShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    Toast.error('Failed to share product');
                }
            }
        } else {
            Toast.info('Sharing is not supported on this browser');
        }
    }, [product.title, product.description]);

    return (
        <div
            className="flex flex-col"
            itemScope
            itemType={SCHEMA.PRODUCT}
        >
            <ProductSchema product={product} />

            <ProductTitle
                title={product.title}
                subtitle={product.sub_title}
            />

            <CategoryBreadcrumb
                category={product.category}
                subcategory={product.subcategory}
            />

            <ProductRating reviewsSummary={product.reviews_summary} />

            <PriceSection product={product} />

            <StockStatus stock={product.stock} />

            <ProductDescription description={product.description} />

            <QuantitySelector
                quantity={quantity}
                stock={product.stock}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onChange={handleQuantityChange}
            />

            <ActionButtons
                stock={product.stock}
                onAddToCart={handleAddToCart}
                onShare={handleShare}
            />
        </div>
    );
}