import {
    generateProductMetadata,
    generateProductJsonLd,
    generateBreadcrumbJsonLd,
    generateOrganizationJsonLd
} from '@/utils/seo/product.seo';
import { ProductService } from '@/services/products.service';


export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
    let product = null
    try {
        const { slug } = await params;
        product = await ProductService.getProductBySlug(slug, {
            incrementView: false
        });
        return generateProductMetadata(product);
    } catch (error) {
        return generateProductMetadata(product);
    }
}


export async function generateStaticParams() {
    const products = await ProductService.getAllProducts();
    return products.map(({ slug }) => ({ slug }));
}


export default async function ProductPage({ params }) {
    let product = null
    try {
        const { slug } = await params;
        product = await getProductBySlug(slug, {
            incrementView: true
        });
        if (!product) notFound();
    } catch (error) {
        notFound();
    }


    const jsonLdScripts = [
        generateProductJsonLd(product),
        generateBreadcrumbJsonLd(product),
        generateOrganizationJsonLd()
    ];

    return (
        <>
            {jsonLdScripts.map((jsonLd, idx) => (
                <script
                    key={idx}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            ))}
            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
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

                {/* Product Detail Content */}
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
                        {/* Your product image gallery component */}
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

                        {/* Rating */}
                        {product.rating > 0 && (
                            <div
                                className="flex items-center gap-2 mb-4"
                                itemProp="aggregateRating"
                                itemScope
                                itemType="https://schema.org/AggregateRating"
                            >
                                <meta itemProp="ratingValue" content={product.rating} />
                                <meta itemProp="reviewCount" content={product.reviews || 0} />
                                <meta itemProp="bestRating" content="5" />
                                <meta itemProp="worstRating" content="1" />

                                <div className="flex">
                                    {/* Star rating component */}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating} ({product.reviews || 0} reviews)
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

                        {/* Category & Brand */}
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

                        {/* Add to Cart */}
                        <button
                            disabled={product.stock === 0}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </article>

                {/* Additional Product Details - SEO Content */}
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
                        {product.view_count && (
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

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="mb-6">

                    <h1>{product?.view_count}</h1>
                    <ol className="flex items-center space-x-2 text-sm">
                        <li><a href="/" className="text-gray-600 hover:text-green-600">Home</a></li>
                        <li className="text-gray-400">/</li>

                        <li><a href="/products" className="text-gray-600 hover:text-green-600">
                            Products
                        </a></li>

                        {product?.category && (
                            <>
                                <li className="text-gray-400">/</li>
                                <li>
                                    <a
                                        href={`/products/categories/${product.category.slug}`}
                                        className="text-gray-600 hover:text-green-600"
                                    >
                                        {product.category.title}
                                    </a>
                                </li>
                            </>
                        )}

                        <li className="text-gray-400">/</li>
                        <li className="text-gray-900 font-medium">{product.title}</li>
                    </ol>
                </nav>

                {/* Product Content */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div>{/* Product Images Component */}</div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-600">
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-green-600">
                                ₦{Number(product.price).toLocaleString()}
                            </span>
                        </div>

                        {/* Stock */}
                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <span className="text-green-600 font-medium">
                                    ✓ In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-red-600 font-medium">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-2">Description</h2>
                            <p className="text-gray-600 whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        <button
                            disabled={product.stock === 0}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300"
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>

                {/* Additional SEO Fields */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Product Details</h2>
                    <dl className="grid grid-cols-2 gap-4">
                        <div>
                            <dt className="font-semibold text-gray-700">Brand</dt>
                            <dd className="text-gray-600">{product.brands || 'SuperAgroBase'}</dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-gray-700">Category</dt>
                            <dd className="text-gray-600">{product.category?.title}</dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-gray-700">Pack Size</dt>
                            <dd className="text-gray-600">{product.pack_size}</dd>
                        </div>

                        <div>
                            <dt className="font-semibold text-gray-700">SKU</dt>
                            <dd className="text-gray-600">{product.id}</dd>
                        </div>
                    </dl>
                </div>
            </main>
        </>
    );
}
