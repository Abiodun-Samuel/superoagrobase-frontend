// seo.jsonld.js
import { SCHEMA_BASE, PRODUCT_SCHEMA_CONFIG, FAQ_CONFIG, OFFER_CATALOG_CONFIG, toJsonLd } from "../config/seo.config";
import { SITE_DATA } from "../data";
import { formatCount } from "../helper";

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

export function getFAQsBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'FAQs',
            url: `${SITE_DATA.domain}/faqs`
        }
    ]);
}

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

export function getCartBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Shopping Cart',
            url: `${SITE_DATA.domain}/cart`
        }
    ]);
}

export function getCartPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/cart#webpage`,
        "url": `${SITE_DATA.domain}/cart`,
        "name": `Shopping Cart - ${SITE_DATA.name}`,
        "description": "Manage your agricultural products shopping cart",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/cart`,
                        "name": "Shopping Cart"
                    }
                }
            ]
        },
        "potentialAction": {
            "@type": "BuyAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/checkout`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "seller": {
                "@type": "Organization",
                "name": SITE_DATA.name,
                "url": SITE_DATA.domain
            }
        }
    };
}

export function getAboutBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'About Us',
            url: `${SITE_DATA.domain}/about`
        }
    ]);
}

export function getAboutPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "AboutPage",
        "@id": `${SITE_DATA.domain}/about#aboutpage`,
        "url": `${SITE_DATA.domain}/about`,
        "name": `About ${SITE_DATA.name}`,
        "description": SITE_DATA.descriptions.long,
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`,
            "name": SITE_DATA.name,
            "url": SITE_DATA.domain
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/about`,
                        "name": "About Us"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        }
    };
}

export function getAboutOrganizationJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Organization",
        "@id": `${SITE_DATA.domain}/#organization`,
        "name": SCHEMA_BASE.organization.name,
        "legalName": SCHEMA_BASE.organization.legalName,
        "alternateName": SCHEMA_BASE.organization.alternateName,
        "url": SCHEMA_BASE.organization.url,
        "logo": toJsonLd(SCHEMA_BASE.logo),
        "description": SCHEMA_BASE.organization.description,
        "foundingDate": SCHEMA_BASE.organization.foundingDate,
        "address": toJsonLd(SCHEMA_BASE.address),
        "geo": toJsonLd(SCHEMA_BASE.geo),
        "contactPoint": toJsonLd(SCHEMA_BASE.contactPoints),
        "sameAs": SCHEMA_BASE.sameAs,
        "areaServed": toJsonLd(SCHEMA_BASE.areaServed),
        "email": SITE_DATA.email,
        "telephone": SITE_DATA.phone,
        "priceRange": SITE_DATA.business.priceRange,
        "openingHoursSpecification": toJsonLd(SCHEMA_BASE.openingHours),
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Agricultural Products & Services",
            "itemListElement": [
                {
                    "@type": "OfferCatalog",
                    "name": "Seeds",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Agricultural Seeds"
                            }
                        }
                    ]
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Fertilizers",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Farm Fertilizers"
                            }
                        }
                    ]
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Pesticides & Herbicides",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Crop Protection Products"
                            }
                        }
                    ]
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Farm Equipment",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Agricultural Machinery"
                            }
                        }
                    ]
                }
            ]
        },
        "knowsAbout": [
            "Agriculture",
            "Farming",
            "Crop Production",
            "Agricultural Inputs",
            "Farm Management",
            "Sustainable Farming",
            "Nigerian Agriculture"
        ],
        "slogan": SITE_DATA.tagline,
        "brand": {
            "@type": "Brand",
            "name": SITE_DATA.name,
            "logo": toJsonLd(SCHEMA_BASE.logo)
        }
    };
}

export function getAboutFAQJsonLd() {

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": FAQ_CONFIG?.aboutFAQs?.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export function getLocalBusinessJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "LocalBusiness",
        "@id": `${SITE_DATA.domain}/#localbusiness`,
        "name": SITE_DATA.name,
        "image": toJsonLd(SCHEMA_BASE.logo),
        "address": toJsonLd(SCHEMA_BASE.address),
        "geo": toJsonLd(SCHEMA_BASE.geo),
        "url": SITE_DATA.domain,
        "telephone": SITE_DATA.phone,
        "email": SITE_DATA.email,
        "priceRange": SITE_DATA.business.priceRange,
        "openingHoursSpecification": toJsonLd(SCHEMA_BASE.openingHours),
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Mobile Money"],
        "currenciesAccepted": "NGN",
        "areaServed": [
            {
                "@type": "Country",
                "name": "Nigeria"
            },
            {
                "@type": "State",
                "name": SITE_DATA.address.state
            }
        ],
        ...(SITE_DATA.geo.latitude && SITE_DATA.geo.longitude && {
            "hasMap": `https://www.google.com/maps?q=${SITE_DATA.geo.latitude},${SITE_DATA.geo.longitude}`
        }),
        "description": SITE_DATA.descriptions.medium,
        "knowsAbout": [
            "Agricultural Products",
            "Farm Supplies",
            "Seeds",
            "Fertilizers",
            "Pesticides",
            "Farm Equipment"
        ]
    };
}

export function getAgroInputJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Service",
        "@id": `${SITE_DATA.domain}/services/agro-input#service`,
        "serviceType": "Agricultural Input Quality Assurance & Research",
        "name": "Agro-Input Products Claims Authentication & Research",
        "description": "Authentication of manufacturer claims on agro-input products approved by SON and NAFDAC through quality research and promotion to over 10,000 farmers.",
        "provider": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        },
        "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Agricultural Input Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Product Claims Authentication",
                        "description": "Verification of manufacturer claims for SON and NAFDAC approved agricultural products"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Research & Testing",
                        "description": "Comprehensive testing on 3-hectare research facility under real farming conditions"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Product Promotion",
                        "description": "Strategic promotion to network of 10,000+ registered farmers"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Distribution Network",
                        "description": "Nationwide agro-input dealer network for product availability"
                    }
                }
            ]
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Small-scale and commercial farmers",
            "geographicArea": {
                "@type": "Country",
                "name": "Nigeria"
            }
        }
    };
}

export function getAgriCourtVenturesJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Store",
        "@id": `${SITE_DATA.domain}/services/agricourt-ventures#store`,
        "name": "AgriCourt Ventures",
        "description": "Quality agricultural input products including seeds, fertilizers, irrigation systems, growing media, greenhouses, crop protection, and farm machinery.",
        "url": `${SITE_DATA.domain}/services/agricourt-ventures`,
        "parentOrganization": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Agricultural Input Products",
            "itemListElement": [
                {
                    "@type": "OfferCatalog",
                    "name": "Premium Seeds",
                    "description": "High-quality certified seeds for maximum germination and yield"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Fertilizers & Nutrition",
                    "description": "Granular and water-soluble fertilizers for optimal plant growth"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Growing Media",
                    "description": "Cocopeat, Peat moss, and Worm compost for superior plant health"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Protected Cultivation",
                    "description": "Greenhouses, net houses, shade nets, and insect protection"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Cultivation Tools",
                    "description": "Seedling trays, grow bags, mulch film, and drip systems"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Crop Protection",
                    "description": "Pesticides, herbicides, fungicides, and bio-controls"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Irrigation Systems",
                    "description": "Drip irrigation, sprinklers, pumps, and controllers"
                },
                {
                    "@type": "OfferCatalog",
                    "name": "Farm Mechanization",
                    "description": "Tractors, implements, harvesters, and processing equipment"
                }
            ]
        },
        "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
        },
        "priceRange": SITE_DATA.business.priceRange,
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer"]
    };
}

export function getHarvestYieldFarmJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": ["Farm", "Service"],
        "@id": `${SITE_DATA.domain}/services/harvestyield-farm#farm`,
        "name": "HarvestYield Farm",
        "description": "10-hectare farm dedicated to premium vegetable production with professional farm management and consultancy services.",
        "url": `${SITE_DATA.domain}/services/harvestyield-farm`,
        "parentOrganization": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        },
        "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
        },
        "knowsAbout": [
            "Vegetable Production",
            "Farm Management",
            "Agricultural Consultancy",
            "Soil Analysis",
            "Crop Nutrition"
        ],
        "makesOffer": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Premium Tomatoes",
                    "description": "High-quality tomatoes grown with precision agriculture"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Fresh Cucumbers",
                    "description": "Crisp cucumbers cultivated under optimal conditions"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Sweetcorn",
                    "description": "Sweet, tender corn varieties with superior taste"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Special Watermelon",
                    "description": "Premium watermelon varieties with exceptional sweetness"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Product",
                    "name": "Quality Peppers",
                    "description": "High-quality pepper varieties for diverse applications"
                }
            }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Farm Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Farm Management Services",
                        "description": "Professional farm management leveraging best practices and modern techniques"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Agricultural Consultancy",
                        "description": "Expert guidance on crop selection, planning, and optimization"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Soil Analysis",
                        "description": "Comprehensive soil testing for nutrient levels and pH balance"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Laboratory Services",
                        "description": "Fertilizer and manure analysis through reputable laboratory partnerships"
                    }
                }
            ]
        },
        "address": toJsonLd(SCHEMA_BASE.address),
        "geo": toJsonLd(SCHEMA_BASE.geo)
    };
}

export function getAgroInputBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Services',
            url: `${SITE_DATA.domain}/services`
        },
        {
            name: 'Agro-Input Authentication',
            url: `${SITE_DATA.domain}/services/agro-input`
        }
    ]);
}

export function getAgriCourtVenturesBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Services',
            url: `${SITE_DATA.domain}/services`
        },
        {
            name: 'AgriCourt Ventures',
            url: `${SITE_DATA.domain}/services/agricourt-ventures`
        }
    ]);
}

export function getHarvestYieldFarmBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Services',
            url: `${SITE_DATA.domain}/services`
        },
        {
            name: 'HarvestYield Farm',
            url: `${SITE_DATA.domain}/services/harvestyield-farm`
        }
    ]);
}

export function getContactBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Contact Us',
            url: `${SITE_DATA.domain}/contact`
        }
    ]);
}

export function getContactPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "ContactPage",
        "@id": `${SITE_DATA.domain}/contact#contactpage`,
        "url": `${SITE_DATA.domain}/contact`,
        "name": `Contact ${SITE_DATA.name}`,
        "description": `Get in touch with ${SITE_DATA.name} for agricultural products, farm supplies, and expert advice. Multiple contact options available.`,
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/contact`,
                        "name": "Contact Us"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        }
    };
}

export function getContactOrganizationJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Organization",
        "@id": `${SITE_DATA.domain}/#organization`,
        "name": SCHEMA_BASE.organization.name,
        "url": SCHEMA_BASE.organization.url,
        "logo": toJsonLd(SCHEMA_BASE.logo),
        "description": SCHEMA_BASE.organization.description,
        "address": toJsonLd(SCHEMA_BASE.address),
        "geo": toJsonLd(SCHEMA_BASE.geo),
        "telephone": SITE_DATA.phone,
        "email": SITE_DATA.email,
        "contactPoint": toJsonLd(SCHEMA_BASE.contactPoints),
        "openingHoursSpecification": toJsonLd(SCHEMA_BASE.openingHours),
        "areaServed": toJsonLd(SCHEMA_BASE.areaServed),
        "sameAs": SCHEMA_BASE.sameAs,
        ...(SITE_DATA.geo.latitude && SITE_DATA.geo.longitude && {
            "hasMap": `https://www.google.com/maps?q=${SITE_DATA.geo.latitude},${SITE_DATA.geo.longitude}`
        })
    };
}

export function getContactLocalBusinessJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "LocalBusiness",
        "@id": `${SITE_DATA.domain}/#localbusiness`,
        "name": SITE_DATA.name,
        "image": toJsonLd(SCHEMA_BASE.logo),
        "address": toJsonLd(SCHEMA_BASE.address),
        "geo": toJsonLd(SCHEMA_BASE.geo),
        "url": SITE_DATA.domain,
        "telephone": SITE_DATA.phone,
        "email": SITE_DATA.email,
        "priceRange": SITE_DATA.business.priceRange,
        "openingHoursSpecification": toJsonLd(SCHEMA_BASE.openingHours),
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Mobile Money"],
        "currenciesAccepted": "NGN",
        "areaServed": [
            {
                "@type": "Country",
                "name": "Nigeria"
            },
            {
                "@type": "State",
                "name": SITE_DATA.address.state
            },
            {
                "@type": "City",
                "name": SITE_DATA.address.city
            }
        ],
        ...(SITE_DATA.geo.latitude && SITE_DATA.geo.longitude && {
            "hasMap": `https://www.google.com/maps?q=${SITE_DATA.geo.latitude},${SITE_DATA.geo.longitude}`
        }),
        "description": SITE_DATA.descriptions.medium,
        "sameAs": SCHEMA_BASE.sameAs
    };
}

