// seo.layout.js

import { SITE_DATA } from "../data";

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
        metadataBase: new URL(SITE_DATA.domain),

        title: {
            default: `${SITE_DATA.name} - ${SITE_DATA.tagline}`,
            template: `%s | ${SITE_DATA.name}`
        },
        description: SITE_DATA.descriptions.long,
        keywords: [
            ...SITE_DATA.keywords.primary,
            ...SITE_DATA.keywords.secondary,
            ...SITE_DATA.keywords.locations
        ].join(', '),

        authors: [{ name: SITE_DATA.name, url: SITE_DATA.domain }],
        creator: SITE_DATA.name,
        publisher: SITE_DATA.legalName,

        // Format detection
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },

        // App configuration
        applicationName: SITE_DATA.name,
        generator: 'Next.js',
        referrer: 'origin-when-cross-origin',

        // Verification tags
        verification: {
            google: SITE_DATA.verification.google,
            bing: SITE_DATA.verification.bing,
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
            url: SITE_DATA.domain,
            siteName: `${SITE_DATA.name} - ${SITE_DATA.tagline}`,
            title: `${SITE_DATA.name} - Buy Quality Agricultural Products in Nigeria`,
            description: SITE_DATA.descriptions.medium,
            images: [
                {
                    url: SITE_DATA.assets.ogImage,
                    width: SITE_DATA.assets.ogImageWidth,
                    height: SITE_DATA.assets.ogImageHeight,
                    alt: `${SITE_DATA.name} - ${SITE_DATA.tagline}`,
                    type: 'image/jpeg',
                }
            ],
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            title: `${SITE_DATA.name} - ${SITE_DATA.tagline}`,
            description: SITE_DATA.descriptions.short,
            creator: SITE_DATA.social.twitterHandle,
            site: SITE_DATA.social.twitterHandle,
            images: [SITE_DATA.assets.ogImage],
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
            title: SITE_DATA.name,
            statusBarStyle: 'default',
        },

        // Alternative languages
        alternates: {
            canonical: SITE_DATA.domain,
            languages: {
                'en-NG': SITE_DATA.domain,
            },
        },

        // Other metadata
        other: {
            'mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default',
            'apple-mobile-web-app-title': SITE_DATA.name,
            'format-detection': 'telephone=no',

            // Facebook App ID
            'fb:app_id': SITE_DATA.verification.facebook,

            // Business information
            'og:region': SITE_DATA.address.countryCode,
            'og:country-name': SITE_DATA.address.country,
            'og:email': SITE_DATA.email,
            'og:phone_number': SITE_DATA.phone,
            'og:latitude': SITE_DATA.geo.latitude,
            'og:longitude': SITE_DATA.geo.longitude,
            'og:street-address': SITE_DATA.address.street,
            'og:locality': SITE_DATA.address.city,
            'og:region': SITE_DATA.address.state,

            // Business contact data
            'business:contact_data:street_address': SITE_DATA.address.street,
            'business:contact_data:locality': SITE_DATA.address.city,
            'business:contact_data:region': SITE_DATA.address.state,
            'business:contact_data:country_name': SITE_DATA.address.country,

            // Pinterest
            'pinterest-rich-pin': 'true',
        },
    };
}