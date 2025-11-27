// seo.jsonld.js
import { SCHEMA_BASE, PRODUCT_SCHEMA_CONFIG, FAQ_CONFIG, OFFER_CATALOG_CONFIG, toJsonLd } from "../config/seo.config";
import { SITE_DATA } from "../data";

// Home Layout
export function getOrganizationJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": SCHEMA_BASE.organization.type,
        "name": SCHEMA_BASE.organization.name,
        "legalName": SCHEMA_BASE.organization.legalName,
        "alternateName": SCHEMA_BASE.organization.alternateName,
        "url": SCHEMA_BASE.organization.url,
        "logo": toJsonLd(SCHEMA_BASE.logo),
        "description": SCHEMA_BASE.organization.description,
        "address": toJsonLd(SCHEMA_BASE.address),
        "geo": toJsonLd(SCHEMA_BASE.geo),
        "contactPoint": toJsonLd(SCHEMA_BASE.contactPoints),
        "sameAs": SCHEMA_BASE.sameAs,
        "foundingDate": SCHEMA_BASE.organization.foundingDate,
        "areaServed": toJsonLd(SCHEMA_BASE.areaServed)
    };
}

// Home Layout
export function getWebSiteJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebSite",
        "name": SCHEMA_BASE.organization.name,
        "url": SCHEMA_BASE.organization.url,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SCHEMA_BASE.organization.url}/products?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        },
        "publisher": {
            "@type": "Organization",
            "name": SCHEMA_BASE.organization.name,
            "logo": toJsonLd(SCHEMA_BASE.logo)
        }
    };
}

// Product page
export function getBreadcrumbJsonLd(items) {
    if (!items || items.length === 0) return null;

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "WebPage",
                "@id": item.url,
                "url": item.url,
                "name": item.name
            }
        }))
    };
}

// Product page
export function getProductJsonLd(product) {
    if (!product) return null;

    const {
        id,
        title,
        slug,
        price,
        discount_price,
        category,
        subcategory,
        brands,
        stock,
        ingredients,
        pack_size,
        reviews,
        reviews_summary,
        created_at,
    } = product;

    const productImages = PRODUCT_SCHEMA_CONFIG.getProductImages(product);
    const description = PRODUCT_SCHEMA_CONFIG.getProductDescription(product);
    const rating = reviews_summary?.average_ratings;
    const reviewCount = reviews_summary?.reviews_count;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Product",
        "@id": `${SITE_DATA.domain}/products/${slug}`,
        "name": title,
        "description": description,
        "url": `${SITE_DATA.domain}/products/${slug}`,
        "image": productImages.length ? productImages : [`${SITE_DATA.domain}/placeholder.jpg`],
        "sku": id.toString(),
        "mpn": id.toString(),
        "gtin13": id.toString().padStart(13, '0'),
        "brand": {
            "@type": "Brand",
            "name": brands || SITE_DATA.name
        },
        "manufacturer": {
            "@type": "Organization",
            "name": brands || SITE_DATA.name,
            "url": SITE_DATA.domain
        },
        "category": category?.title,
        ...(category?.title && { "category": category.title }),
        ...(subcategory?.title && { "additionalType": subcategory.title }),
        "url": `${SITE_DATA.domain}/products/${slug}`,

        // Enhanced offer information
        "offers": {
            "@type": "Offer",
            "url": `${SITE_DATA.domain}/products/${slug}`,
            "priceCurrency": "NGN",
            "price": price,
            "priceValidUntil": PRODUCT_SCHEMA_CONFIG.getPriceValidUntil(),
            "itemCondition": "https://schema.org/NewCondition",
            "availability": PRODUCT_SCHEMA_CONFIG.getAvailability(stock),
            ...(discount_price && discount_price > price && {
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": price,
                    "priceCurrency": "NGN",
                    "valueAddedTaxIncluded": false
                }
            }),
            "seller": {
                "@type": "Organization",
                "name": SITE_DATA.name,
                "url": SITE_DATA.domain
            },
            "shippingDetails": toJsonLd(PRODUCT_SCHEMA_CONFIG.shippingDetails),
            "hasMerchantReturnPolicy": toJsonLd(PRODUCT_SCHEMA_CONFIG.returnPolicy)
        },

        // Aggregate rating
        ...(rating && reviewCount && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": rating.toFixed(1),
                "reviewCount": reviewCount,
                "bestRating": "5",
                "worstRating": "1"
            }
        }),

        // Individual reviews
        ...(reviews && reviews.length > 0 && {
            "review": reviews.map(review => ({
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.rating,
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "author": {
                    "@type": "Person",
                    "name": review.user?.full_name ?? "Customer"
                },
                "reviewBody": review.comment,
                "datePublished": new Date(review.created_at).toISOString(),
            }))
        }),

        // Additional product details
        ...(ingredients && { "material": ingredients }),
        ...(pack_size && { "size": pack_size }),
        "datePublished": new Date(created_at).toISOString(),
        "releaseDate": new Date(created_at).toISOString()
    };
}

// Product page
export function getProductFAQJsonLd(product) {
    if (!product) return null;

    const faqs = FAQ_CONFIG.getProductFAQs(product);

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// Home page
export function getHomePageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/#webpage`,
        "url": SITE_DATA.domain,
        "name": `${SITE_DATA.name} - ${SITE_DATA.tagline}`,
        "description": SITE_DATA.descriptions.medium,
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": "Agriculture",
            "description": "Agricultural products and farming solutions"
        },
        "mainEntity": {
            "@type": "Store",
            "name": SITE_DATA.name,
            "image": SCHEMA_BASE.logo.url,
            "address": toJsonLd(SCHEMA_BASE.address),
            "geo": toJsonLd(SCHEMA_BASE.geo),
            "priceRange": SITE_DATA.business.priceRange,
            "telephone": SITE_DATA.phone,
            "email": SITE_DATA.email,
            "openingHoursSpecification": toJsonLd(SCHEMA_BASE.openingHours),
            "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Mobile Money"]
        }
    };
}