export function getContactFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What are your business hours?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `We are open Monday to Friday from ${SITE_DATA.business.openingHours.weekdays.open} to ${SITE_DATA.business.openingHours.weekdays.close}, and Saturday from ${SITE_DATA.business.openingHours.saturday.open} to ${SITE_DATA.business.openingHours.saturday.close}. We are closed on Sundays and public holidays.`
                }
            },
            {
                "@type": "Question",
                "name": "How can I contact customer service?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `You can reach our customer service team by phone at ${SITE_DATA.phone}, email at ${SITE_DATA.email}, or visit our office at ${SITE_DATA.address.street}, ${SITE_DATA.address.city}, ${SITE_DATA.address.state}. You can also use the contact form on our website for inquiries.`
                }
            },
            {
                "@type": "Question",
                "name": "Where is your office located?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Our office is located at ${SITE_DATA.address.street}, ${SITE_DATA.address.city}, ${SITE_DATA.address.state}, ${SITE_DATA.address.country}. We serve customers nationwide across Nigeria with delivery to all states.`
                }
            },
            {
                "@type": "Question",
                "name": "How quickly will I get a response?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please call our customer service line for immediate assistance."
                }
            },
            {
                "@type": "Question",
                "name": "Do you provide technical support for products?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we provide technical support and agricultural consultancy for all our products. Our team of experts can help with product selection, usage instructions, and farming best practices. Contact us for personalized assistance."
                }
            }
        ]
    };
}

export function getRegisterBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Create Account',
            url: `${SITE_DATA.domain}/auth/register`
        }
    ]);
}

export function getRegisterPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/auth/register#webpage`,
        "url": `${SITE_DATA.domain}/auth/register`,
        "name": `Create Account - ${SITE_DATA.name}`,
        "description": `Sign up for ${SITE_DATA.name} to access quality agricultural products and exclusive deals`,
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "potentialAction": {
            "@type": "RegisterAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/auth/register`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "result": {
                "@type": "UserAccount",
                "name": "New User Account"
            }
        }
    };
}

export function getLoginBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Login',
            url: `${SITE_DATA.domain}/auth/login`
        }
    ]);
}

export function getLoginPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/auth/login#webpage`,
        "url": `${SITE_DATA.domain}/auth/login`,
        "name": `Login - ${SITE_DATA.name}`,
        "description": "Sign in to your account to access orders, track deliveries, and manage your profile",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "potentialAction": {
            "@type": "LoginAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/auth/login`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            }
        }
    };
}

export function getForgotPasswordBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Forgot Password',
            url: `${SITE_DATA.domain}/auth/forgot-password`
        }
    ]);
}

// Forgot Password Page Schema
export function getForgotPasswordPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/auth/forgot-password#webpage`,
        "url": `${SITE_DATA.domain}/auth/forgot-password`,
        "name": `Forgot Password - ${SITE_DATA.name}`,
        "description": "Reset your account password securely with email verification",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "mainEntity": {
            "@type": "HowTo",
            "name": "How to Reset Your Password",
            "step": [
                {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Enter Email",
                    "text": "Enter your registered email address in the form"
                },
                {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "Check Email",
                    "text": "Check your email inbox for the password reset link"
                },
                {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Create New Password",
                    "text": "Click the link and create a new secure password"
                }
            ]
        }
    };
}

// Verify Email Page Schema
export function getVerifyEmailPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/auth/verify-email#webpage`,
        "url": `${SITE_DATA.domain}/auth/verify-email`,
        "name": `Verify Email - ${SITE_DATA.name}`,
        "description": "Verify your email address to activate your account",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "potentialAction": {
            "@type": "ConfirmAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/auth/verify-email`
            }
        }
    };
}

// Authentication FAQ Schema
export function getAuthFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I create an account?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Click on the 'Register' or 'Sign Up' button, fill in your details including name, email, and password. You'll receive a verification email to activate your ${SITE_DATA.name} account. Complete the verification to start shopping.`
                }
            },
            {
                "@type": "Question",
                "name": "What if I forgot my password?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Click on 'Forgot Password' on the login page, enter your registered email address, and you'll receive a password reset link. Follow the link to create a new secure password for your account."
                }
            },
            {
                "@type": "Question",
                "name": "How do I verify my email address?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "After registration, check your email inbox for a verification message from us. Click the verification link in the email to activate your account. If you didn't receive the email, check your spam folder or request a new verification link."
                }
            },
            {
                "@type": "Question",
                "name": "Is my account information secure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, we use industry-standard encryption and security measures to protect your account information. Your password is encrypted, and we comply with Nigeria Data Protection Regulation (NDPR) to ensure your data privacy and security.`
                }
            },
            {
                "@type": "Question",
                "name": "Can I change my password after registration?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can change your password anytime from your account settings or profile page. For security, we recommend using a strong password with a mix of letters, numbers, and special characters."
                }
            },
            {
                "@type": "Question",
                "name": "What should I do if I can't login to my account?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `First, verify you're using the correct email and password. If you forgot your password, use the 'Forgot Password' option. If your account is locked, contact our customer service at ${SITE_DATA.email} or call ${SITE_DATA.phone} for assistance.`
                }
            },
            {
                "@type": "Question",
                "name": "Do I need an account to make purchases?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While you can browse products without an account, creating an account allows you to track orders, save favorite items, get personalized recommendations, access exclusive deals, and enjoy a faster checkout process."
                }
            },
            {
                "@type": "Question",
                "name": "How long does the verification link last?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Email verification links typically expire after 24 hours for security reasons. If your link has expired, you can request a new verification email from the resend verification page."
                }
            }
        ]
    };
}

// Reset Password Breadcrumb Schema
export function getResetPasswordBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Reset Password',
            url: `${SITE_DATA.domain}/auth/reset-password`
        }
    ]);
}

// Reset Password Page Schema
export function getResetPasswordPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/auth/reset-password#webpage`,
        "url": `${SITE_DATA.domain}/auth/reset-password`,
        "name": `Reset Password - ${SITE_DATA.name}`,
        "description": "Create a new secure password for your account",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/auth/reset-password`,
                        "name": "Reset Password"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "HowTo",
            "name": "How to Reset Your Password",
            "description": "Step-by-step guide to creating a new password for your account",
            "step": [
                {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Enter New Password",
                    "text": "Create a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters"
                },
                {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "Confirm Password",
                    "text": "Re-enter your new password to confirm it matches"
                },
                {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Submit",
                    "text": "Click the reset button to save your new password and access your account"
                }
            ],
            "totalTime": "PT2M"
        },
        "potentialAction": {
            "@type": "UpdateAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/auth/reset-password`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "object": {
                "@type": "DigitalDocument",
                "name": "User Password"
            }
        }
    };
}

// Reset Password FAQ Schema
export function getResetPasswordFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I reset my password?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Click the password reset link sent to your email, then enter and confirm your new password on the reset page. Make sure your new password is strong and secure with a mix of characters."
                }
            },
            {
                "@type": "Question",
                "name": "What makes a strong password?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A strong password should be at least 8 characters long and include a combination of uppercase letters, lowercase letters, numbers, and special characters (like !@#$%). Avoid using common words or personal information."
                }
            },
            {
                "@type": "Question",
                "name": "How long is the password reset link valid?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Password reset links are valid for 24 hours from the time they are sent. If your link has expired, you can request a new one from the forgot password page."
                }
            },
            {
                "@type": "Question",
                "name": "What if the reset link doesn't work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "If the reset link doesn't work, it may have expired or been used already. Request a new password reset link from the forgot password page. If issues persist, contact our support team for assistance."
                }
            },
            {
                "@type": "Question",
                "name": "Will I be logged out of other devices after resetting my password?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, for security reasons, resetting your password will log you out of all devices. You'll need to log in again with your new password on each device you use."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use my old password again?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For security purposes, we recommend using a new, unique password that you haven't used before. This helps protect your account from unauthorized access."
                }
            },
            {
                "@type": "Question",
                "name": "What should I do after resetting my password?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "After successfully resetting your password, log in with your new credentials. We recommend enabling two-factor authentication if available and reviewing your account security settings for additional protection."
                }
            }
        ]
    };
}

export function getPasswordSecurityTipsJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "HowTo",
        "name": "Password Security Best Practices",
        "description": "Essential tips to create and maintain a secure password for your account",
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Use a Strong Password",
                "text": "Create passwords with at least 8 characters combining uppercase, lowercase, numbers, and symbols"
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Avoid Common Patterns",
                "text": "Don't use sequential numbers, repeated characters, or common words like 'password' or '123456'"
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Use Unique Passwords",
                "text": "Never reuse passwords across different websites or services"
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Update Regularly",
                "text": "Change your password periodically, especially if you suspect unauthorized access"
            },
            {
                "@type": "HowToStep",
                "position": 5,
                "name": "Keep It Private",
                "text": "Never share your password with anyone or write it down in accessible places"
            }
        ],
        "totalTime": "PT5M"
    };
}


// Add to seo.jsonld.js

export function getBecomeVendorBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Become a Vendor',
            url: `${SITE_DATA.domain}/become-a-vendor`
        }
    ]);
}

export function getBecomeVendorPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/become-a-vendor#webpage`,
        "url": `${SITE_DATA.domain}/become-a-vendor`,
        "name": `Become a Vendor - ${SITE_DATA.name}`,
        "description": `Join ${SITE_DATA.name}'s vendor marketplace. List your agricultural products, set your prices, and connect with thousands of buyers across Nigeria.`,
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/become-a-vendor`,
                        "name": "Become a Vendor"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "ProgramMembership",
            "name": "Vendor Partnership Program",
            "programName": `${SITE_DATA.name} Vendor Marketplace`,
            "description": "Join our vendor marketplace to list your agricultural products and reach thousands of buyers",
            "url": `${SITE_DATA.domain}/become-a-vendor`,
            "applicationStartDate": new Date().toISOString(),
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "NGN",
                "description": "Free registration with commission-based pricing"
            }
        }
    };
}

export function getVendorProgramJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Service",
        "@id": `${SITE_DATA.domain}/become-a-vendor#service`,
        "serviceType": "Vendor Marketplace Program",
        "name": "Agricultural Vendor Partnership",
        "description": "Join Nigeria's fastest growing agricultural marketplace. List your products, set your prices, and connect with thousands of verified buyers nationwide.",
        "provider": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        },
        "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "NGN",
            "availability": "https://schema.org/InStock",
            "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "0",
                "priceCurrency": "NGN",
                "description": "Free registration - commission on sales only"
            }
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Vendor Benefits",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Customer Acquisition",
                        "description": "Access to 50,000+ monthly active buyers"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Pricing Control",
                        "description": "Set and adjust your own product prices"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Instant Notifications",
                        "description": "Real-time order notifications via SMS and email"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Weekly Payments",
                        "description": "Automatic bank transfers every Friday"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Performance Dashboard",
                        "description": "Track orders, sales, and revenue in real-time"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "24/7 Support",
                        "description": "Dedicated support team available round the clock"
                    }
                }
            ]
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Agricultural vendors, farmers, markets, distributors, and suppliers",
            "geographicArea": {
                "@type": "Country",
                "name": "Nigeria"
            }
        },
        "termsOfService": `${SITE_DATA.domain}/terms-of-service`,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "5000",
            "bestRating": "5",
            "worstRating": "1"
        }
    };
}

