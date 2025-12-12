// seo.meta.js
import { generateMetadata } from "../config/seo.config";
import { SITE_DATA } from "../data";
import { formatCurrency } from "../helper";

export function getHomeMetadata() {
    return generateMetadata({
        pageType: 'website',
        title: 'Buy Quality Agricultural Products in Nigeria',
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

    const formattedPrice = formatCurrency(price);
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
        title: 'FAQs - Agricultural Products Help Center',
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
        title: 'Privacy Policy & NDPR Compliance',
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
        title: 'Terms of Service & User Agreement',
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
        title: 'Cookie Policy & Privacy Settings',
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
        title: 'Disclaimer & Liability Information',
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

export function getProductsMetadata(params = {}) {
    const {
        category,
        subcategory,
        search,
        page = 1,
        totalProducts = 0,
        totalPages = 1,
        perPage = 50,
        brand
    } = params;

    // Build dynamic title based on filters
    const titleParts = [];

    if (search) {
        titleParts.push(`Search: "${search}"`);
    } else if (subcategory) {
        titleParts.push(subcategory);
    } else if (category) {
        titleParts.push(category);
    } else {
        titleParts.push('All Products');
    }

    if (brand) titleParts.push(`by ${brand}`);
    if (page > 1) titleParts.push(`Page ${page}`);

    const title = `${titleParts.join(' - ')}`;

    // Build dynamic description
    let description = '';

    if (search) {
        description = `Found ${totalProducts} products matching "${search}". ${page > 1 ? `Page ${page} of ${totalPages}. ` : ''}Shop quality agricultural supplies with fast delivery across Nigeria.`;
    } else if (subcategory && category) {
        description = `Browse ${totalProducts}+ ${subcategory.toLowerCase()} in ${category.toLowerCase()}. ${page > 1 ? `Page ${page} of ${totalPages}. ` : ''}Premium agricultural products with competitive prices and nationwide delivery.`;
    } else if (category) {
        description = `Explore ${totalProducts}+ ${category.toLowerCase()} products. ${page > 1 ? `Page ${page} of ${totalPages}. ` : ''}Quality agricultural supplies with fast delivery across Nigeria.`;
    } else {
        description = `Browse ${totalProducts}+ agricultural products online. ${page > 1 ? `Page ${page} of ${totalPages}. ` : ''}Seeds, fertilizers, pesticides, farm equipment and more with nationwide delivery.`;
    }

    // Build keywords
    const keywords = [
        'agricultural products Nigeria',
        'buy farm supplies online',
        'farming equipment Nigeria',
        ...(category ? [`${category} Nigeria`, `buy ${category} online`] : []),
        ...(subcategory ? [`${subcategory}`, `${subcategory} products`] : []),
        ...(brand ? [`${brand} products`] : []),
        ...(search ? [`${search} Nigeria`] : [])
    ].filter(Boolean);

    // Build canonical URL
    const queryParams = [];
    if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
    if (subcategory) queryParams.push(`subcategory=${encodeURIComponent(subcategory)}`);
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (brand) queryParams.push(`brand=${encodeURIComponent(brand)}`);
    if (page > 1) queryParams.push(`page=${page}`);
    if (perPage !== 50) queryParams.push(`per_page=${perPage}`);

    const path = `/products${queryParams.length ? `?${queryParams.join('&')}` : ''}`;

    // Pagination URLs
    const pagination = {};

    // Previous page link
    if (page > 1) {
        const prevParams = queryParams.filter(p => !p.startsWith('page='));
        if (page > 2) prevParams.push(`page=${page - 1}`);
        pagination.prev = `/products${prevParams.length ? `?${prevParams.join('&')}` : ''}`;
    }

    // Next page link
    if (page < totalPages) {
        const nextParams = queryParams.filter(p => !p.startsWith('page='));
        nextParams.push(`page=${page + 1}`);
        pagination.next = `/products?${nextParams.join('&')}`;
    }

    return generateMetadata({
        pageType: 'website',
        title,
        description: description.substring(0, 160),
        path,
        keywords,
        pagination,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            other: {
                'product:category': category || 'All Products',
                'product:count': totalProducts,
                'product:page': page,
                'product:total_pages': totalPages
            }
        }
    });
}

export function getCartMetadata() {
    const title = 'Shopping Cart - Secure Checkout';
    const description = `Review and manage your agricultural products cart. Secure checkout with multiple payment options and fast delivery across Nigeria.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/cart',
        keywords: [
            'shopping cart',
            'checkout Nigeria',
            'buy agricultural products',
            'farming supplies cart',
            'agro products checkout',
            'secure payment Nigeria',
            'farm equipment purchase',
            'online shopping cart Nigeria'
        ],
        index: false,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            robots: {
                index: false,
                follow: true,
                nocache: true,
                noarchive: true
            }
        }
    });
}

export function getAboutMetadata() {
    const title = 'About Us - Leading Agricultural Products Supplier';
    const description = `Discover ${SITE_DATA.name}, Nigeria's trusted agricultural products supplier since ${SITE_DATA.business.founded}. We provide quality seeds, fertilizers, pesticides, and farm equipment to farmers nationwide. Learn about our mission, values, and commitment to supporting Nigerian agriculture with reliable products and expert guidance.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/about',
        keywords: [
            'about SuperoAgrobase',
            'agricultural company Nigeria',
            'farm supplies Nigeria',
            'agro dealer Nigeria',
            'agricultural products supplier',
            'farming solutions Nigeria',
            'agribusiness Nigeria',
            'farm equipment supplier',
            'quality agricultural inputs',
            'Nigerian agriculture',
            'trusted agro dealer',
            'farming support Nigeria',
            'agriculture supplier Lagos',
            'farm products company'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
            },
            other: {
                'article:section': 'Company',
                'article:tag': 'About, Company, Agriculture, Nigeria',
                'article:modified_time': new Date().toISOString(),
                'company:founded': SITE_DATA.business.founded,
                'company:industry': 'Agriculture',
                'company:headquarters': `${SITE_DATA.address.city}, ${SITE_DATA.address.state}, ${SITE_DATA.address.country}`
            }
        }
    });
}

