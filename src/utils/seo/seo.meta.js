// seo.meta.js
import { generateMetadata } from "../config/seo.config";
import { SITE_DATA } from "../data";
import { formatPrice } from "../helper";

export function getHomeMetadata() {
    return generateMetadata({
        pageType: 'website',
        title: 'Buy Quality Agricultural Products in Nigeria - Seeds, Fertilizers & Farm Equipment',
        description: null,
        path: '/',
        keywords: [
            'agriculture Nigeria',
            'buy farm products online',
            'agricultural inputs Nigeria',
            'farming supplies',
            'agro dealer Nigeria'
        ]
    });
}

export function getProductMetadata(product) {
    if (!product) {
        return generateMetadata({
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
            index: false
        });
    }

    const {
        title,
        description,
        slug,
        price,
        discount_price,
        image,
        images,
        category,
        subcategory,
        brands,
        stock,
        badges,
        keywords: productKeywords,
        reviews_summary
    } = product;

    const formattedPrice = formatPrice(price);
    const rating = reviews_summary?.average_ratings || 0;
    const reviewCount = reviews_summary?.reviews_count || 0;

    // Enhanced SEO title with power words and location
    const seoTitle = `Buy ${title} ${formattedPrice} | ${brands || 'Quality'} ${category?.title || 'Product'}`;

    // Rich SEO description with key selling points
    const seoDescription = description
        ? `${description.substring(0, 120)}... ${rating > 0 ? `⭐ ${rating}/5 (${reviewCount} reviews)` : ''} Buy genuine ${brands || ''} ${title} at ${formattedPrice}. ${stock > 0 ? '✓ In Stock' : 'Pre-order available'}. Fast delivery across Nigeria. Shop now!`
        : `Buy ${title} at ${formattedPrice}. Premium ${category?.title || 'agricultural product'} by ${brands || 'SuperoAgrobase'}. ${stock > 0 ? 'In stock' : 'Available soon'} with nationwide delivery. ${rating > 0 ? `Rated ${rating}/5` : 'Quality guaranteed'}.`;

    // Comprehensive keywords for better discoverability
    const allKeywords = [
        title,
        brands,
        category?.title,
        subcategory?.title,
        `buy ${title} online`,
        `${title} price Nigeria`,
        `${brands} products`,
        `${category?.title} Nigeria`,
        'agricultural supplies Nigeria',
        'farm products online',
        'agro dealer Nigeria',
        ...(badges || []),
        ...(productKeywords ? productKeywords.split(',').map(k => k.trim()) : []),
    ].filter(Boolean);

    // Get all product images for rich media sharing
    const productImages = [
        image,
        ...(images ? JSON.parse(images) : [])
    ].filter(Boolean);

    // Map images for metadata
    const metadataImages = productImages.map((img, index) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: `${title} - ${brands || 'SuperoAgrobase'}${index > 0 ? ` view ${index + 1}` : ''}`
    }));

    return generateMetadata({
        pageType: 'website',
        title: seoTitle,
        description: seoDescription.substring(0, 160), // Optimal length for search results
        path: `/products/${slug}`,
        keywords: allKeywords,
        images: metadataImages,
        additionalMetadata: {
            // Open Graph product-specific data
            openGraph: {
                type: 'website',
                product: {
                    priceAmount: price,
                    priceCurrency: 'NGN',
                    availability: stock > 0 ? 'in stock' : 'out of stock',
                    condition: 'new',
                    brand: brands || 'SuperoAgrobase',
                    category: category?.title,
                    ...(discount_price && {
                        salePrice: price,
                        regularPrice: discount_price
                    })
                }
            },

            // Twitter card with rating
            twitter: {
                card: 'summary_large_image',
                title: `${title} - ${formattedPrice}`,
                description: `${rating > 0 ? `⭐ ${rating}/5 | ` : ''}${description?.substring(0, 100) || title}`,
            },

            // Additional product metadata
            other: {
                'product:price:amount': price,
                'product:price:currency': 'NGN',
                'product:availability': stock > 0 ? 'in stock' : 'out of stock',
                'product:condition': 'new',
                'product:brand': brands || 'SuperoAgrobase',
                'product:category': category?.title,
                ...(rating > 0 && {
                    'product:rating:value': rating,
                    'product:rating:count': reviewCount,
                    'product:rating:scale': '5'
                }),
                ...(discount_price && {
                    'product:sale_price': price,
                    'product:sale_price_effective_date': new Date().toISOString().split('T')[0],
                    'product:original_price': discount_price
                })
            },

            // Apple-specific metadata
            appleWebApp: {
                title: title,
                statusBarStyle: 'default',
                capable: true
            }
        }
    });
}