export function getBecomeVendorFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What are the requirements to become a vendor?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You need a registered business or established market, valid contact information, and agricultural products available for sale. We welcome farmers, markets, distributors, processors, and cooperatives."
                }
            },
            {
                "@type": "Question",
                "name": "How do I receive orders from buyers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When a buyer places an order for your products, you receive an instant notification via SMS and email. You can also track all orders in real-time through your vendor dashboard."
                }
            },
            {
                "@type": "Question",
                "name": "How much does it cost to join?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Registration is completely free. We only charge a small commission on successful sales, which means our success is directly tied to yours. No hidden fees or monthly subscriptions."
                }
            },
            {
                "@type": "Question",
                "name": "How do I set prices for my products?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "After approval, you access our product catalog and select items available in your market. You set your own competitive prices and can adjust them anytime through your dashboard based on market conditions."
                }
            },
            {
                "@type": "Question",
                "name": "When and how do I get paid?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Payments are processed weekly via direct bank transfer every Friday. You receive payment for all orders successfully delivered in the previous week, with complete transaction transparency."
                }
            },
            {
                "@type": "Question",
                "name": "What if I need help or have questions?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Our dedicated support team is available 24/7 via phone at ${SITE_DATA.phone}, email at ${SITE_DATA.email}, and WhatsApp. We provide onboarding training and ongoing support to ensure your success on the platform.`
                }
            }
        ]
    };
}

export function getVendorApplicationHowToJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "HowTo",
        "name": "How to Become a Vendor on SuperoAgrobase",
        "description": "Step-by-step guide to joining Nigeria's leading agricultural marketplace as a vendor",
        "totalTime": "PT10M",
        "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "NGN",
            "value": "0"
        },
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Apply & Get Verified",
                "text": "Submit your application with business details. Our team verifies and approves qualified vendors within 24-48 hours.",
                "url": `${SITE_DATA.domain}/become-a-vendor#apply`
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "List Products & Set Prices",
                "text": "Browse our product catalog, select items available in your market, and set your competitive prices.",
                "url": `${SITE_DATA.domain}/become-a-vendor`
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Receive Orders & Get Paid",
                "text": "When buyers order from you, we notify you immediately. Fulfill orders and receive weekly payments directly to your bank.",
                "url": `${SITE_DATA.domain}/become-a-vendor`
            }
        ],
        "supply": [
            {
                "@type": "HowToSupply",
                "name": "Business Registration Documents"
            },
            {
                "@type": "HowToSupply",
                "name": "Valid Contact Information"
            },
            {
                "@type": "HowToSupply",
                "name": "Bank Account Details"
            }
        ],
        "tool": [
            {
                "@type": "HowToTool",
                "name": "Vendor Dashboard"
            },
            {
                "@type": "HowToTool",
                "name": "Mobile Phone for Notifications"
            }
        ]
    };
}

// Add these functions to your seo.jsonld.js file

/**
 * Blog Page Breadcrumb Schema
 */
export function getBlogBreadcrumbJsonLd(params = {}) {
    const { category, search } = params;

    const items = [
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Blog',
            url: `${SITE_DATA.domain}/blog`
        }
    ];

    if (category && category !== 'All Stories') {
        items.push({
            name: category,
            url: `${SITE_DATA.domain}/blog?category=${encodeURIComponent(category)}`
        });
    }

    if (search) {
        items.push({
            name: `Search: ${search}`,
            url: `${SITE_DATA.domain}/blog?search=${encodeURIComponent(search)}`
        });
    }

    return getBreadcrumbJsonLd(items);
}

/**
 * Blog Collection Page Schema
 * Optimized for search engines to understand blog structure
 */
export function getBlogCollectionJsonLd(params = {}) {
    const {
        category,
        search,
        posts = [],
        totalPosts = 0,
        page = 1,
        totalPages = 1,
        featuredPosts = []
    } = params;

    const collectionName = category && category !== 'All Stories'
        ? category
        : (search ? `Search: ${search}` : 'Agricultural Stories & Insights');

    const description = category && category !== 'All Stories'
        ? `Explore ${totalPosts} expert articles on ${category.toLowerCase()} in agriculture`
        : `Discover ${totalPosts}+ in-depth stories on regenerative farming, AgTech innovation, climate action, and sustainable agriculture`;

    // Build base URL
    const baseUrl = new URL('/blog', SITE_DATA.domain);
    if (category && category !== 'All Stories') baseUrl.searchParams.set('category', category);
    if (search) baseUrl.searchParams.set('search', search);

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "CollectionPage",
        "@id": `${baseUrl.toString()}#collection`,
        "name": `${collectionName}${page > 1 ? ` - Page ${page}` : ''} - ${SITE_DATA.name} Blog`,
        "description": description,
        "url": baseUrl.toString(),
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": "Agricultural Innovation and Sustainability",
            "description": "Expert insights on regenerative farming, AgTech, climate action, and the future of agriculture"
        },
        "primaryImageOfPage": featuredPosts.length > 0 ? {
            "@type": "ImageObject",
            "url": featuredPosts[0].image,
            "width": 1600,
            "height": 1200,
            "caption": featuredPosts[0].title
        } : null,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": totalPosts,
            "itemListElement": posts.map((post, index) => ({
                "@type": "ListItem",
                "position": ((page - 1) * posts.length) + index + 1,
                "item": {
                    "@type": "BlogPosting",
                    "@id": `${SITE_DATA.domain}/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                    "headline": post.title,
                    "description": post.excerpt,
                    "image": post.image,
                    "datePublished": new Date(post.created_at).toISOString(),
                    "dateModified": new Date(post.updated_at).toISOString(),
                    "author": {
                        "@type": "Person",
                        "name": post.author,
                        "jobTitle": post.authorRole
                    },
                    "publisher": {
                        "@type": "Organization",
                        "@id": `${SITE_DATA.domain}/#organization`
                    },
                    "articleSection": post.category,
                    "keywords": `${post.category}, agriculture, farming, Nigeria`,
                    "wordCount": parseInt(post.readTime) * 200, // Approximate
                    "timeRequired": post.readTime,
                    "thumbnailUrl": post.image,
                    "url": `${SITE_DATA.domain}/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `${SITE_DATA.domain}/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                    },
                    ...(post.featured && {
                        "backstory": "Featured story highlighting innovation in agriculture"
                    }),
                    "interactionStatistic": {
                        "@type": "InteractionCounter",
                        "interactionType": "https://schema.org/ReadAction",
                        "userInteractionCount": formatCount(post?.views_count),
                    }
                }
            }))
        },
        ...(totalPages > 1 && page < totalPages && {
            "relatedLink": {
                "@type": "WebPage",
                "url": (() => {
                    const nextUrl = new URL(baseUrl);
                    nextUrl.searchParams.set('page', (page + 1).toString());
                    return nextUrl.toString();
                })()
            }
        })
    };
}

/**
 * Blog Website Schema
 * Defines the blog section of the website
 */
export function getBlogWebsiteJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "Blog",
        "@id": `${SITE_DATA.domain}/blog#blog`,
        "url": `${SITE_DATA.domain}/blog`,
        "name": `${SITE_DATA.name} Blog - Agricultural Insights & Innovation`,
        "description": "In-depth stories exploring innovation, sustainability, and the people reshaping agriculture for a better tomorrow. Expert insights on regenerative farming, AgTech, climate action, and market intelligence.",
        "inLanguage": "en-NG",
        "publisher": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        },
        "blogPost": [
            // Featured categories
            {
                "@type": "BlogPosting",
                "headline": "Regenerative Farming",
                "description": "Stories about soil health, carbon sequestration, and regenerative agriculture practices"
            },
            {
                "@type": "BlogPosting",
                "headline": "AgTech Innovation",
                "description": "Cutting-edge technology transforming agriculture in Nigeria and globally"
            },
            {
                "@type": "BlogPosting",
                "headline": "Climate Action",
                "description": "Climate-resilient farming and agricultural solutions to environmental challenges"
            },
            {
                "@type": "BlogPosting",
                "headline": "Market Intelligence",
                "description": "Economic analysis and market insights for the agricultural sector"
            },
            {
                "@type": "BlogPosting",
                "headline": "Community Stories",
                "description": "Inspiring stories of farming communities and collaborative agriculture"
            }
        ],
        "audience": {
            "@type": "Audience",
            "audienceType": "Farmers, agricultural professionals, agribusiness leaders, researchers, and sustainability advocates",
            "geographicArea": {
                "@type": "Country",
                "name": "Nigeria"
            }
        }
    };
}

/**
 * Individual Blog Post Schema
 * For when you implement individual blog post pages
 */
export function getBlogPostJsonLd(post) {
    if (!post) return null;

    const {
        id,
        title,
        excerpt,
        image,
        category,
        author,
        authorRole,
        date,
        readTime,
        views,
        featured
    } = post;

    const postUrl = `${SITE_DATA.domain}/blog/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "BlogPosting",
        "@id": `${postUrl}#blogpost`,
        "headline": title,
        "description": excerpt,
        "image": {
            "@type": "ImageObject",
            "url": image,
            "width": 1600,
            "height": 1200,
            "caption": title
        },
        "datePublished": new Date(date).toISOString(),
        "dateModified": new Date(date).toISOString(),
        "author": {
            "@type": "Person",
            "name": author,
            "jobTitle": authorRole,
            "description": `${authorRole} contributing agricultural insights and expertise`
        },
        "publisher": {
            "@type": "Organization",
            "name": SITE_DATA.name,
            "logo": toJsonLd(SCHEMA_BASE.logo),
            "url": SITE_DATA.domain
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
        },
        "articleSection": category,
        "articleBody": excerpt, // Full article body would go here in actual implementation
        "keywords": `${category}, agriculture, farming, Nigeria, ${author}`,
        "wordCount": parseInt(readTime) * 200,
        "timeRequired": readTime,
        "url": postUrl,
        "isPartOf": {
            "@type": "Blog",
            "@id": `${SITE_DATA.domain}/blog#blog`
        },
        "inLanguage": "en-NG",
        "copyrightYear": new Date(date).getFullYear(),
        "copyrightHolder": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        },
        "thumbnailUrl": image,
        "alternativeHeadline": excerpt.substring(0, 100),
        "backstory": featured ? "Featured story highlighting innovation and impact in agriculture" : null,
        "interactionStatistic": [
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/ReadAction",
                "userInteractionCount": formatCount(views),
            }
        ],
        "about": {
            "@type": "Thing",
            "name": category,
            "description": `Agricultural insights and stories about ${category.toLowerCase()}`
        },
        "mentions": [
            {
                "@type": "Thing",
                "name": "Sustainable Agriculture",
                "description": "Environmentally responsible farming practices"
            },
            {
                "@type": "Thing",
                "name": "Nigerian Agriculture",
                "description": "Agricultural innovation and practices in Nigeria"
            }
        ]
    };
}

/**
 * Blog FAQ Schema
 * Common questions about the blog and agricultural content
 */
export function getBlogFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What topics does the blog cover?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our blog covers regenerative farming, AgTech innovation, climate action, community stories, and market intelligence. We feature in-depth articles from agricultural scientists, engineers, economists, and farmers about sustainable agriculture, technological innovation, and the future of farming in Nigeria and globally."
                }
            },
            {
                "@type": "Question",
                "name": "Who writes the blog articles?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Articles are written by agricultural experts including soil scientists, agricultural engineers, plant geneticists, agricultural economists, permaculture designers, and experienced farmers. Each author brings deep expertise in their field to provide authoritative and practical insights."
                }
            },
            {
                "@type": "Question",
                "name": "How often is new content published?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We regularly publish new articles exploring agricultural innovation, sustainable practices, and market trends. Subscribe to our newsletter to receive weekly updates with exclusive insights, breakthrough innovations, and inspiring stories delivered directly to your inbox."
                }
            },
            {
                "@type": "Question",
                "name": "Can I subscribe to receive blog updates?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Join 50,000+ forward-thinking farmers and agricultural professionals receiving our weekly newsletter. Get exclusive insights, breakthrough innovations, and inspiring stories. Simply enter your email address in the subscription form at the bottom of the blog page."
                }
            },
            {
                "@type": "Question",
                "name": "Are the agricultural practices discussed applicable to Nigerian farming?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. While we cover global agricultural innovations, we focus on solutions relevant to Nigerian farmers and the African agricultural context. Our content addresses local challenges including climate adaptation, soil health, water management, and sustainable intensification appropriate for Nigerian conditions."
                }
            },
            {
                "@type": "Question",
                "name": "How can I search for specific topics?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use the search bar at the top of the blog page to find articles on specific topics. You can also filter by category including Regenerative Farming, AgTech Innovation, Climate Action, Community, and Market Intelligence to browse related articles."
                }
            }
        ]
    };
}

/**
 * Newsletter Subscription Schema
 */
