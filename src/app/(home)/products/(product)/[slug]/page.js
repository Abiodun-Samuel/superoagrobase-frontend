import {
    generateProductMetadata,
    generateProductJsonLd,
    generateBreadcrumbJsonLd,
    generateOrganizationJsonLd
} from '@/utils/seo/product.seo';
import { notFound } from 'next/navigation';
import { ProductService } from '@/services/products.service';
import RatingStars from '@/components/products/RatingStars';

export const revalidate = 3600;
export const dynamicParams = true;

/**
 * Generate metadata for the product page
 * @param {Object} props - Page props
 * @param {Promise<Object>} props.params - Route parameters
 * @returns {Promise<Object>} Metadata object
 */
export async function generateMetadata({ params }) {
    try {
        const { slug } = await params;
        if (!slug) return generateProductMetadata(null);

        const { data: product } = await ProductService.getProductBySlug(slug, {
            incrementView: false
        });

        return generateProductMetadata(product);
    } catch (error) {
        console.error('[generateMetadata] Error:', error);
        return generateProductMetadata(null);
    }
}

/**
 * Generate static paths at build time for ISR
 * @returns {Promise<Array>} Array of slug params
 */
// export async function generateStaticParams() {
//     try {
//         const { data: products } = await ProductService.getAllProducts();

//         if (!Array.isArray(products)) {
//             return [];
//         }

//         return products
//             .filter(product => product?.slug)
//             .map(({ slug }) => ({ slug }));
//     } catch (error) {
//         console.error('[generateStaticParams] Error:', error);
//         return [];
//     }
// }

/**
 * Product detail page component
 * @param {Object} props - Page props
 * @param {Promise<Object>} props.params - Route parameters containing slug
 * @returns {Promise<JSX.Element>} Rendered product page
 */
