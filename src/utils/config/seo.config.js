// seo.config.js

import { SITE_CONFIG } from "./site.config";

export function generateMetadata(options = {}) {
    const {
        pageType = 'website',

        title,
        description,
        keywords = [],

        path = '',
        canonical,

        images = [],

        data = {},

        pagination = {},

        index = true,
        follow = true,

        additionalMetadata = {}
    } = options;

    const pageUrl = canonical || `${SITE_CONFIG.domain}${path}`;

    const fullTitle = title
        ? `${title} | ${SITE_CONFIG.name}`
        : `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;

    const fullDescription = description || SITE_CONFIG.descriptions.medium;

    const allKeywords = [
        ...SITE_CONFIG.keywords.primary,
        ...keywords,
        ...SITE_CONFIG.keywords.secondary,
        ...SITE_CONFIG.keywords.locations
    ].filter(Boolean).join(', ');

    const ogImages = images.length > 0
        ? images.map(img => typeof img === 'string' ? { url: img } : img)
        : [{
            url: SITE_CONFIG.assets.ogImage,
            width: SITE_CONFIG.assets.ogImageWidth,
            height: SITE_CONFIG.assets.ogImageHeight,
            alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`
        }];

    const metadata = {
        title: fullTitle,
        description: fullDescription,
        keywords: allKeywords,

        openGraph: {
            type: pageType === 'article' ? 'article' : 'website',
            locale: 'en_NG',
            url: pageUrl,
            siteName: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
            title: title || fullTitle,
            description: fullDescription,
            images: ogImages,
            ...(data.publishedTime && { publishedTime: data.publishedTime }),
            ...(data.modifiedTime && { modifiedTime: data.modifiedTime }),
            ...(data.authors && { authors: data.authors }),
            ...(data.tags && { tags: data.tags })
        },

        twitter: {
            card: 'summary_large_image',
            title: title || fullTitle,
            description: fullDescription,
            images: ogImages.map(img => img.url),
            creator: SITE_CONFIG.social.twitterHandle,
            site: SITE_CONFIG.social.twitterHandle
        },

        alternates: {
            canonical: pageUrl,
            languages: {
                'en-NG': pageUrl
            },
            ...(pagination.prev && { prev: pagination.prev }),
            ...(pagination.next && { next: pagination.next })
        },

        robots: {
            index,
            follow,
            nocache: false,
            googleBot: {
                index,
                follow,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1
            }
        },
        ...additionalMetadata
    };
    return metadata;
}

export const SCHEMA_BASE = {
    context: "https://schema.org",

    // Organization details
    organization: {
        type: "Organization",
        name: SITE_CONFIG.name,
        legalName: SITE_CONFIG.legalName,
        alternateName: SITE_CONFIG.tagline,
        url: SITE_CONFIG.domain,
        description: SITE_CONFIG.descriptions.long,
        foundingDate: SITE_CONFIG.business.founded,
    },

    // Logo object (reusable)
    logo: {
        type: "ImageObject",
        url: `${SITE_CONFIG.domain}${SITE_CONFIG.assets.logo}`,
        width: SITE_CONFIG.assets.logoWidth,
        height: SITE_CONFIG.assets.logoHeight
    },

    // Address object (reusable)
    address: {
        type: "PostalAddress",
        streetAddress: SITE_CONFIG.address.street,
        addressLocality: SITE_CONFIG.address.city,
        addressRegion: SITE_CONFIG.address.state,
        addressCountry: SITE_CONFIG.address.countryCode
    },

    // Geo coordinates (reusable)
    geo: {
        type: "GeoCoordinates",
        latitude: SITE_CONFIG.geo.latitude,
        longitude: SITE_CONFIG.geo.longitude
    },

    // Contact points (reusable)
    contactPoints: [
        {
            type: "ContactPoint",
            telephone: SITE_CONFIG.phone,
            contactType: "customer service",
            email: SITE_CONFIG.email,
            availableLanguage: ["en"],
            areaServed: SITE_CONFIG.address.countryCode
        },
        {
            type: "ContactPoint",
            telephone: SITE_CONFIG.phone,
            contactType: "sales",
            availableLanguage: ["en"],
            areaServed: SITE_CONFIG.address.countryCode
        }
    ],

    // Social media profiles
    sameAs: [
        SITE_CONFIG.social.facebook,
        SITE_CONFIG.social.twitter,
        SITE_CONFIG.social.instagram
    ],

    // Area served
    areaServed: {
        type: "Country",
        name: SITE_CONFIG.address.country
    },

    // Opening hours specifications
    openingHours: [
        {
            type: "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: SITE_CONFIG.business.openingHours.weekdays.open,
            closes: SITE_CONFIG.business.openingHours.weekdays.close
        },
        {
            type: "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: SITE_CONFIG.business.openingHours.saturday.open,
            closes: SITE_CONFIG.business.openingHours.saturday.close
        }
    ]
};

