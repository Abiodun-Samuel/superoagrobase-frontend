import { formatPrice } from "../helper";

export function generateProductMetadata(product) {
    if (!product) {
        return {
            title: 'Product Not Found | SuperAgroBase',
            description: 'The requested product could not be found.',
            robots: {
                index: false,
                follow: true,
            }
        };
    }

    const {
        title,
        description,
        slug,
        price,
        image,
        images,
        category,
        subcategory,
        brands,
        rating,
        reviews,
        stock,
        badges,
        keywords
    } = product;

    const formattedPrice = formatPrice(price)

    const seoTitle = `${title} - ${formattedPrice} | SuperAgroBase Nigeria`;

    // Generate SEO description (155-160 chars recommended)
    const seoDescription = description
        ? `${description.substring(0, 140)}... Buy genuine ${title} at ${formattedPrice}. Fast delivery across Nigeria. ⭐ ${rating}/5 (${reviews} reviews)`
        : `Buy ${title} at ${formattedPrice}. ${category?.title || 'Agricultural product'} with nationwide delivery. In stock at SuperAgroBase Nigeria.`;

    // Generate keywords
    const seoKeywords = [
        title,
        brands,
        category?.title,
        subcategory?.title,
        'buy online Nigeria',
        'agricultural supplies',
        'farm products Nigeria',
        'agro dealer',
        ...(badges || []),
        ...(keywords ? keywords.split(',') : [])
    ].filter(Boolean).join(', ');

    // Product URL
    const productUrl = `https://superoagrobase.com/products/${slug}`;

    // Get all product images
    const productImages = [
        image,
        ...(images ? JSON.parse(images) : [])
    ].filter(Boolean);

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,

        // Open Graph (Facebook, WhatsApp, LinkedIn)
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: productUrl,
            siteName: 'SuperAgroBase',
            images: productImages.map(img => ({
                url: img,
                width: 1200,
                height: 630,
                alt: title,
            })),
            locale: 'en_NG',
            type: "website",
            product: {
                priceAmount: price,
                priceCurrency: 'NGN',
                availability: stock > 0 ? 'in stock' : 'out of stock',
                condition: 'new',
                brand: brands || 'SuperAgroBase',
                category: category?.title
            }
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: productImages,
            creator: '@superoagrobase',
            site: '@superoagrobase'
        },

        // Additional metadata
        alternates: {
            canonical: productUrl,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        // Additional tags
        other: {
            'price': formattedPrice,
            'availability': stock > 0 ? 'in stock' : 'out of stock',
            'rating': rating,
            'review_count': reviews
        }
    };
}

export function generateProductJsonLd(product) {
    if (!product) return null;

    const {
        id,
        title,
        description,
        slug,
        price,
        image,
        images,
        category,
        brands,
        rating,
        reviews,
        stock,
    } = product;

    // Get all product images
    const productImages = [
        image,
        ...(images ? JSON.parse(images) : [])
    ].filter(Boolean);

    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": `https://superoagrobase.com/products/${slug}`,
        "name": title,
        "description": description || title,
        "image": productImages,
        "sku": id.toString(),
        "mpn": id.toString(),
        "gtin": id.toString(), // If you have GTINs, use actual values
        "brand": {
            "@type": "Brand",
            "name": brands || "SuperAgroBase"
        },
        "manufacturer": {
            "@type": "Organization",
            "name": brands || "SuperAgroBase"
        },
        "category": category?.title,
        "url": `https://superoagrobase.com/products/${slug}`,
        "offers": {
            "@type": "Offer",
            "url": `https://superoagrobase.com/products/${slug}`,
            "priceCurrency": "NGN",
            "price": price,
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Valid for 1 year
            "itemCondition": "https://schema.org/NewCondition",
            "availability": stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "SuperAgroBase",
                "url": "https://superoagrobase.com"
            },
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "NGN"
                },
                "shippingDestination": {
                    "@type": "DefinedRegion",
                    "addressCountry": "NG"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "businessDays": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
                    },
                    "cutoffTime": "18:00:00",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 0,
                        "maxValue": 1,
                        "unitCode": "DAY"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 2,
                        "unitCode": "DAY"
                    }
                }
            }
        },
        "aggregateRating": rating && reviews > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": reviews,
            "bestRating": "5",
            "worstRating": "1"
        } : undefined,
        "review": reviews > 0 ? {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": rating,
                "bestRating": "5"
            },
            "author": {
                "@type": "Organization",
                "name": "SuperAgroBase Customers"
            }
        } : undefined
    };
}

/**
 * Generate breadcrumb JSON-LD for product pages
 * @param {Object} product - Product object
 * @returns {Object} Breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(product) {
    if (!product) return null;

    const items = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://superoagrobase.com"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://superoagrobase.com/products"
        }
    ];

    if (product.category) {
        items.push({
            "@type": "ListItem",
            "position": 3,
            "name": product.category.title,
            "item": `https://superoagrobase.com/products/categories/${product.category.slug}`
        });
    }

    if (product.subcategory) {
        items.push({
            "@type": "ListItem",
            "position": 4,
            "name": product.subcategory.title,
            "item": `https://superoagrobase.com/products/categories/${product.category.slug}/${product.subcategory.slug}`
        });
    }

    items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": product.title,
        "item": `https://superoagrobase.com/products/${product.slug}`
    });

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    };
}

/**
 * Generate organization JSON-LD (use once per page)
 * @returns {Object} Organization JSON-LD
 */
export function generateOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SuperAgroBase",
        "alternateName": "SuperAgroBase Nigeria",
        "url": "https://superoagrobase.com",
        "logo": "https://superoagrobase.com/logo.png",
        "description": "Nigeria's leading agricultural supplies marketplace. Quality farm products, seeds, fertilizers, and equipment with nationwide delivery.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "NG",
            "addressRegion": "Oyo State",
            "addressLocality": "Ibadan"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+234-XXX-XXX-XXXX",
            "contactType": "customer service",
            "availableLanguage": ["en"]
        },
        "sameAs": [
            "https://facebook.com/superoagrobase",
            "https://twitter.com/superoagrobase",
            "https://instagram.com/superoagrobase"
        ]
    };
}

/**
 * Complete SEO setup for product detail page
 * Returns both metadata and JSON-LD scripts
 */
export function getProductPageSeo(product) {
    return {
        metadata: generateProductMetadata(product),
        jsonLd: {
            product: generateProductJsonLd(product),
            breadcrumb: generateBreadcrumbJsonLd(product),
            organization: generateOrganizationJsonLd()
        }
    };
}