export function getAgroInputMetadata() {
    const title = 'Agro-Input Products & Research';
    const description = `Protecting Nigerian farmers from adulterated agricultural inputs through rigorous research and quality authentication. SON and NAFDAC approved products tested on our 3-hectare research facility. Trusted by 10,000+ farmers nationwide for verified seeds, fertilizers, pesticides, and farm equipment.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/services/agro-input',
        keywords: [
            'agro-input authentication Nigeria',
            'SON approved agricultural products',
            'NAFDAC certified farm inputs',
            'agricultural research Nigeria',
            'verified fertilizers Nigeria',
            'quality seeds Nigeria',
            'pesticide testing Nigeria',
            'farm input quality control',
            'agricultural laboratory services',
            'crop protection products Nigeria',
            'manufacturer claims verification',
            'adulterated fertilizers prevention',
            'genuine agricultural inputs',
            'farm products research facility',
            'quality assurance agriculture'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            other: {
                'article:section': 'Services',
                'article:tag': 'Research, Quality Control, SON, NAFDAC, Agriculture',
                'service:type': 'Agricultural Research & Quality Assurance',
                'service:area': 'Nigeria',
                'service:facility': '3 hectares research facility',
                'service:network': '10,000+ registered farmers'
            }
        }
    });
}

export function getAgriCourtVenturesMetadata() {
    const title = 'AgriCourt Ventures - Quality Agricultural Input Products';
    const description = `Buy quality agro-input products from AgriCourt Ventures. Premium seeds, granular & water-soluble fertilizers, irrigation systems, cocopeat, peat moss, worm compost, seedling trays, greenhouses, net houses, shade nets, crop protection products, tractors, and farm machinery. Research-backed agricultural supplies with nationwide delivery across Nigeria.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/services/agricourt-ventures',
        keywords: [
            'AgriCourt Ventures',
            'buy agricultural inputs Nigeria',
            'quality seeds Nigeria',
            'granular fertilizers',
            'water soluble fertilizers',
            'irrigation systems Nigeria',
            'cocopeat Nigeria',
            'peat moss suppliers',
            'worm compost Nigeria',
            'seedling trays',
            'mulch film Nigeria',
            'grow bags Nigeria',
            'greenhouse systems Nigeria',
            'net houses Nigeria',
            'shade nets suppliers',
            'insect nets agriculture',
            'crop protection products',
            'agricultural tractors Nigeria',
            'farm implements Nigeria',
            'farm machinery Nigeria',
            'growing media Nigeria',
            'locally adapted greenhouses',
            'agricultural equipment suppliers',
            'farm inputs dealer Nigeria'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            other: {
                'article:section': 'Products',
                'article:tag': 'Agricultural Inputs, Seeds, Fertilizers, Irrigation, Greenhouses, Farm Equipment',
                'business:type': 'Agricultural Products Supplier',
                'product:categories': '8',
                'product:count': '500+',
                'service:delivery': 'Nationwide Nigeria'
            }
        }
    });
}