// Home page
export function getHomeFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": FAQ_CONFIG.homeFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// Home page
export function getOfferCatalogJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "OfferCatalog",
        "name": OFFER_CATALOG_CONFIG.name,
        "description": OFFER_CATALOG_CONFIG.description,
        "itemListElement": OFFER_CATALOG_CONFIG.categories.map(category => ({
            "@type": "OfferCatalog",
            "name": category.name,
            "description": category.description
        }))
    };
}

// Faq page
export function getFAQPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": FAQ_CONFIG?.faqsPAGE?.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export function getProductsListBreadcrumbJsonLd(params = {}) {
    const { category, subcategory } = params;

    const items = [
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Products',
            url: `${SITE_DATA.domain}/products`
        }
    ];

    if (category) {
        items.push({
            name: category,
            url: `${SITE_DATA.domain}/products?category=${encodeURIComponent(category)}`
        });
    }

    if (subcategory) {
        items.push({
            name: subcategory,
            url: `${SITE_DATA.domain}/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`
        });
    }

    return getBreadcrumbJsonLd(items);
}

export function getProductCollectionJsonLd(params = {}) {
    const {
        category,
        subcategory,
        search,
        products = [],
        totalProducts = 0,
        page = 1,
        totalPages = 1,
        perPage = 50
    } = params;

    const collectionName = subcategory || category || (search ? `Search: ${search}` : 'All Products');
    const description = category
        ? `Browse ${totalProducts} ${category.toLowerCase()} products available for purchase`
        : `Shop from ${totalProducts} quality agricultural products`;

    // Build base URL
    const baseUrl = new URL('/products', SITE_DATA.domain);
    if (category) baseUrl.searchParams.set('category', category);
    if (subcategory) baseUrl.searchParams.set('subcategory', subcategory);
    if (search) baseUrl.searchParams.set('search', search);

    // Calculate item positions for current page
    const startPosition = ((page - 1) * perPage) + 1;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "CollectionPage",
        "@id": `${baseUrl.toString()}#collection`,
        "name": `${collectionName}${page > 1 ? ` - Page ${page}` : ''} - ${SITE_DATA.name}`,
        "description": description,
        "url": baseUrl.toString(),
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": collectionName,
            "description": description
        },
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": totalProducts,
            "itemListElement": products.map((product, index) => ({
                "@type": "ListItem",
                "position": startPosition + index,
                "item": {
                    "@type": "Product",
                    "@id": `${SITE_DATA.domain}/products/${product.slug}`,
                    "name": product.title,
                    "url": `${SITE_DATA.domain}/products/${product.slug}`,
                    "image": product.image || `${SITE_DATA.domain}/placeholder.jpg`,
                    "offers": {
                        "@type": "Offer",
                        "price": product.price,
                        "priceCurrency": "NGN",
                        "availability": product.stock > 0
                            ? "https://schema.org/InStock"
                            : "https://schema.org/OutOfStock",
                        "url": `${SITE_DATA.domain}/products/${product.slug}`
                    },
                    ...(product.brands && {
                        "brand": {
                            "@type": "Brand",
                            "name": product.brands
                        }
                    }),
                    ...(product.reviews_summary?.average_ratings && {
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": product.reviews_summary.average_ratings.toFixed(1),
                            "reviewCount": product.reviews_summary.reviews_count || 0
                        }
                    })
                }
            }))
        },
        // Pagination markup for SEO
        ...(totalPages > 1 && {
            "pagination": {
                "@type": "ItemList",
                "numberOfItems": totalPages,
                "itemListElement": Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                    const pageNum = i + 1;
                    const pageUrl = new URL(baseUrl);
                    if (pageNum > 1) pageUrl.searchParams.set('page', pageNum.toString());

                    return {
                        "@type": "ListItem",
                        "position": pageNum,
                        "url": pageUrl.toString(),
                        "name": `Page ${pageNum}`
                    };
                })
            }
        }),
        // Previous/Next page links
        ...(page > 1 && {
            "previousPage": (() => {
                const prevUrl = new URL(baseUrl);
                if (page > 2) prevUrl.searchParams.set('page', (page - 1).toString());
                return prevUrl.toString();
            })()
        }),
        ...(page < totalPages && {
            "nextPage": (() => {
                const nextUrl = new URL(baseUrl);
                nextUrl.searchParams.set('page', (page + 1).toString());
                return nextUrl.toString();
            })()
        })
    };
}

export function getSearchResultsJsonLd(params = {}) {
    const { search, totalProducts = 0, products = [], page = 1 } = params;

    if (!search) return null;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "SearchResultsPage",
        "@id": `${SITE_DATA.domain}/products?search=${encodeURIComponent(search)}#search`,
        "name": `Search Results for "${search}"${page > 1 ? ` - Page ${page}` : ''}`,
        "url": `${SITE_DATA.domain}/products?search=${encodeURIComponent(search)}${page > 1 ? `&page=${page}` : ''}`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": totalProducts,
            "itemListElement": products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${SITE_DATA.domain}/products/${product.slug}`,
                "name": product.title
            }))
        }
    };
}