export function getBlogNewsletterJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "NewsletterAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SITE_DATA.domain}/blog#newsletter`,
            "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
            ]
        },
        "object": {
            "@type": "DigitalDocument",
            "name": `${SITE_DATA.name} Agricultural Insights Newsletter`,
            "description": "Weekly insights, breakthrough innovations, and inspiring stories in agriculture",
            "publisher": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            }
        },
        "agent": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        }
    };
}

// Add these functions to your seo.jsonld.js file

export function getCheckoutBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Shopping Cart',
            url: `${SITE_DATA.domain}/cart`
        },
        {
            name: 'Checkout',
            url: `${SITE_DATA.domain}/checkout`
        }
    ]);
}

export function getCheckoutPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "CheckoutPage",
        "@id": `${SITE_DATA.domain}/checkout#webpage`,
        "url": `${SITE_DATA.domain}/checkout`,
        "name": `Checkout - ${SITE_DATA.name}`,
        "description": "Complete your agricultural products purchase with secure payment and delivery options",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/cart`,
                        "name": "Shopping Cart"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/checkout`,
                        "name": "Checkout"
                    }
                }
            ]
        },
        "potentialAction": {
            "@type": "CheckoutAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/checkout`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "result": {
                "@type": "Order",
                "seller": {
                    "@type": "Organization",
                    "@id": `${SITE_DATA.domain}/#organization`
                }
            }
        },
        "paymentAccepted": ["Cash on Delivery", "Bank Transfer", "Credit Card", "Debit Card", "Mobile Money"],
        "priceRange": SITE_DATA.business.priceRange,
        "acceptedPaymentMethod": [
            {
                "@type": "PaymentMethod",
                "name": "Cash on Delivery"
            },
            {
                "@type": "PaymentMethod",
                "name": "Bank Transfer"
            },
            {
                "@type": "PaymentMethod",
                "name": "Credit Card"
            },
            {
                "@type": "PaymentMethod",
                "name": "Debit Card"
            },
            {
                "@type": "PaymentMethod",
                "name": "Mobile Money"
            }
        ],
        "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
        }
    };
}

// Add these functions to your seo.jsonld.js file

export function getPaymentVerifyBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Checkout',
            url: `${SITE_DATA.domain}/checkout`
        },
        {
            name: 'Payment Verification',
            url: `${SITE_DATA.domain}/payment/verify`
        }
    ]);
}

export function getPaymentVerifyPageJsonLd(params = {}) {
    const { reference } = params;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/payment/verify#webpage`,
        "url": `${SITE_DATA.domain}/payment/verify`,
        "name": `Payment Verification - ${SITE_DATA.name}`,
        "description": "Verifying your payment and processing your agricultural products order",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/checkout`,
                        "name": "Checkout"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/payment/verify`,
                        "name": "Payment Verification"
                    }
                }
            ]
        },
        "potentialAction": {
            "@type": "ViewAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/payment/verify${reference ? `?reference=${reference}` : ''}`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "object": {
                "@type": "Order",
                "seller": {
                    "@type": "Organization",
                    "@id": `${SITE_DATA.domain}/#organization`
                },
                ...(reference && {
                    "orderNumber": reference,
                    "confirmationNumber": reference
                })
            }
        },
        "mainEntity": {
            "@type": "Action",
            "name": "Payment Verification",
            "description": "Verifying payment transaction and confirming order",
            "actionStatus": "http://schema.org/PotentialActionStatus",
            "agent": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            ...(reference && {
                "object": {
                    "@type": "PaymentStatusType",
                    "identifier": reference
                }
            })
        }
    };
}

// Add these functions to your seo.jsonld.js file

export function getCookiePolicyBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Cookie Policy',
            url: `${SITE_DATA.domain}/cookie-policy`
        }
    ]);
}

