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