export const PRODUCT_SCHEMA_CONFIG = {
    // Default product image handler
    getProductImages: (product) => {
        const rawImages = [
            product.image,
            ...(product.images ? JSON.parse(product.images) : [])
        ].filter(Boolean);

        return rawImages.map((img) =>
            img.startsWith('http')
                ? img
                : `${SITE_CONFIG.domain}${img}`
        );
        // const images = [
        //     product.image,
        //     ...(product.images ? JSON.parse(product.images) : [])
        // ].filter(Boolean);
        // return images;
    },

    // Product description generator
    getProductDescription: (product) => {
        return product.description ||
            `${product.title} - Premium ${product.category?.title || 'agricultural product'} by ${product.brands || SITE_CONFIG.name}`;
    },

    // Price valid until (1 year from now)
    getPriceValidUntil: () => {
        return new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString()
            .split('T')[0];
    },

    // Stock availability
    getAvailability: (stock) => {
        return stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock";
    },

    // Shipping details for Nigerian market
    shippingDetails: {
        type: "OfferShippingDetails",
        shippingRate: {
            type: "MonetaryAmount",
            value: "0",
            currency: "NGN"
        },
        shippingDestination: {
            type: "DefinedRegion",
            addressCountry: "NG"
        },
        deliveryTime: {
            type: "ShippingDeliveryTime",
            businessDays: {
                type: "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            },
            cutoffTime: "18:00:00+01:00",
            handlingTime: {
                type: "QuantitativeValue",
                minValue: 0,
                maxValue: 1,
                unitCode: "DAY"
            },
            transitTime: {
                type: "QuantitativeValue",
                minValue: 1,
                maxValue: 3,
                unitCode: "DAY"
            }
        }
    },

    // Return policy
    returnPolicy: {
        type: "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn"
    }
};

export const FAQ_CONFIG = {
    homeFAQs: [
        {
            question: `What products does ${SITE_CONFIG.name} sell?`,
            answer: `${SITE_CONFIG.name} offers a wide range of agricultural products including seeds, fertilizers, pesticides, herbicides, fungicides, farm equipment, irrigation systems, animal feed, and other farming supplies for Nigerian farmers. We provide quality agricultural inputs, farm management services, and agricultural laboratory services.`
        },
        {
            question: "Do you deliver nationwide in Nigeria?",
            answer: "Yes, we deliver to all 36 states in Nigeria. Delivery typically takes 1-3 business days depending on your location. We partner with reliable logistics companies to ensure your products arrive safely and on time."
        },
        {
            question: "Are the products genuine and quality assured?",
            answer: `Absolutely! All products sold on ${SITE_CONFIG.name} are 100% genuine and sourced directly from reputable manufacturers and authorized distributors. ${SITE_CONFIG.legalName} leverages in-depth research and development to guarantee quality and authenticity for all agricultural products.`
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept multiple payment methods including bank transfers, debit cards, credit cards, USSD, and mobile money transfers. All transactions are secure and encrypted for your safety."
        },
        {
            question: "Can I return a product if I'm not satisfied?",
            answer: "Yes, we have a 7-day return policy for unopened products in their original packaging. If you receive a damaged or wrong product, contact us immediately for a free replacement or full refund."
        },
        {
            question: `Where is ${SITE_CONFIG.name} located?`,
            answer: `We are located at ${SITE_CONFIG.address.full}. You can contact us via phone at ${SITE_CONFIG.phone}, email at ${SITE_CONFIG.email}, or through WhatsApp for immediate assistance.`
        }
    ],

    // Product FAQ generators
    getProductFAQs: (product) => [
        {
            question: `What is ${product.title}?`,
            answer: product.description ||
                `${product.title} is a premium ${product.category?.title || 'agricultural product'} from ${product.brands || SITE_CONFIG.name}.`
        },
        {
            question: `How much does ${product.title} cost?`,
            answer: `${product.title} is priced at ₦${Number(product.price).toLocaleString()} ${product.discount_price
                ? `(Save ₦${Number(product.discount_price - product.price).toLocaleString()})`
                : ''
                }.`
        },
        {
            question: `Is ${product.title} in stock?`,
            answer: product.stock > 0
                ? `Yes, ${product.title} is currently in stock with ${product.stock} units available.`
                : `${product.title} is currently out of stock. Please check back soon or contact us for availability.`
        },
        {
            question: "Do you deliver nationwide?",
            answer: "Yes, we deliver nationwide across Nigeria within 1-3 business days."
        }
    ]
};

export const OFFER_CATALOG_CONFIG = {
    name: "Agricultural Products & Services Catalog",
    description: SITE_CONFIG.descriptions.medium,
    categories: [
        {
            name: "Seeds",
            description: "Quality hybrid and improved seeds for Nigerian farmers - maize, rice, vegetable seeds and more"
        },
        {
            name: "Fertilizers",
            description: "Organic and chemical fertilizers for optimal crop nutrition - NPK, Urea, DAP and more"
        },
        {
            name: "Pesticides",
            description: "Effective pest control solutions for protecting your crops and maximizing yields"
        },
        {
            name: "Farm Equipment",
            description: "Modern agricultural machinery, tools and equipment for efficient farming"
        },
        {
            name: "Herbicides",
            description: "Powerful weed control products for maintaining healthy, weed-free crops"
        },
        {
            name: "Fungicides",
            description: "Disease prevention and treatment solutions for crop protection"
        },
        {
            name: "Irrigation Systems",
            description: "Water management solutions for optimal crop hydration and efficient farming"
        },
        {
            name: "Animal Feed",
            description: "Nutritious feed products for poultry, cattle, fish and other livestock"
        },
        {
            name: "Agricultural Services",
            description: "Farm management, consultancy, and laboratory services for Nigerian farmers"
        }
    ]
};

export const SERVICE_CONFIG = {
    name: "Agricultural Products Delivery & Support Services",
    serviceType: "Agricultural Supply Services",
    services: [
        {
            name: "Nationwide Delivery",
            description: "Fast and reliable delivery of agricultural products across all 36 states in Nigeria"
        },
        {
            name: "Agricultural Consulting",
            description: "Expert advice on crop management, farm inputs, and agricultural best practices"
        },
        {
            name: "Farm Management Services",
            description: "Comprehensive farm management solutions for optimal productivity"
        },
        {
            name: "Agricultural Laboratory Services",
            description: "Soil testing, product analysis, and quality assurance services"
        },
        {
            name: "Bulk Order Support",
            description: "Special pricing and dedicated support for large farm operations and cooperatives"
        },
        {
            name: "Technical Support & Training",
            description: "Product usage training and ongoing technical support for farmers"
        }
    ]
};

export function toJsonLd(obj) {
    if (!obj) return null;

    if (Array.isArray(obj)) {
        return obj.map(item => toJsonLd(item));
    }

    if (typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key === 'type') {
                result['@type'] = value;
            } else if (key === 'context') {
                result['@context'] = value;
            } else {
                result[key] = toJsonLd(value);
            }
        }
        return result;
    }

    return obj;
}