export function getCookiePolicyPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/cookie-policy#webpage`,
        "url": `${SITE_DATA.domain}/cookie-policy`,
        "name": `Cookie Policy - ${SITE_DATA.name}`,
        "description": `Understand how ${SITE_DATA.name} uses cookies and tracking technologies to improve your browsing experience`,
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": "Cookie Policy",
            "description": "Information about cookie usage and data collection"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/cookie-policy`,
                        "name": "Cookie Policy"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "Article",
            "headline": "Cookie Policy",
            "description": "How we use cookies and tracking technologies",
            "author": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "publisher": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString()
        },
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".legal-content", "h1", "h2"]
        }
    };
}

export function getCookiePolicyFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What are cookies?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cookies are small text files stored on your device when you visit our website. They help us provide a better browsing experience by remembering your preferences, keeping you logged in, and understanding how you use our site."
                }
            },
            {
                "@type": "Question",
                "name": "What types of cookies does SuperoAgrobase use?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We use essential cookies (necessary for site functionality), performance cookies (analytics and site improvement), functional cookies (remembering preferences), and targeting cookies (personalized content and advertising). You can manage your cookie preferences in your browser settings."
                }
            },
            {
                "@type": "Question",
                "name": "Are third-party cookies used on this website?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we use third-party cookies from services like Google Analytics for website analytics, payment processors for secure transactions, and social media platforms for sharing features. These cookies are subject to the respective privacy policies of these third parties."
                }
            },
            {
                "@type": "Question",
                "name": "How can I control or delete cookies?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can control cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or receive notifications before cookies are stored. Note that blocking all cookies may affect website functionality, including the ability to log in or make purchases."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need to accept cookies to use SuperoAgrobase?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Essential cookies are required for basic website functionality like security and shopping cart features. However, you can choose to decline non-essential cookies such as analytics and marketing cookies while still accessing most website features."
                }
            },
            {
                "@type": "Question",
                "name": "How long do cookies stay on my device?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cookie duration varies by type. Session cookies are deleted when you close your browser. Persistent cookies remain for a set period (from days to years) depending on their purpose. You can view and delete cookies at any time through your browser settings."
                }
            },
            {
                "@type": "Question",
                "name": "Does SuperoAgrobase track my browsing activity?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We use analytics cookies to understand how visitors use our website, which pages are most popular, and how users navigate through the site. This helps us improve our website and services. We do not sell your browsing data to third parties."
                }
            },
            {
                "@type": "Question",
                "name": "How can I opt out of targeted advertising cookies?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can opt out of targeted advertising by adjusting your browser settings, using our cookie preference center (if available), or visiting industry opt-out pages like the Digital Advertising Alliance's opt-out tool. Note that you may still see ads, but they won't be personalized."
                }
            }
        ]
    };
}
// Add these functions to your seo.jsonld.js file

export function getDisclaimerBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Disclaimer',
            url: `${SITE_DATA.domain}/disclaimer`
        }
    ]);
}

export function getDisclaimerPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/disclaimer#webpage`,
        "url": `${SITE_DATA.domain}/disclaimer`,
        "name": `Disclaimer - ${SITE_DATA.name}`,
        "description": "Important disclaimer about product information, pricing, agricultural advice, and limitations of liability",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": "Legal Disclaimer",
            "description": "Limitations of liability and important notices"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/disclaimer`,
                        "name": "Disclaimer"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "Article",
            "headline": "Legal Disclaimer",
            "description": "Important disclaimers regarding product information, agricultural advice, and liability limitations",
            "author": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "publisher": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "articleSection": "Legal",
            "keywords": "disclaimer, liability, agricultural products, legal notice, warranty disclaimer"
        },
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".legal-content", "h1", "h2"]
        }
    };
}

export function getDisclaimerFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the purpose of this disclaimer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "This disclaimer outlines important limitations regarding product information, agricultural advice, pricing accuracy, and our liability. It helps you understand the terms under which our services and products are provided, and clarifies what we can and cannot guarantee."
                }
            },
            {
                "@type": "Question",
                "name": "Are product descriptions and specifications guaranteed to be accurate?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While we strive to provide accurate product information, descriptions, specifications, and images are provided for general guidance only. Product formulations, packaging, and specifications may change without notice. We recommend verifying critical details before purchase, especially for agricultural chemicals and specialized equipment."
                }
            },
            {
                "@type": "Question",
                "name": "Is the agricultural advice on this website professional consultation?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Information and advice provided on our website are for general educational purposes only and should not be considered as professional agricultural consultation. For specific farm conditions, crop issues, or application recommendations, consult qualified agricultural professionals or agronomists."
                }
            },
            {
                "@type": "Question",
                "name": "Can prices displayed on the website change?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, prices displayed are subject to change without notice due to market conditions, supplier pricing, currency fluctuations, or other factors. The final price is confirmed at checkout. We reserve the right to correct pricing errors and may cancel orders placed at incorrect prices."
                }
            },
            {
                "@type": "Question",
                "name": "What is SuperoAgrobase's liability for product use?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We are not liable for any direct, indirect, incidental, or consequential damages arising from product use, misuse, or application. Users are responsible for reading and following all product labels, safety instructions, and application guidelines. Always use agricultural products as directed by manufacturers."
                }
            },
            {
                "@type": "Question",
                "name": "Are products guaranteed to produce specific agricultural results?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Agricultural outcomes depend on numerous factors including soil conditions, weather, application methods, crop management, and local conditions. We make no warranties or guarantees regarding crop yields, pest control effectiveness, or other agricultural results from product use."
                }
            },
            {
                "@type": "Question",
                "name": "What if I receive incorrect product information from SuperoAgrobase staff?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While our staff are trained to provide helpful information, verbal or written advice from representatives does not constitute professional agricultural consultation and is provided in good faith only. Always verify critical information with product manufacturers, read product labels thoroughly, and consult agricultural professionals for important decisions."
                }
            },
            {
                "@type": "Question",
                "name": "Does this disclaimer affect my consumer rights?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "This disclaimer does not affect your statutory consumer rights under Nigerian law. You still have rights regarding faulty products, misrepresentation, and consumer protection. This disclaimer primarily limits liability for agricultural outcomes, information accuracy, and indirect damages beyond our control."
                }
            },
            {
                "@type": "Question",
                "name": "Are third-party links and external content covered by this disclaimer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We provide links to third-party websites and external resources for convenience only. We are not responsible for the content, accuracy, availability, or practices of external sites. Use of third-party information, products, or services is at your own risk and subject to their terms and conditions."
                }
            },
            {
                "@type": "Question",
                "name": "How should I use agricultural chemicals and products safely?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Always read and follow product labels completely. Use appropriate protective equipment, follow recommended application rates and methods, observe safety intervals before harvest, and comply with all local regulations. Store products securely, dispose of containers properly, and keep products away from children and animals. When in doubt, consult agricultural extension services or qualified professionals."
                }
            }
        ]
    };
}

// Add these functions to your seo.jsonld.js file

export function getPrivacyPolicyBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Privacy Policy',
            url: `${SITE_DATA.domain}/privacy-policy`
        }
    ]);
}

export function getPrivacyPolicyPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/privacy-policy#webpage`,
        "url": `${SITE_DATA.domain}/privacy-policy`,
        "name": `Privacy Policy - ${SITE_DATA.name}`,
        "description": "Learn how we collect, use, and protect your personal information in compliance with NDPR",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": "Privacy Policy",
            "description": "Data protection and privacy practices"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/privacy-policy`,
                        "name": "Privacy Policy"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "Article",
            "headline": "Privacy Policy & NDPR Compliance",
            "description": "How SuperoAgrobase collects, uses, and protects your personal information",
            "author": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "publisher": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "articleSection": "Legal",
            "keywords": "privacy policy, NDPR, data protection, personal information, Nigeria"
        },
        "mentions": [
            {
                "@type": "Thing",
                "name": "Nigeria Data Protection Regulation (NDPR)",
                "description": "Nigerian data protection law"
            },
            {
                "@type": "Thing",
                "name": "Personal Data",
                "description": "Information that identifies individuals"
            }
        ],
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".legal-content", "h1", "h2"]
        }
    };
}

export function getPrivacyPolicyFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What personal information does SuperoAgrobase collect?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We collect information you provide directly (name, email, phone, address), information collected automatically (browsing behavior, IP address, device information), and transaction information (purchase history, payment details). All collection complies with Nigeria Data Protection Regulation (NDPR)."
                }
            },
            {
                "@type": "Question",
                "name": "How is my personal information used?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We use your information to process orders, deliver products, communicate about your purchases, provide customer support, improve our services, send marketing communications (with your consent), and comply with legal obligations. We never sell your personal data to third parties."
                }
            },
            {
                "@type": "Question",
                "name": "Is SuperoAgrobase compliant with NDPR?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we fully comply with the Nigeria Data Protection Regulation (NDPR). We have implemented appropriate technical and organizational measures to protect your personal data, appointed a data protection officer, and ensure all data processing activities meet NDPR requirements."
                }
            },
            {
                "@type": "Question",
                "name": "How is my payment information secured?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Payment information is encrypted using industry-standard SSL/TLS technology. We use secure payment gateways and do not store complete credit card numbers on our servers. All payment processing complies with Payment Card Industry Data Security Standards (PCI DSS)."
                }
            },
            {
                "@type": "Question",
                "name": "Do you share my information with third parties?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We share information only with trusted service providers necessary to operate our business (payment processors, delivery services, marketing platforms), and only to the extent needed to provide services. We require all third parties to protect your data and use it only for specified purposes. We never sell your data."
                }
            },
            {
                "@type": "Question",
                "name": "What are my rights regarding my personal data?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Under NDPR, you have the right to access your personal data, request corrections to inaccurate information, request deletion of your data (subject to legal obligations), object to certain processing activities, withdraw consent for marketing communications, and file complaints with the Nigeria Data Protection Commission (NDPC)."
                }
            },
            {
                "@type": "Question",
                "name": "How can I access or delete my personal information?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `You can access your personal information through your account dashboard. To request data deletion or exercise other privacy rights, contact us at ${SITE_DATA.email} or call ${SITE_DATA.phone}. We will respond to your request within 30 days as required by NDPR.`
                }
            },
            {
                "@type": "Question",
                "name": "How long do you keep my personal data?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We retain personal data only as long as necessary to fulfill the purposes for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements. Account information is retained while your account is active. Transaction records are kept for 7 years for tax and legal compliance."
                }
            },
            {
                "@type": "Question",
                "name": "Do you use cookies and tracking technologies?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we use cookies and similar technologies to improve user experience, analyze website traffic, remember preferences, and deliver personalized content. You can control cookie preferences through your browser settings. See our Cookie Policy for detailed information about cookie usage."
                }
            },
            {
                "@type": "Question",
                "name": "How do I opt out of marketing communications?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can opt out of marketing emails by clicking the 'unsubscribe' link in any marketing email, adjusting your communication preferences in your account settings, or contacting customer service. You'll continue to receive transactional emails (order confirmations, shipping updates) necessary for your purchases."
                }
            },
            {
                "@type": "Question",
                "name": "What happens if there's a data breach?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "In the unlikely event of a data breach affecting your personal information, we will notify you and the Nigeria Data Protection Commission within 72 hours as required by NDPR. We will provide information about the breach, potential risks, and steps we're taking to address it."
                }
            },
            {
                "@type": "Question",
                "name": "Is my information transferred outside Nigeria?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "If we transfer your data outside Nigeria, we ensure adequate protection through approved mechanisms such as standard contractual clauses, ensuring the receiving country has adequate data protection laws, or obtaining your explicit consent. All transfers comply with NDPR requirements."
                }
            }
        ]
    };
}

// Terms of Service Breadcrumb Schema
export function getTermsOfServiceBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Terms of Service',
            url: `${SITE_DATA.domain}/terms-of-service`
        }
    ]);
}

// Terms of Service Page Schema
export function getTermsOfServicePageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/terms-of-service#webpage`,
        "url": `${SITE_DATA.domain}/terms-of-service`,
        "name": `Terms of Service - ${SITE_DATA.name}`,
        "description": `Terms and conditions governing the use of ${SITE_DATA.name}`,
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": "Terms of Service",
            "description": "User agreement and conditions of use"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/terms-of-service`,
                        "name": "Terms of Service"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "Article",
            "headline": "Terms of Service & User Agreement",
            "description": "Terms and conditions for using SuperoAgrobase services",
            "author": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "publisher": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "articleSection": "Legal",
            "keywords": "terms of service, user agreement, conditions of use, legal terms, Nigeria"
        },
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".legal-content", "h1", "h2"]
        }
    };
}

// Terms of Service FAQ Schema
export function getTermsOfServiceFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What do these Terms of Service cover?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "These Terms of Service govern your use of SuperoAgrobase website and services, including account creation, product purchases, delivery terms, payment obligations, return policies, intellectual property rights, limitation of liability, and dispute resolution procedures."
                }
            },
            {
                "@type": "Question",
                "name": "By using SuperoAgrobase, what am I agreeing to?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "By accessing or using our website, you agree to be bound by these Terms of Service, our Privacy Policy, and all applicable laws and regulations. If you disagree with any part of these terms, you may not use our services."
                }
            },
            {
                "@type": "Question",
                "name": "Can SuperoAgrobase change these terms?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or website notice. Continued use of our services after changes constitutes acceptance of the modified terms. We recommend reviewing the terms periodically."
                }
            },
            {
                "@type": "Question",
                "name": "What are my responsibilities as a user?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You must provide accurate account information, maintain the security of your password, be responsible for all account activity, use the website lawfully and respectfully, not engage in fraudulent activities, comply with all applicable laws, and promptly notify us of any unauthorized use of your account."
                }
            },
            {
                "@type": "Question",
                "name": "What is SuperoAgrobase's return and refund policy?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Returns are accepted within the specified timeframe for eligible products in original condition. Refunds are processed according to our refund policy. Some products (perishables, opened chemicals, custom orders) may not be eligible for return. Contact customer service for specific return requests and conditions."
                }
            },
            {
                "@type": "Question",
                "name": "Who owns the content on SuperoAgrobase?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All content on SuperoAgrobase including text, images, logos, graphics, software, and product descriptions is owned by or licensed to SuperoAgrobase and protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our written permission."
                }
            },
            {
                "@type": "Question",
                "name": "What is SuperoAgrobase's liability limitation?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SuperoAgrobase provides services 'as is' without warranties. We are not liable for indirect, incidental, consequential, or punitive damages arising from service use, product use, delivery delays, or website unavailability. Our total liability is limited to the amount you paid for the specific product or service in question."
                }
            },
            {
                "@type": "Question",
                "name": "How are disputes resolved?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We encourage resolving disputes through our customer service team first. If informal resolution fails, disputes will be resolved through binding arbitration or in Nigerian courts as specified in the Terms of Service. These terms are governed by the laws of the Federal Republic of Nigeria."
                }
            },
            {
                "@type": "Question",
                "name": "Can I cancel my order?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Order cancellation depends on order status. You can cancel before shipment by contacting customer service immediately. Once shipped, cancellation may not be possible, but you may be eligible for a return. Cancellation and refund policies vary by product type and payment method."
                }
            },
            {
                "@type": "Question",
                "name": "What happens if I violate these terms?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Violation of these Terms of Service may result in account suspension or termination, order cancellation, withholding of refunds, legal action for damages, and reporting to appropriate authorities. We reserve the right to refuse service to anyone who violates these terms."
                }
            },
            {
                "@type": "Question",
                "name": "How can I contact SuperoAgrobase about these terms?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `For questions about these Terms of Service, contact us at ${SITE_DATA.email}, call ${SITE_DATA.phone}, or visit our office at ${SITE_DATA.address.street}, ${SITE_DATA.address.city}, ${SITE_DATA.address.state}. Our customer service team is available during business hours to assist you.`
                }
            }
        ]
    };
}

// Services Page Breadcrumb Schema
export function getServicesBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Services',
            url: `${SITE_DATA.domain}/services`
        }
    ]);
}

// Services Page Schema
export function getServicesPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/services#webpage`,
        "url": `${SITE_DATA.domain}/services`,
        "name": `Our Services - ${SITE_DATA.name}`,
        "description": "Comprehensive agricultural solutions including agro-input authentication, quality products supply, farm management, and agricultural consultancy",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": "Agricultural Services",
            "description": "Professional agricultural solutions and farm management services"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/services`,
                        "name": "Services"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        }
    };
}

// Services Collection Schema
export function getServicesCollectionJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "ItemList",
        "name": "Agricultural Services",
        "description": "Comprehensive agricultural solutions and services offered by SuperoAgrobase",
        "numberOfItems": 3,
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Service",
                    "@id": `${SITE_DATA.domain}/services/agro-input#service`,
                    "name": "Agro-Input Products Authentication & Research",
                    "description": "Authentication of manufacturer claims on agro-input products approved by SON and NAFDAC through quality research",
                    "url": `${SITE_DATA.domain}/services/agro-input`,
                    "provider": {
                        "@type": "Organization",
                        "@id": `${SITE_DATA.domain}/#organization`
                    },
                    "areaServed": {
                        "@type": "Country",
                        "name": "Nigeria"
                    },
                    "serviceType": "Agricultural Quality Assurance & Research",
                    "offers": {
                        "@type": "Offer",
                        "description": "Product authentication and research services"
                    }
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "Service",
                    "@id": `${SITE_DATA.domain}/services/agricourt-ventures#service`,
                    "name": "AgriCourt Ventures - Quality Agricultural Products",
                    "description": "Premium seeds, fertilizers, irrigation systems, greenhouses, crop protection products, and farm machinery",
                    "url": `${SITE_DATA.domain}/services/agricourt-ventures`,
                    "provider": {
                        "@type": "Organization",
                        "@id": `${SITE_DATA.domain}/#organization`
                    },
                    "areaServed": {
                        "@type": "Country",
                        "name": "Nigeria"
                    },
                    "serviceType": "Agricultural Input Supply",
                    "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Agricultural Input Products",
                        "numberOfItems": 8
                    }
                }
            },
            {
                "@type": "ListItem",
                "position": 3,
                "item": {
                    "@type": "Service",
                    "@id": `${SITE_DATA.domain}/services/harvestyield-farm#service`,
                    "name": "HarvestYield Farm - Premium Vegetable Production & Farm Management",
                    "description": "10-hectare farm producing premium vegetables with professional farm management and consultancy services",
                    "url": `${SITE_DATA.domain}/services/harvestyield-farm`,
                    "provider": {
                        "@type": "Organization",
                        "@id": `${SITE_DATA.domain}/#organization`
                    },
                    "areaServed": {
                        "@type": "Country",
                        "name": "Nigeria"
                    },
                    "serviceType": "Farm Production & Management",
                    "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Farm Services",
                        "itemListElement": [
                            "Vegetable Production",
                            "Farm Management",
                            "Agricultural Consultancy",
                            "Soil Analysis",
                            "Laboratory Services"
                        ]
                    }
                }
            }
        ]
    };
}

// Services FAQ Schema
export function getServicesFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What agricultural services does SuperoAgrobase offer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SuperoAgrobase offers three main services: (1) Agro-Input Products Authentication & Research - verifying manufacturer claims for SON and NAFDAC approved products; (2) AgriCourt Ventures - supplying quality agricultural inputs including seeds, fertilizers, irrigation systems, and farm machinery; (3) HarvestYield Farm - premium vegetable production, farm management services, agricultural consultancy, and laboratory services."
                }
            },
            {
                "@type": "Question",
                "name": "What is Agro-Input Products Authentication?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our Agro-Input Authentication service verifies manufacturer claims on agricultural products approved by SON and NAFDAC. We conduct rigorous research and testing on our 3-hectare research facility under real farming conditions to protect farmers from adulterated products and ensure quality. Results are promoted to our network of 10,000+ registered farmers."
                }
            },
            {
                "@type": "Question",
                "name": "What products does AgriCourt Ventures supply?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AgriCourt Ventures supplies comprehensive agricultural inputs: premium seeds, granular and water-soluble fertilizers, irrigation systems, growing media (cocopeat, peat moss, worm compost), cultivation tools (seedling trays, grow bags, mulch film), protected cultivation (greenhouses, net houses, shade nets), crop protection products, and farm mechanization (tractors, implements, machinery). All with nationwide delivery across Nigeria."
                }
            },
            {
                "@type": "Question",
                "name": "What does HarvestYield Farm produce?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HarvestYield Farm operates 10 hectares dedicated to premium vegetable production including Tomato, Cucumber, Sweetcorn, Special Watermelon, and Pepper. We use science-based farming practices for consistent quality and superior yields."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer farm management consultancy?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, HarvestYield Farm provides professional farm management services, agricultural consultancy, crop planning, and optimization guidance. We leverage best practices and modern techniques to help farmers improve productivity and profitability."
                }
            },
            {
                "@type": "Question",
                "name": "What laboratory services are available?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We provide comprehensive soil analysis (nutrient levels, pH balance), fertilizer analysis, and manure testing through partnerships with reputable laboratories. These services help farmers make informed decisions about soil amendments and fertilization programs."
                }
            },
            {
                "@type": "Question",
                "name": "Are your services available nationwide?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, all our services are available across Nigeria. AgriCourt Ventures delivers products nationwide, our research findings reach 10,000+ farmers through our dealer network, and HarvestYield Farm consultancy services can be accessed remotely or on-site depending on requirements."
                }
            },
            {
                "@type": "Question",
                "name": "How do I access these services?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Contact us at ${SITE_DATA.email} or call ${SITE_DATA.phone} to discuss your specific needs. Visit our office at ${SITE_DATA.address.street}, ${SITE_DATA.address.city} for in-person consultations. You can also browse and purchase AgriCourt Ventures products directly through our online store.`
                }
            },
            {
                "@type": "Question",
                "name": "What makes SuperoAgrobase services different?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We combine research-backed product authentication, quality-assured input supply, and hands-on farming experience. Our 3-hectare research facility and 10-hectare production farm allow us to test products under real conditions, ensuring we only recommend what actually works. We serve 10,000+ farmers with proven solutions, not just products."
                }
            },
            {
                "@type": "Question",
                "name": "Can small-scale farmers access your services?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. Our services are designed for both small-scale and commercial farmers. We offer scalable solutions, flexible consultancy packages, and products in various quantities. Our research findings and product recommendations benefit all farmers in our network regardless of farm size."
                }
            }
        ]
    };
}