export function getFAQsMetadata() {
    return generateMetadata({
        pageType: 'website',
        title: 'Frequently Asked Questions (FAQs) - Agricultural Products & Services',
        description: 'Get answers to common questions about buying agricultural products, delivery, payments, returns, and more. Learn about our quality assurance, nationwide delivery across Nigeria, and customer support.',
        path: '/faqs',
        keywords: [
            'FAQs agriculture Nigeria',
            'agricultural products questions',
            'farm supplies help',
            'delivery questions Nigeria',
            'payment methods agriculture',
            'return policy farm products',
            'customer support agriculture'
        ],
        additionalMetadata: {
            openGraph: {
                type: 'website'
            },
            other: {
                'article:section': 'Customer Support',
                'article:tag': 'FAQs, Help, Customer Service'
            }
        }
    });
}

export function getPrivacyPolicyMetadata() {
    return generateMetadata({
        pageType: 'website',
        title: 'Privacy Policy - Data Protection & NDPR Compliance',
        description: `Learn how ${SITE_DATA.name} collects, uses, and protects your personal information. Our privacy policy complies with Nigeria Data Protection Regulation (NDPR) and ensures your data security.`,
        path: '/privacy-policy',
        keywords: [
            'privacy policy Nigeria',
            'NDPR compliance',
            'data protection Nigeria',
            'personal information security',
            'Nigeria Data Protection Regulation',
            'customer data privacy',
            'secure shopping Nigeria'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website'
            },
            other: {
                'article:section': 'Legal',
                'article:tag': 'Privacy, Data Protection, NDPR, Legal',
                'article:modified_time': new Date().toISOString()
            }
        }
    });
}

export function getTermsOfServiceMetadata() {
    return generateMetadata({
        pageType: 'website',
        title: 'Terms of Service - User Agreement & Policies',
        description: `Read our terms of service governing the use of ${SITE_DATA.name}. Understand your rights, responsibilities, purchase terms, delivery policies, and dispute resolution procedures.`,
        path: '/terms-of-service',
        keywords: [
            'terms of service Nigeria',
            'user agreement agriculture',
            'terms and conditions',
            'purchase policies Nigeria',
            'delivery terms',
            'refund policy',
            'legal agreement ecommerce'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website'
            },
            other: {
                'article:section': 'Legal',
                'article:tag': 'Terms, Conditions, Agreement, Legal',
                'article:modified_time': new Date().toISOString()
            }
        }
    });
}

export function getCookiePolicyMetadata() {
    return generateMetadata({
        pageType: 'website',
        title: 'Cookie Policy - How We Use Cookies & Tracking',
        description: `Understand how ${SITE_DATA.name} uses cookies and tracking technologies to improve your browsing experience. Learn about cookie types, third-party cookies, and how to manage your preferences.`,
        path: '/cookie-policy',
        keywords: [
            'cookie policy Nigeria',
            'cookies tracking',
            'browser cookies',
            'privacy cookies',
            'tracking technologies',
            'cookie management',
            'website cookies Nigeria'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website'
            },
            other: {
                'article:section': 'Legal',
                'article:tag': 'Cookies, Privacy, Tracking, Legal',
                'article:modified_time': new Date().toISOString()
            }
        }
    });
}

export function getDisclaimerMetadata() {
    return generateMetadata({
        pageType: 'website',
        title: 'Disclaimer - Limitations of Liability & Product Information',
        description: `Important disclaimer about product information, pricing, agricultural advice, and limitations of liability for ${SITE_DATA.name}. Understand our terms before making purchases.`,
        path: '/disclaimer',
        keywords: [
            'disclaimer Nigeria',
            'liability limitations',
            'product disclaimer agriculture',
            'agricultural advice disclaimer',
            'legal disclaimer ecommerce',
            'warranty disclaimer',
            'agricultural products liability'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website'
            },
            other: {
                'article:section': 'Legal',
                'article:tag': 'Disclaimer, Liability, Legal, Warranty',
                'article:modified_time': new Date().toISOString()
            }
        }
    });
}