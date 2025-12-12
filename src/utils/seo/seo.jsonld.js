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