// Notifications Page Breadcrumb Schema
export function getNotificationsBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Account',
            url: `${SITE_DATA.domain}/account`
        },
        {
            name: 'Notifications',
            url: `${SITE_DATA.domain}/notifications`
        }
    ]);
}

// Notifications Page Schema
export function getNotificationsPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/notifications#webpage`,
        "url": `${SITE_DATA.domain}/notifications`,
        "name": `Notifications - ${SITE_DATA.name}`,
        "description": "Stay updated with order status, agricultural news, blog posts, system updates, and personalized alerts",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account`,
                        "name": "Account"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/notifications`,
                        "name": "Notifications"
                    }
                }
            ]
        },
        "potentialAction": {
            "@type": "ViewAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_DATA.domain}/notifications`,
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            },
            "object": {
                "@type": "Collection",
                "name": "User Notifications",
                "description": "Comprehensive notification center for orders, news, blogs, and updates"
            }
        },
        "mainEntity": {
            "@type": "ItemList",
            "name": "Notification Center",
            "description": "Centralized hub for all user notifications and updates",
            "about": [
                {
                    "@type": "Thing",
                    "name": "Order Notifications",
                    "description": "Order status, delivery updates, and payment confirmations"
                },
                {
                    "@type": "Thing",
                    "name": "Content Updates",
                    "description": "New blog posts, agricultural articles, and farming insights"
                },
                {
                    "@type": "Thing",
                    "name": "System Announcements",
                    "description": "Platform updates, new features, and service improvements"
                },
                {
                    "@type": "Thing",
                    "name": "Agricultural News",
                    "description": "Industry news, market trends, and farming innovations"
                },
                {
                    "@type": "Thing",
                    "name": "Promotional Alerts",
                    "description": "Special offers, seasonal promotions, and exclusive deals"
                },
                {
                    "@type": "Thing",
                    "name": "Account Alerts",
                    "description": "Security notifications and account activity updates"
                }
            ],
            "itemListElement": []
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Registered users and agricultural professionals"
        }
    };
}

// User Orders Page Breadcrumb Schema
export function getUserOrdersBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Account',
            url: `${SITE_DATA.domain}/account`
        },
        {
            name: 'My Orders',
            url: `${SITE_DATA.domain}/account/orders`
        }
    ]);
}

// User Orders Page Schema
export function getUserOrdersPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/account/orders#webpage`,
        "url": `${SITE_DATA.domain}/account/orders`,
        "name": `My Orders - ${SITE_DATA.name}`,
        "description": "View and manage your order history, track deliveries, and access order details",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account`,
                        "name": "Account"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account/orders`,
                        "name": "My Orders"
                    }
                }
            ]
        },
        "potentialAction": [
            {
                "@type": "ViewAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/orders`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Collection",
                    "name": "Order History"
                }
            },
            {
                "@type": "TrackAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/orders/{order_id}`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Order",
                    "name": "Track Order"
                }
            }
        ],
        "mainEntity": {
            "@type": "ItemList",
            "name": "Order History",
            "description": "Complete history of user orders with tracking and management capabilities",
            "about": [
                {
                    "@type": "Thing",
                    "name": "Active Orders",
                    "description": "Orders currently being processed or in transit"
                },
                {
                    "@type": "Thing",
                    "name": "Completed Orders",
                    "description": "Successfully delivered orders"
                },
                {
                    "@type": "Thing",
                    "name": "Cancelled Orders",
                    "description": "Orders that were cancelled or refunded"
                },
                {
                    "@type": "Thing",
                    "name": "Order Tracking",
                    "description": "Real-time delivery status and location updates"
                }
            ],
            "itemListElement": []
        },
        "offers": {
            "@type": "AggregateOffer",
            "description": "Historical purchase records",
            "seller": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            }
        },
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": "Order Filters",
                "description": "Filter orders by status, date, or product category"
            },
            {
                "@type": "WebPageElement",
                "name": "Order Search",
                "description": "Search orders by order number or product name"
            },
            {
                "@type": "WebPageElement",
                "name": "Order Actions",
                "description": "Track, reorder, cancel, or request returns"
            }
        ],
        "audience": {
            "@type": "Audience",
            "audienceType": "Registered customers with purchase history"
        }
    };
}

// Order Details Page Breadcrumb Schema
export function getOrderDetailsBreadcrumbJsonLd(params = {}) {
    const { reference } = params;

    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Account',
            url: `${SITE_DATA.domain}/account`
        },
        {
            name: 'My Orders',
            url: `${SITE_DATA.domain}/account/orders`
        },
        {
            name: reference ? `Order ${reference}` : 'Order Details',
            url: `${SITE_DATA.domain}/account/orders/${reference || '[reference]'}`
        }
    ]);
}

// Order Details Page Schema
export function getOrderDetailsPageJsonLd(params = {}) {
    const { reference } = params;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/account/orders/${reference || '[reference]'}#webpage`,
        "url": `${SITE_DATA.domain}/account/orders/${reference || '[reference]'}`,
        "name": reference ? `Order ${reference} - ${SITE_DATA.name}` : `Order Details - ${SITE_DATA.name}`,
        "description": reference
            ? `Complete details and tracking information for order ${reference}`
            : "View order details, track delivery, and manage your purchase",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account`,
                        "name": "Account"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account/orders`,
                        "name": "My Orders"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account/orders/${reference || '[reference]'}`,
                        "name": reference ? `Order ${reference}` : "Order Details"
                    }
                }
            ]
        },
        "potentialAction": [
            {
                "@type": "TrackAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/orders/${reference || '{reference}'}`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Order",
                    "name": "Track Order Delivery",
                    ...(reference && {
                        "orderNumber": reference,
                        "confirmationNumber": reference
                    })
                }
            },
            {
                "@type": "DownloadAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/orders/${reference || '{reference}'}/invoice`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "DigitalDocument",
                    "name": "Order Invoice"
                }
            }
        ],
        "mainEntity": {
            "@type": "Order",
            "name": reference ? `Order ${reference}` : "Customer Order",
            ...(reference && {
                "orderNumber": reference,
                "confirmationNumber": reference,
                "identifier": reference
            }),
            "seller": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "orderStatus": "http://schema.org/OrderProcessing",
            "potentialAction": [
                {
                    "@type": "TrackAction",
                    "name": "Track Delivery"
                },
                {
                    "@type": "CancelAction",
                    "name": "Cancel Order"
                },
                {
                    "@type": "ReturnAction",
                    "name": "Request Return"
                }
            ]
        },
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": "Order Summary",
                "description": "Overview of order items and total amount"
            },
            {
                "@type": "WebPageElement",
                "name": "Delivery Tracking",
                "description": "Real-time tracking of order delivery status"
            },
            {
                "@type": "WebPageElement",
                "name": "Payment Information",
                "description": "Payment method and transaction status"
            },
            {
                "@type": "WebPageElement",
                "name": "Order Timeline",
                "description": "Chronological history of order events"
            },
            {
                "@type": "WebPageElement",
                "name": "Delivery Address",
                "description": "Shipping destination and contact information"
            },
            {
                "@type": "WebPageElement",
                "name": "Order Actions",
                "description": "Available actions like cancel, return, or reorder"
            }
        ],
        "audience": {
            "@type": "Audience",
            "audienceType": "Order owner - authenticated customer"
        }
    };
}

// Product Reviews Page Breadcrumb Schema
export function getProductReviewsBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Account',
            url: `${SITE_DATA.domain}/account`
        },
        {
            name: 'My Reviews',
            url: `${SITE_DATA.domain}/account/reviews`
        }
    ]);
}

// Product Reviews Page Schema
export function getProductReviewsPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/account/reviews#webpage`,
        "url": `${SITE_DATA.domain}/account/reviews`,
        "name": `My Product Reviews - ${SITE_DATA.name}`,
        "description": "View and manage your product reviews, ratings, and feedback on agricultural products",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account`,
                        "name": "Account"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account/reviews`,
                        "name": "My Reviews"
                    }
                }
            ]
        },
        "potentialAction": [
            {
                "@type": "ReviewAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/reviews/new`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Agricultural Product"
                },
                "result": {
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": "Customer"
                    }
                }
            },
            {
                "@type": "UpdateAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/reviews/{review_id}/edit`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Review",
                    "name": "Edit Review"
                }
            },
            {
                "@type": "ViewAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/reviews`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Collection",
                    "name": "Review History"
                }
            }
        ],
        "mainEntity": {
            "@type": "ItemList",
            "name": "User Product Reviews",
            "description": "Collection of product reviews and ratings submitted by the user",
            "about": [
                {
                    "@type": "Thing",
                    "name": "Published Reviews",
                    "description": "Approved and published product reviews"
                },
                {
                    "@type": "Thing",
                    "name": "Pending Reviews",
                    "description": "Reviews awaiting moderation"
                },
                {
                    "@type": "Thing",
                    "name": "Review Drafts",
                    "description": "Incomplete or saved review drafts"
                },
                {
                    "@type": "Thing",
                    "name": "Products to Review",
                    "description": "Purchased products eligible for review"
                }
            ],
            "itemListElement": []
        },
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": "Review Filters",
                "description": "Filter reviews by product, rating, or date"
            },
            {
                "@type": "WebPageElement",
                "name": "Review Actions",
                "description": "Create, edit, or delete product reviews"
            },
            {
                "@type": "WebPageElement",
                "name": "Rating Summary",
                "description": "Overview of user's rating distribution"
            },
            {
                "@type": "WebPageElement",
                "name": "Review Statistics",
                "description": "Total reviews, helpful votes, and engagement metrics"
            },
            {
                "@type": "WebPageElement",
                "name": "Pending Reviews List",
                "description": "Products awaiting review from recent purchases"
            }
        ],
        "audience": {
            "@type": "Audience",
            "audienceType": "Registered customers who have purchased products"
        },
        "about": {
            "@type": "Thing",
            "name": "Product Reviews",
            "description": "Customer feedback and ratings on agricultural products"
        }
    };
}

// User Profile Page Breadcrumb Schema
export function getUserProfileBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Account',
            url: `${SITE_DATA.domain}/account`
        },
        {
            name: 'My Profile',
            url: `${SITE_DATA.domain}/account/profile`
        }
    ]);
}

