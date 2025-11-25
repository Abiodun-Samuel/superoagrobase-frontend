// seo.layout.js
import { SITE_CONFIG } from "../config/site.config";

export function getRootLayoutViewport() {
    return {
        themeColor: [
            { media: '(prefers-color-scheme: light)', color: '#10b981' },
            { media: '(prefers-color-scheme: dark)', color: '#059669' }
        ],
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
        viewportFit: 'cover',
        colorScheme: 'light dark'
    };
}

export function getRootLayoutMetadata() {
    return {
        metadataBase: new URL(SITE_CONFIG.domain),

        title: {
            default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
            template: `%s | ${SITE_CONFIG.name}`
        },
        description: SITE_CONFIG.descriptions.long,
        keywords: [
            ...SITE_CONFIG.keywords.primary,
            ...SITE_CONFIG.keywords.secondary,
            ...SITE_CONFIG.keywords.locations
        ].join(', '),

        authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.domain }],
        creator: SITE_CONFIG.name,
        publisher: SITE_CONFIG.legalName,

        // Format detection
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },

        // App configuration
        applicationName: SITE_CONFIG.name,
        generator: 'Next.js',
        referrer: 'origin-when-cross-origin',

        // Verification tags
        verification: {
            google: SITE_CONFIG.verification.google,
            bing: SITE_CONFIG.verification.bing,
        },

        // Category
        category: 'agriculture',

        // Robots
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        // Open Graph - Default values (can be overridden by page.js)
        openGraph: {
            type: 'website',
            locale: 'en_NG',
            url: SITE_CONFIG.domain,
            siteName: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
            title: `${SITE_CONFIG.name} - Buy Quality Agricultural Products in Nigeria`,
            description: SITE_CONFIG.descriptions.medium,
            images: [
                {
                    url: SITE_CONFIG.assets.ogImage,
                    width: SITE_CONFIG.assets.ogImageWidth,
                    height: SITE_CONFIG.assets.ogImageHeight,
                    alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
                    type: 'image/jpeg',
                }
            ],
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
            description: SITE_CONFIG.descriptions.short,
            creator: SITE_CONFIG.social.twitterHandle,
            site: SITE_CONFIG.social.twitterHandle,
            images: [SITE_CONFIG.assets.ogImage],
        },

        // Icons
        icons: {
            icon: [
                { url: '/favicon/favicon.ico' },
                { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
                { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            ],
            apple: [
                { url: '/favicon/apple-touch-icon.png' },
                { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
            ],
            other: [
                {
                    rel: 'mask-icon',
                    url: '/favicon/safari-pinned-tab.svg',
                },
            ],
        },

        // Manifest
        manifest: '/favicon/site.webmanifest',

        // Apple Web App
        appleWebApp: {
            capable: true,
            title: SITE_CONFIG.name,
            statusBarStyle: 'default',
        },

        // Alternative languages
        alternates: {
            canonical: SITE_CONFIG.domain,
            languages: {
                'en-NG': SITE_CONFIG.domain,
            },
        },

        // Other metadata
        other: {
            'mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default',
            'apple-mobile-web-app-title': SITE_CONFIG.name,
            'format-detection': 'telephone=no',

            // Facebook App ID
            'fb:app_id': SITE_CONFIG.verification.facebook,

            // Business information
            'og:region': SITE_CONFIG.address.countryCode,
            'og:country-name': SITE_CONFIG.address.country,
            'og:email': SITE_CONFIG.email,
            'og:phone_number': SITE_CONFIG.phone,
            'og:latitude': SITE_CONFIG.geo.latitude,
            'og:longitude': SITE_CONFIG.geo.longitude,
            'og:street-address': SITE_CONFIG.address.street,
            'og:locality': SITE_CONFIG.address.city,
            'og:region': SITE_CONFIG.address.state,

            // Business contact data
            'business:contact_data:street_address': SITE_CONFIG.address.street,
            'business:contact_data:locality': SITE_CONFIG.address.city,
            'business:contact_data:region': SITE_CONFIG.address.state,
            'business:contact_data:country_name': SITE_CONFIG.address.country,

            // Pinterest
            'pinterest-rich-pin': 'true',
        },
    };
}