export default async function ProductPage({ params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            notFound();
        }

        const { data: product } = await ProductService.getProductBySlug(slug, {
            incrementView: true
        });

        if (!product) {
            notFound();
        }

        // Generate JSON-LD structured data for SEO
        const jsonLdScripts = [
            generateProductJsonLd(product),
            generateBreadcrumbJsonLd(product),
            generateOrganizationJsonLd()
        ];

        return (
            <>
                {/* Structured Data (JSON-LD) */}
                {jsonLdScripts.map((jsonLd, idx) => (
                    <script
                        key={idx}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                ))}

                <main className="container mx-auto px-4 py-8">
                    {/* Breadcrumb Navigation with Schema.org markup */}
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol
                            className="flex items-center space-x-2 text-sm"
                            itemScope
                            itemType="https://schema.org/BreadcrumbList"
                        >
                            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <a href="/" className="text-gray-600 hover:text-green-600" itemProp="item">
                                    <span itemProp="name">Home</span>
                                </a>
                                <meta itemProp="position" content="1" />
                            </li>
                            <li className="text-gray-400">/</li>

                            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                <a href="/products" className="text-gray-600 hover:text-green-600" itemProp="item">
                                    <span itemProp="name">Products</span>
                                </a>
                                <meta itemProp="position" content="2" />
                            </li>

                            {product.category && (
                                <>
                                    <li className="text-gray-400">/</li>
                                    <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <a
                                            href={`/products/categories/${product.category.slug}`}
                                            className="text-gray-600 hover:text-green-600"
                                            itemProp="item"
                                        >
                                            <span itemProp="name">{product.category.title}</span>
                                        </a>
                                        <meta itemProp="position" content="3" />
                                    </li>
                                </>
                            )}

                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 font-medium">{product.title}</li>
                        </ol>
                    </nav>

                    {/* Product Detail Content with Schema.org Product markup */}
                    <article
                        className="grid md:grid-cols-2 gap-8"
                        itemScope
                        itemType="https://schema.org/Product"
                    >
                        {/* Hidden SEO meta tags */}
                        <meta itemProp="sku" content={product.id} />
                        <meta itemProp="productID" content={product.slug} />
                        <meta itemProp="brand" content={product.brands || 'SuperAgroBase'} />

                        {/* Product Images */}
                        <div>
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={`${product.title} - ${product.category?.title || 'Agricultural Product'} available at SuperAgroBase Nigeria`}
                                    className="w-full h-full object-cover"
                                    itemProp="image"
                                />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4" itemProp="name">
                                {product.title}
                            </h1>

                            {/* Rating with AggregateRating schema */}
                            {product.reviews_summary?.average_ratings > 0 && (
                                <div
                                    className="flex items-center gap-2 mb-4"
                                    itemProp="aggregateRating"
                                    itemScope
                                    itemType="https://schema.org/AggregateRating"
                                >
                                    <meta itemProp="ratingValue" content={product.reviews_summary.average_ratings} />
                                    <meta itemProp="reviewCount" content={product.reviews_summary.reviews_count || 0} />
                                    <meta itemProp="bestRating" content="5" />
                                    <meta itemProp="worstRating" content="1" />

                                    <div className="flex">
                                        <RatingStars ratings={product.reviews_summary.average_ratings} />
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        ({product.reviews_summary.reviews_count || 0} reviews)
                                    </span>
                                </div>
                            )}

                            {/* Price with Offer schema */}
                            <div
                                className="mb-6"
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
                                <link itemProp="url" href={`https://superoagrobase.com/products/${product.slug}`} />

                                <span className="text-3xl font-bold text-green-600">
                                    ₦{Number(product.price).toLocaleString()}
                                </span>

                                {product.discount_price && (
                                    <span className="text-xl text-gray-500 line-through ml-3">
                                        ₦{Number(product.discount_price).toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="mb-6">
                                {product.stock > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-green-600 font-medium">
                                            ✓ In Stock ({product.stock} available)
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        <span className="text-red-600 font-medium">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Category & Brand Tags */}
                            {(product.category || product.brands) && (
                                <div className="mb-6 flex flex-wrap gap-2">
                                    {product.category && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            {product.category.title}
                                        </span>
                                    )}
                                    {product.brands && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {product.brands}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-3">Product Description</h2>
                                <p className="text-gray-600 whitespace-pre-line leading-relaxed" itemProp="description">
                                    {product.description}
                                </p>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                disabled={product.stock === 0}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </article>

                    {/* Product Specifications - SEO Content */}
                    <section className="mt-12 border-t pt-8">
                        <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
                        <dl className="grid sm:grid-cols-2 gap-6">
                            {product.brands && (
                                <div>
                                    <dt className="font-semibold text-gray-700 mb-1">Brand</dt>
                                    <dd className="text-gray-600">{product.brands}</dd>
                                </div>
                            )}
                            {product.category && (
                                <div>
                                    <dt className="font-semibold text-gray-700 mb-1">Category</dt>
                                    <dd className="text-gray-600">{product.category.title}</dd>
                                </div>
                            )}
                            {product.subcategory && (
                                <div>
                                    <dt className="font-semibold text-gray-700 mb-1">Subcategory</dt>
                                    <dd className="text-gray-600">{product.subcategory.title}</dd>
                                </div>
                            )}
                            {product.pack_size && (
                                <div>
                                    <dt className="font-semibold text-gray-700 mb-1">Pack Size</dt>
                                    <dd className="text-gray-600">{product.pack_size}</dd>
                                </div>
                            )}
                            <div>
                                <dt className="font-semibold text-gray-700 mb-1">Product ID</dt>
                                <dd className="text-gray-600">{product.id}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-gray-700 mb-1">SKU</dt>
                                <dd className="text-gray-600">{product.slug}</dd>
                            </div>
                            {product.view_count > 0 && (
                                <div>
                                    <dt className="font-semibold text-gray-700 mb-1">Views</dt>
                                    <dd className="text-gray-600">{product.view_count.toLocaleString()}</dd>
                                </div>
                            )}
                            {product.status && (
                                <div>
                                    <dt className="font-semibold text-gray-700 mb-1">Status</dt>
                                    <dd className="text-gray-600 capitalize">{product.status.replace('_', ' ')}</dd>
                                </div>
                            )}
                        </dl>
                    </section>

                    {/* Ingredients/Components Section - SEO Rich Content */}
                    {product.ingredients && (
                        <section className="mt-8 border-t pt-8">
                            <h2 className="text-2xl font-bold mb-4">Ingredients/Components</h2>
                            <p className="text-gray-600 whitespace-pre-line">{product.ingredients}</p>
                        </section>
                    )}
                </main>
            </>
        );
    } catch (error) {
        console.error('[ProductPage] Error:', {
            message: error?.message,
            status: error?.status || error?.response?.status,
            slug: (await params)?.slug,
        });

        // Handle 404 errors
        if (error?.response?.status === 404 || error?.status === 404) {
            notFound();
        }

        // For any other errors, show 404 instead of 500
        // This prevents breaking the page and provides better UX
        notFound();
    }
}