// User Profile Page Schema
export function getUserProfilePageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "ProfilePage",
        "@id": `${SITE_DATA.domain}/account/profile#webpage`,
        "url": `${SITE_DATA.domain}/account/profile`,
        "name": `My Profile - ${SITE_DATA.name}`,
        "description": "Manage your account settings, personal information, and preferences",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account`,
                        "name": "Account"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account/profile`,
                        "name": "My Profile"
                    }
                }
            ]
        },
        "potentialAction": [
            {
                "@type": "UpdateAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/profile/edit`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Person",
                    "name": "Update Profile Information"
                }
            },
            {
                "@type": "ReplaceAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/profile/change-password`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "DigitalDocument",
                    "name": "Change Password"
                }
            },
            {
                "@type": "UpdateAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/profile/addresses`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "PostalAddress",
                    "name": "Manage Delivery Addresses"
                }
            }
        ],
        "mainEntity": {
            "@type": "Person",
            "name": "User Profile",
            "description": "Authenticated user account information and settings",
            "url": `${SITE_DATA.domain}/account/profile`,
            "memberOf": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            }
        },
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": "Personal Information",
                "description": "Name, email, phone number, and profile picture"
            },
            {
                "@type": "WebPageElement",
                "name": "Account Security",
                "description": "Password management and security settings"
            },
            {
                "@type": "WebPageElement",
                "name": "Delivery Addresses",
                "description": "Saved shipping and billing addresses"
            },
            {
                "@type": "WebPageElement",
                "name": "Communication Preferences",
                "description": "Email notifications, SMS alerts, and marketing preferences"
            },
            {
                "@type": "WebPageElement",
                "name": "Account Activity",
                "description": "Recent login history and account events"
            },
            {
                "@type": "WebPageElement",
                "name": "Privacy Settings",
                "description": "Data sharing and privacy preferences"
            },
            {
                "@type": "WebPageElement",
                "name": "Farm Information",
                "description": "Optional farm details for personalized recommendations"
            }
        ],
        "about": [
            {
                "@type": "Thing",
                "name": "Account Management",
                "description": "Tools to manage personal account information"
            },
            {
                "@type": "Thing",
                "name": "Security Settings",
                "description": "Password and authentication configuration"
            },
            {
                "@type": "Thing",
                "name": "Preferences",
                "description": "Communication and notification settings"
            },
            {
                "@type": "Thing",
                "name": "Address Book",
                "description": "Saved delivery and billing addresses"
            }
        ],
        "audience": {
            "@type": "Audience",
            "audienceType": "Registered and authenticated users"
        },
        "accessMode": ["textual", "visual"],
        "accessibilityFeature": [
            "alternativeText",
            "structuralNavigation"
        ]
    };
}

// Support Page Breadcrumb Schema
export function getSupportBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Support',
            url: `${SITE_DATA.domain}/support`
        }
    ]);
}

// Support Page Schema
export function getSupportPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "ContactPage",
        "@id": `${SITE_DATA.domain}/support#webpage`,
        "url": `${SITE_DATA.domain}/support`,
        "name": `Customer Support - ${SITE_DATA.name}`,
        "description": "Get help with orders, products, deliveries, and account management from our dedicated support team",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/support`,
                        "name": "Support"
                    }
                }
            ]
        },
        "mainEntity": {
            "@type": "CustomerService",
            "name": `${SITE_DATA.name} Customer Support`,
            "description": "Comprehensive customer support for agricultural products and services",
            "url": `${SITE_DATA.domain}/support`,
            "telephone": SITE_DATA.phone,
            "email": SITE_DATA.email,
            "contactType": "Customer Service",
            "areaServed": {
                "@type": "Country",
                "name": "Nigeria"
            },
            "availableLanguage": ["English"],
            "hoursAvailable": toJsonLd(SCHEMA_BASE.openingHours),
            "serviceArea": {
                "@type": "Country",
                "name": "Nigeria"
            }
        },
        "potentialAction": [
            {
                "@type": "CommunicateAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/support#contact-form`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "name": "Submit Support Request"
            },
            {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/support?search={search_term_string}`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "query-input": "required name=search_term_string",
                "name": "Search Support Articles"
            }
        ],
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": "Contact Methods",
                "description": "Multiple ways to reach our support team"
            },
            {
                "@type": "WebPageElement",
                "name": "Support Categories",
                "description": "Common support topics and issues"
            },
            {
                "@type": "WebPageElement",
                "name": "Knowledge Base",
                "description": "Self-service articles and guides"
            },
            {
                "@type": "WebPageElement",
                "name": "Submit Ticket",
                "description": "Create a support request"
            },
            {
                "@type": "WebPageElement",
                "name": "Track Request",
                "description": "Check status of existing support tickets"
            }
        ],
        "about": [
            {
                "@type": "Thing",
                "name": "Order Support",
                "description": "Help with order placement, tracking, and management"
            },
            {
                "@type": "Thing",
                "name": "Product Support",
                "description": "Product information, usage, and technical assistance"
            },
            {
                "@type": "Thing",
                "name": "Delivery Support",
                "description": "Shipping, tracking, and delivery issues"
            },
            {
                "@type": "Thing",
                "name": "Returns & Refunds",
                "description": "Return requests and refund processing"
            },
            {
                "@type": "Thing",
                "name": "Account Support",
                "description": "Account management and security assistance"
            },
            {
                "@type": "Thing",
                "name": "Technical Support",
                "description": "Website issues and technical troubleshooting"
            }
        ],
        "provider": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        }
    };
}

// Support FAQ Schema
export function getSupportFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How can I contact customer support?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `You can reach our customer support team through multiple channels: Call us at ${SITE_DATA.phone}, email ${SITE_DATA.email}, use our live chat feature on the website, send a WhatsApp message, or submit a support ticket through this page. We're available Monday to Friday ${SITE_DATA.business.openingHours.weekdays.open}-${SITE_DATA.business.openingHours.weekdays.close}, and Saturday ${SITE_DATA.business.openingHours.saturday.open}-${SITE_DATA.business.openingHours.saturday.close}.`
                }
            },
            {
                "@type": "Question",
                "name": "What are your support hours?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Our customer support team is available Monday to Friday from ${SITE_DATA.business.openingHours.weekdays.open} to ${SITE_DATA.business.openingHours.weekdays.close}, and Saturday from ${SITE_DATA.business.openingHours.saturday.open} to ${SITE_DATA.business.openingHours.saturday.close}. We're closed on Sundays and public holidays. Email and support tickets submitted outside business hours will be responded to within 24 hours on the next business day.`
                }
            },
            {
                "@type": "Question",
                "name": "How quickly will I get a response?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We strive to respond to all support requests within 24 hours during business days. Live chat inquiries are typically answered within minutes during business hours. Phone calls are answered immediately when our team is available. Urgent order or delivery issues receive priority response."
                }
            },
            {
                "@type": "Question",
                "name": "What information should I include in my support request?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To help us assist you quickly, please include: your order number (if applicable), account email address, detailed description of the issue, any error messages you've received, screenshots if relevant, and your contact phone number. The more details you provide, the faster we can resolve your issue."
                }
            },
            {
                "@type": "Question",
                "name": "Can I track my support ticket?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, when you submit a support ticket, you'll receive a ticket number via email. You can use this number to track the status of your request on our support page or by contacting our team directly. We'll update you via email as we work on resolving your issue."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer technical support for agricultural products?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our support team includes agricultural experts who can help with product selection, usage instructions, application rates, safety guidelines, and troubleshooting. For complex agricultural consultancy, we can connect you with our specialist team or recommend appropriate resources."
                }
            },
            {
                "@type": "Question",
                "name": "How do I report a problem with my order or delivery?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Contact us immediately with your order number and details of the issue (damaged items, missing products, incorrect items, delivery delays). We'll investigate and resolve the problem quickly. For urgent delivery issues, calling our support line gets the fastest response."
                }
            },
            {
                "@type": "Question",
                "name": "Can I get support in languages other than English?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Currently, our primary support language is English. However, our team members may be able to assist in other Nigerian languages depending on availability. Let us know your language preference when contacting support, and we'll do our best to accommodate."
                }
            },
            {
                "@type": "Question",
                "name": "What if I'm not satisfied with the support I received?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `If you're not satisfied with the support provided, please request to speak with a supervisor or email our management team at ${SITE_DATA.email} with your ticket number and concerns. We take customer feedback seriously and continuously work to improve our service quality.`
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer support for vendor accounts?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, vendors have access to dedicated support for vendor account management, product listings, order fulfillment, payment issues, and platform features. Vendor support includes onboarding assistance, training resources, and ongoing technical help."
                }
            }
        ]
    };
}

// User Wishlist Page Breadcrumb Schema
export function getUserWishlistBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Account',
            url: `${SITE_DATA.domain}/account`
        },
        {
            name: 'My Wishlist',
            url: `${SITE_DATA.domain}/account/wishlist`
        }
    ]);
}

// User Wishlist Page Schema
export function getUserWishlistPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "CollectionPage",
        "@id": `${SITE_DATA.domain}/account/wishlist#webpage`,
        "url": `${SITE_DATA.domain}/account/wishlist`,
        "name": `My Wishlist - ${SITE_DATA.name}`,
        "description": "Saved agricultural products and favorite items for future purchase",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account`,
                        "name": "Account"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/account/wishlist`,
                        "name": "My Wishlist"
                    }
                }
            ]
        },
        "potentialAction": [
            {
                "@type": "AddAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/wishlist/add/{product_id}`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Add Product to Wishlist"
                }
            },
            {
                "@type": "DeleteAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/wishlist/remove/{product_id}`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Remove Product from Wishlist"
                }
            },
            {
                "@type": "BuyAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/cart/add-from-wishlist`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Move to Cart"
                }
            },
            {
                "@type": "ShareAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/account/wishlist/share`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Collection",
                    "name": "Share Wishlist"
                }
            }
        ],
        "mainEntity": {
            "@type": "ItemList",
            "name": "User Wishlist",
            "description": "Collection of saved agricultural products for future consideration",
            "about": [
                {
                    "@type": "Thing",
                    "name": "Saved Products",
                    "description": "Products bookmarked for future purchase"
                },
                {
                    "@type": "Thing",
                    "name": "Price Tracking",
                    "description": "Monitor price changes on saved items"
                },
                {
                    "@type": "Thing",
                    "name": "Stock Alerts",
                    "description": "Notifications when out-of-stock items become available"
                },
                {
                    "@type": "Thing",
                    "name": "Quick Purchase",
                    "description": "Easy one-click move to cart from wishlist"
                }
            ],
            "itemListElement": []
        },
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": "Wishlist Items",
                "description": "Grid or list view of saved products"
            },
            {
                "@type": "WebPageElement",
                "name": "Product Actions",
                "description": "Add to cart, remove, or share wishlist items"
            },
            {
                "@type": "WebPageElement",
                "name": "Price Alerts",
                "description": "Price change notifications for saved items"
            },
            {
                "@type": "WebPageElement",
                "name": "Availability Status",
                "description": "Stock status and availability updates"
            },
            {
                "@type": "WebPageElement",
                "name": "Wishlist Sharing",
                "description": "Share wishlist with others via link or social media"
            },
            {
                "@type": "WebPageElement",
                "name": "Bulk Actions",
                "description": "Add multiple items to cart or remove selected items"
            }
        ],
        "offers": {
            "@type": "AggregateOffer",
            "description": "Collection of saved product offers",
            "seller": {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
            "priceCurrency": "NGN"
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Registered customers who save products for later"
        },
        "about": {
            "@type": "Thing",
            "name": "Product Wishlist",
            "description": "Personal collection of saved agricultural products"
        }
    };
}

// Vendor Products Page Breadcrumb Schema
export function getVendorProductsBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Vendor Dashboard',
            url: `${SITE_DATA.domain}/vendor`
        },
        {
            name: 'My Products',
            url: `${SITE_DATA.domain}/vendor/products`
        }
    ]);
}