export function getHarvestYieldFarmMetadata() {
    const title = 'HarvestYield Farm - Premium Vegetable Production & Farm Management';
    const description = `HarvestYield Farm operates 10 hectares dedicated to premium vegetable production: Tomato, Cucumber, Sweetcorn, Special Watermelon, and Pepper. We provide professional farm management services, agricultural consultancy, soil analysis, fertilizer testing, and laboratory services through partnerships with reputable labs. Science-based farming for consistent quality and superior yields.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/services/harvestyield-farm',
        keywords: [
            'HarvestYield Farm Nigeria',
            'vegetable production Nigeria',
            'tomato farming Nigeria',
            'cucumber cultivation',
            'sweetcorn production',
            'watermelon farming Nigeria',
            'pepper cultivation Nigeria',
            'farm management services Nigeria',
            'agricultural consultancy Nigeria',
            'soil analysis Nigeria',
            'fertilizer analysis services',
            'manure testing Nigeria',
            'laboratory services agriculture',
            'commercial vegetable farming',
            'farm management consultancy',
            '10 hectare farm Nigeria',
            'fresh vegetables suppliers',
            'premium vegetable crops',
            'agricultural laboratory Nigeria',
            'soil testing services',
            'farm consultancy services'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            other: {
                'article:section': 'Services',
                'article:tag': 'Vegetable Production, Farm Management, Consultancy, Laboratory Services',
                'farm:size': '10 hectares',
                'farm:crops': '5',
                'service:types': 'Production, Management, Consultancy, Laboratory',
                'farm:location': 'Nigeria'
            }
        }
    });
}

export function getContactMetadata() {
    const title = 'Contact Us - Get in Touch with Agricultural Experts';
    const description = `Contact ${SITE_DATA.name} for agricultural products, farm supplies, and expert advice. Visit our office in ${SITE_DATA.address.city}, ${SITE_DATA.address.state} or call ${SITE_DATA.phone}. Email: ${SITE_DATA.email}. Open Monday-Friday ${SITE_DATA.business.openingHours.weekdays.open}-${SITE_DATA.business.openingHours.weekdays.close}, Saturday ${SITE_DATA.business.openingHours.saturday.open}-${SITE_DATA.business.openingHours.saturday.close}. Fast response guaranteed.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/contact',
        keywords: [
            'contact SuperoAgrobase',
            'agricultural supplier contact Nigeria',
            'farm products contact',
            'agro dealer contact Lagos',
            'agricultural products enquiry',
            'farm supplies customer service',
            'agribusiness contact Nigeria',
            'agricultural consultation Nigeria',
            'farm equipment enquiry',
            'agro products support',
            'farming supplies contact',
            'agriculture customer service Nigeria',
            `contact ${SITE_DATA.address.city}`,
            'agricultural company address Nigeria',
            'farm supplier phone number'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            twitter: {
                card: 'summary',
            },
            other: {
                'article:section': 'Contact',
                'article:tag': 'Contact, Customer Service, Support, Agriculture',
                'contact:phone': SITE_DATA.phone,
                'contact:email': SITE_DATA.email,
                'contact:address': `${SITE_DATA.address.street}, ${SITE_DATA.address.city}, ${SITE_DATA.address.state}`,
                'contact:country': SITE_DATA.address.country,
                'business:hours': `Mon-Fri: ${SITE_DATA.business.openingHours.weekdays.open}-${SITE_DATA.business.openingHours.weekdays.close}, Sat: ${SITE_DATA.business.openingHours.saturday.open}-${SITE_DATA.business.openingHours.saturday.close}`
            }
        }
    });
}

