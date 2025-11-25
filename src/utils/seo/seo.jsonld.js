// seo.jsonld.js

import {
    SCHEMA_BASE,
    PRODUCT_SCHEMA_CONFIG,
    FAQ_CONFIG,
    OFFER_CATALOG_CONFIG,
    SERVICE_CONFIG,
    toJsonLd
} from "../config/seo.config";
import { SITE_DATA } from "../data";

/**
 * Generate Organization JSON-LD
 * Global schema that appears on all pages via root layout
 */
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

/**
 * Generate WebSite JSON-LD with SearchAction
 * Global schema for site-wide search functionality
 */
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

/**
 * Generate LocalBusiness JSON-LD
 * Use on contact page or location-specific pages
 */
export function getLocalBusinessJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "LocalBusiness",
        "name": SCHEMA_BASE.organization.name,
        "image": SCHEMA_BASE.logo.url,
        "telephone": SITE_DATA.phone,
        "email": SITE_DATA.email,
        "address": toJsonLd(SCHEMA_BASE.address),
        "geo": toJsonLd(SCHEMA_BASE.geo),
        "url": SCHEMA_BASE.organization.url,
        "priceRange": SITE_DATA.business.priceRange,
        "openingHoursSpecification": toJsonLd(SCHEMA_BASE.openingHours),
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "500",
            "bestRating": "5",
            "worstRating": "1"
        }
    };
}

/**
 * Generate Breadcrumb JSON-LD
 * @param {Array} items - Array of breadcrumb items with name and url
 * @example
 * getBreadcrumbJsonLd([
 *   { name: "Home", url: "https://..." },
 *   { name: "Products", url: "https://..." },
 *   { name: "Seeds", url: "https://..." }
 * ])
 */
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

/**
 * Generate Product JSON-LD Schema
 * Comprehensive product structured data for e-commerce
 * @param {Object} product - Product object with all details
 */
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

/**
 * Generate Product FAQPage JSON-LD
 * Common questions for product pages to get featured snippets
 * @param {Object} product - Product object
 */
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

/**
 * Generate WebPage JSON-LD for Homepage
 * Specific schema for the homepage/landing page
 */
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

/**
 * Generate FAQPage JSON-LD for Homepage
 * Common questions that help with featured snippets
 */
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

/**
 * Generate OfferCatalog JSON-LD for Homepage
 * Shows product categories in search results
 */
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

/**
 * Generate Article JSON-LD for Blog Posts
 * @param {Object} article - Article data with title, description, author, etc.
 */
export function getArticleJsonLd(article) {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt || article.description,
        "image": article.image,
        "datePublished": new Date(article.published_at || article.created_at).toISOString(),
        "dateModified": article.updated_at || article.created_at,
        "author": {
            "@type": "Person",
            "name": article.author || `${SITE_DATA.name} Team`
        },
        "publisher": {
            "@type": "Organization",
            "name": SITE_DATA.name,
            "logo": toJsonLd(SCHEMA_BASE.logo)
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_DATA.domain}/blog/${article.slug}`
        },
        "keywords": article.tags?.join(", ") || "",
        "articleSection": article.category || "Agriculture"
    };
}

/**
 * Generate CollectionPage JSON-LD for Category Pages
 * @param {Object} category - Category data with title, description, slug
 * @param {number} productCount - Number of products in category (optional)
 */
export function getCollectionPageJsonLd(category, productCount = 0) {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "CollectionPage",
        "name": category.title,
        "description": category.description || `Browse ${category.title} products at ${SITE_DATA.name}`,
        "url": `${SITE_DATA.domain}/products/categories/${category.slug}`,
        ...(productCount > 0 && {
            "numberOfItems": productCount
        }),
        "isPartOf": {
            "@type": "WebSite",
            "name": SITE_DATA.name,
            "url": SITE_DATA.domain
        }
    };
}

/**
 * Generate Service JSON-LD for Services Page
 */
export function getServiceJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Service",
        "name": SERVICE_CONFIG.name,
        "provider": {
            "@type": "Organization",
            "name": SITE_DATA.name,
            "url": SITE_DATA.domain
        },
        "serviceType": SERVICE_CONFIG.serviceType,
        "description": SITE_DATA.descriptions.long,
        "areaServed": toJsonLd(SCHEMA_BASE.areaServed),
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Agricultural Services",
            "itemListElement": SERVICE_CONFIG.services.map(service => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": service.name,
                    "description": service.description
                }
            }))
        }
    };
}

/**
 * Generate FAQPage JSON-LD with Dynamic Questions
 * @param {Array} faqs - Array of FAQ objects with question and answer
 */
export function getFAQPageJsonLd(faqs) {
    if (!faqs || faqs.length === 0) return null;

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

/**
 * Generate ItemList JSON-LD for Product Listings
 * Use on category pages, search results, etc.
 * @param {Array} products - Array of product objects
 * @param {string} listName - Name of the list (e.g., "Best Selling Products")
 */
export function getItemListJsonLd(products, listName = "Products") {
    if (!products || products.length === 0) return null;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "ItemList",
        "name": listName,
        "numberOfItems": products.length,
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${SITE_DATA.domain}/products/${product.slug}`,
            "name": product.title,
            "image": product.image
        }))
    };
}