// Vendor Products Page Schema
export function getVendorProductsPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "CollectionPage",
        "@id": `${SITE_DATA.domain}/vendor/products#webpage`,
        "url": `${SITE_DATA.domain}/vendor/products`,
        "name": `My Products - ${SITE_DATA.name} Vendor`,
        "description": "Manage your agricultural product inventory, listings, and catalog",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/vendor`,
                        "name": "Vendor Dashboard"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/vendor/products`,
                        "name": "My Products"
                    }
                }
            ]
        },
        "potentialAction": [
            {
                "@type": "CreateAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/vendor/products/new`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Add New Product"
                },
                "result": {
                    "@type": "Product",
                    "name": "Product Listing"
                }
            },
            {
                "@type": "UpdateAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/vendor/products/{product_id}/edit`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Edit Product"
                }
            },
            {
                "@type": "DeleteAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/vendor/products/{product_id}/delete`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Delete Product"
                }
            },
            {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/vendor/products?search={search_term_string}`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "query-input": "required name=search_term_string",
                "name": "Search Products"
            }
        ],
        "mainEntity": {
            "@type": "ItemList",
            "name": "Vendor Product Catalog",
            "description": "Complete inventory of vendor's agricultural products",
            "about": [
                {
                    "@type": "Thing",
                    "name": "Active Products",
                    "description": "Products currently listed and available for sale"
                },
                {
                    "@type": "Thing",
                    "name": "Out of Stock",
                    "description": "Products temporarily unavailable"
                },
                {
                    "@type": "Thing",
                    "name": "Draft Products",
                    "description": "Incomplete product listings not yet published"
                },
                {
                    "@type": "Thing",
                    "name": "Archived Products",
                    "description": "Previously listed products no longer for sale"
                }
            ],
            "itemListElement": []
        },
        "hasPart": [
            {
                "@type": "WebPageElement",
                "name": "Product List",
                "description": "Grid or table view of all product listings"
            },
            {
                "@type": "WebPageElement",
                "name": "Product Filters",
                "description": "Filter by category, status, stock level, or price range"
            },
            {
                "@type": "WebPageElement",
                "name": "Bulk Actions",
                "description": "Update multiple products simultaneously"
            },
            {
                "@type": "WebPageElement",
                "name": "Quick Edit",
                "description": "Rapidly update price, stock, or availability"
            },
            {
                "@type": "WebPageElement",
                "name": "Product Performance",
                "description": "Sales data, views, and conversion rates per product"
            },
            {
                "@type": "WebPageElement",
                "name": "Stock Alerts",
                "description": "Low stock warnings and out-of-stock notifications"
            },
            {
                "@type": "WebPageElement",
                "name": "Product Analytics",
                "description": "Performance metrics and sales trends for each product"
            },
            {
                "@type": "WebPageElement",
                "name": "Listing Optimization",
                "description": "Suggestions to improve product visibility and sales"
            },
            {
                "@type": "WebPageElement",
                "name": "Image Gallery",
                "description": "Manage product photos and media"
            }
        ],
        "offers": {
            "@type": "AggregateOffer",
            "description": "Vendor's product offerings",
            "seller": {
                "@type": "Organization",
                "name": "Vendor"
            },
            "priceCurrency": "NGN"
        },
        "audience": {
            "@type": "Audience",
            "audienceType": "Registered vendors managing product inventory"
        },
        "about": [
            {
                "@type": "Thing",
                "name": "Inventory Management",
                "description": "Tools for managing product catalog and stock levels"
            },
            {
                "@type": "Thing",
                "name": "Product Optimization",
                "description": "Features to improve product listings and sales performance"
            },
            {
                "@type": "Thing",
                "name": "Catalog Organization",
                "description": "System for categorizing and organizing products"
            },
            {
                "@type": "Thing",
                "name": "Stock Control",
                "description": "Real-time inventory tracking and alerts"
            }
        ],
        "accessMode": ["textual", "visual"],
        "accessibilityFeature": [
            "alternativeText",
            "structuralNavigation",
            "tableOfContents"
        ]
    };
}

// Add to seo.jsonld.js

export function getVendorAddProductBreadcrumbJsonLd() {
    return getBreadcrumbJsonLd([
        {
            name: 'Home',
            url: SITE_DATA.domain
        },
        {
            name: 'Vendor Dashboard',
            url: `${SITE_DATA.domain}/vendor`
        },
        {
            name: 'Products',
            url: `${SITE_DATA.domain}/vendor/products`
        },
        {
            name: 'Add Products',
            url: `${SITE_DATA.domain}/vendor/products/add`
        }
    ]);
}

export function getVendorAddProductPageJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${SITE_DATA.domain}/vendor/products/add#webpage`,
        "url": `${SITE_DATA.domain}/vendor/products/add`,
        "name": `Add Products to Catalog - ${SITE_DATA.name}`,
        "description": "Select products from catalog, set prices, manage stock, and control availability",
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@id": SITE_DATA.domain,
                        "name": "Home"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@id": `${SITE_DATA.domain}/vendor`,
                        "name": "Vendor Dashboard"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@id": `${SITE_DATA.domain}/vendor/products`,
                        "name": "Products"
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "item": {
                        "@id": `${SITE_DATA.domain}/vendor/products/add`,
                        "name": "Add Products"
                    }
                }
            ]
        },
        "potentialAction": [
            {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/vendor/products/add?search={search_term}`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "query-input": "required name=search_term"
            },
            {
                "@type": "ChooseAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_DATA.domain}/vendor/products/add`,
                    "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                    ]
                },
                "object": {
                    "@type": "Product",
                    "name": "Agricultural Products"
                }
            }
        ]
    };
}

export function getVendorProductManagementJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "SoftwareApplication",
        "@id": `${SITE_DATA.domain}/vendor/products/add#application`,
        "name": "Vendor Product Catalog Management",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "NGN"
        },
        "featureList": [
            "Browse complete product catalog",
            "Select products to sell",
            "Set competitive prices",
            "Manage stock levels",
            "Control product availability",
            "Real-time inventory updates",
            "Bulk product import",
            "Price comparison tools",
            "Stock alerts and notifications",
            "Product performance analytics"
        ],
        "screenshot": `${SITE_DATA.domain}/images/vendor/product-management-screenshot.jpg`,
        "provider": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        }
    };
}

export function getVendorAddProductHowToJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "HowTo",
        "name": "How to Add Products to Your Vendor Catalog",
        "description": "Step-by-step guide to selecting products, setting prices, and managing inventory in your vendor catalog",
        "totalTime": "PT5M",
        "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "NGN",
            "value": "0"
        },
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Browse Product Catalog",
                "text": "Browse the complete product catalog or use search and filters to find specific agricultural products you want to sell.",
                "url": `${SITE_DATA.domain}/vendor/products/add`,
                "itemListElement": [
                    {
                        "@type": "HowToDirection",
                        "text": "Use category filters to narrow down products"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Search by product name or SKU"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "View product details and specifications"
                    }
                ]
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Select Products",
                "text": "Choose products available in your inventory that you want to add to your catalog for customers to purchase.",
                "itemListElement": [
                    {
                        "@type": "HowToDirection",
                        "text": "Click on products to select them"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Review product information and images"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Select multiple products for bulk addition"
                    }
                ]
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Set Competitive Prices",
                "text": "Configure your selling price for each product based on your costs and market conditions. You have full control over your pricing.",
                "itemListElement": [
                    {
                        "@type": "HowToDirection",
                        "text": "Enter your selling price in NGN"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "View suggested market prices for reference"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Set discount prices if applicable"
                    }
                ]
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Manage Stock Levels",
                "text": "Set the quantity of each product you have available in stock. Update these numbers as your inventory changes.",
                "itemListElement": [
                    {
                        "@type": "HowToDirection",
                        "text": "Enter current stock quantity"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Set minimum stock alert threshold"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Enable stock tracking"
                    }
                ]
            },
            {
                "@type": "HowToStep",
                "position": 5,
                "name": "Control Availability",
                "text": "Choose whether to make products immediately available to customers or keep them hidden until you're ready to sell.",
                "itemListElement": [
                    {
                        "@type": "HowToDirection",
                        "text": "Toggle product availability status"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Set product as active or inactive"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Schedule future availability dates"
                    }
                ]
            },
            {
                "@type": "HowToStep",
                "position": 6,
                "name": "Save & Publish",
                "text": "Review all product details and save them to your catalog. Your products will be immediately visible to customers if set as available.",
                "itemListElement": [
                    {
                        "@type": "HowToDirection",
                        "text": "Review all entered information"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "Click save to add products to catalog"
                    },
                    {
                        "@type": "HowToDirection",
                        "text": "View confirmation of successfully added products"
                    }
                ]
            }
        ],
        "tool": [
            {
                "@type": "HowToTool",
                "name": "Product Search & Filter System"
            },
            {
                "@type": "HowToTool",
                "name": "Price Calculator"
            },
            {
                "@type": "HowToTool",
                "name": "Stock Management Interface"
            },
            {
                "@type": "HowToTool",
                "name": "Availability Toggle"
            }
        ]
    };
}

export function getVendorProductManagementFAQJsonLd() {
    return {
        "@context": SCHEMA_BASE.context,
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I add products to my vendor catalog?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Browse the product catalog, select the products you want to sell, set your prices, configure stock levels, and control availability. All products you add will be visible to customers once set as available."
                }
            },
            {
                "@type": "Question",
                "name": "Can I set my own prices for products?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you have complete control over your pricing. Set your own prices based on your costs and profit margins. You can view market prices for reference but are free to set competitive prices that work for your business."
                }
            },
            {
                "@type": "Question",
                "name": "How do I manage stock levels?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When adding products, enter the current stock quantity you have available. You can update stock levels anytime from your product management dashboard. Set minimum stock alerts to get notifications when inventory runs low."
                }
            },
            {
                "@type": "Question",
                "name": "Can I hide products temporarily?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can control product availability. Toggle products as active or inactive. Inactive products remain in your catalog but are hidden from customers until you make them available again."
                }
            },
            {
                "@type": "Question",
                "name": "What happens when a product is out of stock?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When stock reaches zero, the product is automatically marked as out of stock and customers cannot place orders. Update the stock quantity when you restock to make it available for purchase again."
                }
            },
            {
                "@type": "Question",
                "name": "Can I add multiple products at once?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can select multiple products from the catalog and add them in bulk. Configure prices, stock, and availability for each product individually or use bulk actions to apply settings to multiple products simultaneously."
                }
            },
            {
                "@type": "Question",
                "name": "How often can I update prices?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can update product prices anytime based on market conditions, costs, or promotional needs. Price changes take effect immediately and are reflected to customers in real-time."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need to add all products at once?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, you can add products gradually as your inventory grows. Start with products you currently have in stock and add more over time. There's no minimum or maximum limit on the number of products in your catalog."
                }
            }
        ]
    };
}

// Blog detail page
export function getBlogJsonLd(blog) {
    if (!blog) return null;

    const {
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category,
        tags,
        author,
        status,
        is_featured,
        meta_title,
        meta_description,
        published_at,
        created_at,
        updated_at,
    } = blog;

    const postUrl = `${SITE_DATA.domain}/blogs/${slug}`;
    const publishDate = published_at || created_at;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "BlogPosting",
        "@id": `${postUrl}#blogpost`,
        "headline": title,
        "name": title,
        "description": meta_description || excerpt,
        "url": postUrl,
        "image": featured_image
            ? {
                "@type": "ImageObject",
                "url": featured_image,
                "caption": title
            }
            : `${SITE_DATA.domain}/placeholder.jpg`,
        "datePublished": publishDate ? new Date(publishDate).toISOString() : new Date(created_at).toISOString(),
        "dateModified": updated_at ? new Date(updated_at).toISOString() : new Date(created_at).toISOString(),
        "author": author
            ? {
                "@type": "Person",
                "name": author?.full_name || author?.name || author,
            }
            : {
                "@type": "Organization",
                "@id": `${SITE_DATA.domain}/#organization`
            },
        "publisher": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`,
            "name": SITE_DATA.name,
            "logo": toJsonLd(SCHEMA_BASE.logo)
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
        },
        "isPartOf": {
            "@type": "Blog",
            "@id": `${SITE_DATA.domain}/blog#blog`
        },
        "articleSection": category || "Blog",
        ...(tags?.length > 0 && {
            "keywords": Array.isArray(tags) ? tags.join(", ") : tags
        }),
        ...(is_featured && {
            "backstory": "Featured article highlighting innovation and insight in agriculture"
        }),
        "inLanguage": "en-NG",
        "copyrightYear": new Date(created_at).getFullYear(),
        "copyrightHolder": {
            "@type": "Organization",
            "@id": `${SITE_DATA.domain}/#organization`
        }
    };
}

// Blog detail page
export function getBlogPageJsonLd(blog) {
    if (!blog) return null;

    const postUrl = `${SITE_DATA.domain}/blogs/${blog.slug}`;

    return {
        "@context": SCHEMA_BASE.context,
        "@type": "WebPage",
        "@id": `${postUrl}#webpage`,
        "url": postUrl,
        "name": blog.meta_title || blog.title,
        "description": blog.meta_description || blog.excerpt,
        "inLanguage": "en-NG",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${SITE_DATA.domain}/#website`
        },
        "about": {
            "@type": "Thing",
            "name": blog.category || "Agriculture",
            "description": blog.excerpt
        },
        "mainEntity": {
            "@type": "BlogPosting",
            "@id": `${postUrl}#blogpost`
        }
    };
}