export function getRegisterMetadata() {
    const title = 'Create Account - Join Our Agricultural Community';
    const description = `Sign up for ${SITE_DATA.name} and get access to quality agricultural products, exclusive deals, and expert farming advice. Fast registration with email verification. Join 10,000+ Nigerian farmers shopping online.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/auth/register',
        keywords: [
            'create account Nigeria',
            'sign up agricultural products',
            'register farm supplies',
            'new customer registration',
            'agro dealer account Nigeria',
            'farmer registration Nigeria',
            'agricultural marketplace signup',
            'create farming account',
            'register SuperoAgrobase',
            'online farm store account'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            twitter: {
                card: 'summary',
            },
            robots: {
                index: true,
                follow: true,
                noarchive: true
            },
            other: {
                'article:section': 'Authentication',
                'article:tag': 'Registration, Sign Up, New Account, Authentication'
            }
        }
    });
}

export function getLoginMetadata() {
    const title = 'Login - Access Your Agricultural Products Account';
    const description = `Sign in to your ${SITE_DATA.name} account to manage orders, track deliveries, save favorite products, and access exclusive agricultural deals. Secure login for Nigerian farmers and agribusinesses.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/auth/login',
        keywords: [
            'login agricultural account',
            'sign in farm supplies',
            'customer login Nigeria',
            'agro dealer login',
            'farmer account access',
            'agricultural products login',
            'secure login Nigeria',
            'SuperoAgrobase login',
            'farm store account login',
            'member login agriculture'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            twitter: {
                card: 'summary',
            },
            robots: {
                index: true,
                follow: true,
                noarchive: true,
                nocache: true
            },
            other: {
                'article:section': 'Authentication',
                'article:tag': 'Login, Sign In, Account Access, Authentication'
            }
        }
    });
}

export function getForgotPasswordMetadata() {
    const title = 'Forgot Password - Reset Your Account Password';
    const description = `Reset your ${SITE_DATA.name} account password securely. Enter your email to receive password reset instructions. Quick and secure password recovery for your agricultural products account.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/auth/forgot-password',
        keywords: [
            'forgot password Nigeria',
            'reset password agriculture',
            'password recovery farm account',
            'recover account access',
            'forgotten password help',
            'reset login credentials',
            'password reset link',
            'account recovery Nigeria',
            'SuperoAgrobase password reset',
            'secure password recovery'
        ],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            twitter: {
                card: 'summary',
            },
            robots: {
                index: true,
                follow: true,
                noarchive: true,
                nocache: true
            },
            other: {
                'article:section': 'Authentication',
                'article:tag': 'Password Reset, Account Recovery, Forgot Password, Authentication'
            }
        }
    });
}

export function getResetPasswordMetadata() {
    const title = 'Reset Password - Create New Account Password';
    const description = `Create a new secure password for your ${SITE_DATA.name} account. Set a strong password to protect your agricultural products orders and personal information. Complete your password reset securely.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/auth/reset-password',
        keywords: [
            'reset password Nigeria',
            'create new password',
            'change account password',
            'update login password',
            'secure password setup',
            'password reset completion',
            'new password agricultural account',
            'update credentials Nigeria',
            'password change form',
            'secure account access'
        ],
        index: false, // Should not be indexed as it requires token
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            robots: {
                index: false,
                follow: true,
                noarchive: true,
                nocache: true
            },
            other: {
                'article:section': 'Authentication',
                'article:tag': 'Password Reset, New Password, Authentication, Security'
            }
        }
    });
}

// Verify Email Page
export function getVerifyEmailMetadata() {
    const title = 'Verify Email Address - Confirm Your Account';
    const description = `Verify your email address to activate your ${SITE_DATA.name} account. Complete email verification to start shopping for quality agricultural products and enjoy full account benefits.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/auth/verify-email',
        keywords: [
            'verify email Nigeria',
            'email confirmation agriculture',
            'activate account farm supplies',
            'email verification link',
            'confirm email address',
            'account activation Nigeria',
            'verify registration email',
            'email authentication',
            'activate farming account',
            'confirm account creation'
        ],
        index: false, // Should not be indexed as it requires token
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            robots: {
                index: false,
                follow: true,
                noarchive: true,
                nocache: true
            },
            other: {
                'article:section': 'Authentication',
                'article:tag': 'Email Verification, Account Activation, Authentication, Confirmation'
            }
        }
    });
}