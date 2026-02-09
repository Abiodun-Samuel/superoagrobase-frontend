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


export function getBecomeVendorMetadata() {
    const title = 'Become a Vendor - List Your Products & Grow Your Business';
    const description = `Join ${SITE_DATA.name}'s vendor marketplace and connect with thousands of buyers across Nigeria. Set your own prices, receive instant order notifications, and get paid weekly. Free registration for farmers, markets, distributors, and agricultural suppliers. Start selling agricultural products online today with zero upfront costs.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/become-a-vendor',
        keywords: [
            'become vendor Nigeria',
            'sell agricultural products online',
            'vendor registration Nigeria',
            'agricultural marketplace vendor',
            'list products online Nigeria',
            'agro dealer registration',
            'farmer marketplace Nigeria',
            'agricultural supplier platform',
            'sell farm products online',
            'vendor partnership Nigeria',
            'agricultural ecommerce vendor',
            'market vendor registration',
            'agricultural distributor platform',
            'online marketplace vendor Nigeria',
            'agribusiness vendor opportunity',
            'sell crops online Nigeria',
            'agricultural products supplier registration',
            'farm produce marketplace',
            'vendor application Nigeria',
            'agricultural vendor program'
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
                'article:section': 'Vendor',
                'article:tag': 'Vendor Registration, Marketplace, Partnership, Business Opportunity',
                'article:modified_time': new Date().toISOString(),
                'program:type': 'Vendor Marketplace',
                'program:cost': 'Free Registration',
                'program:benefits': 'Commission-based, Weekly Payments, Instant Notifications',
                'program:support': '24/7 Support Available'
            }
        }
    });
}

export function getBlogMetadata(params = {}) {
    const {
        category,
        search,
        page = 1,
        totalPosts = 6,
        totalPages = 1,
        featuredCount = 2
    } = params;

    // Build dynamic title based on filters
    const titleParts = [];

    if (search) {
        titleParts.push(`Search: "${search}"`);
    } else if (category && category !== 'All Stories') {
        titleParts.push(category);
    } else {
        titleParts.push('Agricultural Stories & Insights');
    }

    if (page > 1) titleParts.push(`Page ${page}`);
    titleParts.push('Blog');

    const title = titleParts.join(' - ');

    // Build dynamic description with compelling copy
    let description = '';

    if (search) {
        description = `Explore agricultural stories and insights about "${search}". ${page > 1 ? `Page ${page} of ${totalPages}. ` : ''}Read in-depth articles on regenerative farming, AgTech innovation, climate action, and market intelligence from Nigerian agricultural experts.`;
    } else if (category && category !== 'All Stories') {
        const categoryDescriptions = {
            'Regenerative Farming': 'Discover how regenerative agriculture is healing soil, sequestering carbon, and building resilient food systems. Stories from farmers reversing climate change one field at a time.',
            'AgTech Innovation': 'Explore cutting-edge agricultural technology transforming Nigerian farming. From AI-powered vertical farms to IoT sensors saving water, see innovation in action.',
            'Climate Action': 'Read about climate-resilient crops, adaptation strategies, and how agriculture is fighting climate change. Science-based solutions for a sustainable future.',
            'Community': 'Inspiring stories of farming communities, food forests, and collaborative agriculture. See how people are building sustainable food systems together.',
            'Market Intelligence': 'Expert analysis on agricultural markets, pricing trends, supply chain innovations, and economic opportunities in Nigerian agriculture.'
        };

        description = categoryDescriptions[category] || `Discover compelling ${category.toLowerCase()} stories and insights. ${page > 1 ? `Page ${page} of ${totalPages}. ` : ''}Expert articles on sustainable agriculture, innovation, and the future of farming in Nigeria and beyond.`;
    } else {
        description = `Explore ${totalPosts}+ in-depth stories on regenerative agriculture, AgTech innovation, climate action, and sustainable farming. ${page > 1 ? `Page ${page} of ${totalPages}. ` : ''}Expert insights from agricultural scientists, engineers, and farmers reshaping Nigeria's agricultural landscape. The future of food starts here.`;
    }

    // Comprehensive keywords for agricultural content
    const keywords = [
        'agricultural blog Nigeria',
        'farming stories Nigeria',
        'AgTech innovation articles',
        'regenerative agriculture Nigeria',
        'sustainable farming blog',
        'climate action agriculture',
        'agricultural innovation Nigeria',
        'farming insights Nigeria',
        'agricultural research stories',
        'farm technology blog',
        'agricultural science Nigeria',
        'farming best practices',
        'agricultural trends Nigeria',
        'smart farming Nigeria',
        'agricultural market intelligence',
        'vertical farming Nigeria',
        'precision agriculture blog',
        'soil health articles',
        'carbon sequestration farming',
        'climate-resilient crops',
        'agricultural consultancy blog',
        'farm management insights',
        'agricultural economics Nigeria',
        'sustainable agriculture stories',
        'food security Nigeria',
        ...(category && category !== 'All Stories' ? [
            `${category} Nigeria`,
            `${category} articles`,
            `${category} blog`,
            `${category} stories`
        ] : []),
        ...(search ? [
            `${search} agriculture`,
            `${search} farming Nigeria`,
            `${search} agricultural blog`
        ] : [])
    ].filter(Boolean);

    // Build canonical URL with proper query parameters
    const queryParams = [];
    if (category && category !== 'All Stories') queryParams.push(`category=${encodeURIComponent(category)}`);
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (page > 1) queryParams.push(`page=${page}`);

    const path = `/blog${queryParams.length ? `?${queryParams.join('&')}` : ''}`;

    // Pagination for SEO
    const pagination = {};

    if (page > 1) {
        const prevParams = queryParams.filter(p => !p.startsWith('page='));
        if (page > 2) prevParams.push(`page=${page - 1}`);
        pagination.prev = `/blog${prevParams.length ? `?${prevParams.join('&')}` : ''}`;
    }

    if (page < totalPages) {
        const nextParams = queryParams.filter(p => !p.startsWith('page='));
        nextParams.push(`page=${page + 1}`);
        pagination.next = `/blog?${nextParams.join('&')}`;
    }

    return generateMetadata({
        pageType: 'website',
        title,
        description: description.substring(0, 160),
        path,
        keywords,
        pagination,
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'website',
                siteName: SITE_DATA.name,
            },
            twitter: {
                card: 'summary_large_image',
            },
            other: {
                'article:section': 'Blog',
                'article:tag': 'Agriculture, Innovation, Sustainability, Farming, Technology, Nigeria',
                'article:publisher': SITE_DATA.domain,
                'blog:category': category || 'All Stories',
                'blog:post_count': totalPosts,
                'blog:featured_count': featuredCount,
                'blog:page': page,
                'blog:total_pages': totalPages,
                'content:type': 'agricultural insights and stories',
                'audience:type': 'farmers, agricultural professionals, agribusiness'
            }
        }
    });
}

export function getBlogPostMetadata(post) {
    if (!post) {
        return generateMetadata({
            title: 'Post Not Found',
            description: 'The requested blog post could not be found.',
            index: false
        });
    }

    const {
        title,
        excerpt,
        category,
        author,
        authorRole,
        date,
        readTime,
        views,
        image,
        featured
    } = post;

    // SEO-optimized title
    const seoTitle = `${title} | ${category} - ${SITE_DATA.name} Blog`;

    // Rich description
    const seoDescription = `${excerpt} By ${author}, ${authorRole}. ${readTime} read. ${views} views. Expert insights on ${category.toLowerCase()} in Nigerian agriculture.`;

    // Keywords
    const keywords = [
        title,
        category,
        `${category} Nigeria`,
        'agricultural blog',
        'farming insights',
        author,
        authorRole.toLowerCase(),
        'agricultural innovation',
        'sustainable farming',
        'AgTech Nigeria',
        ...(featured ? ['featured agricultural story', 'trending farming news'] : [])
    ];

    return generateMetadata({
        pageType: 'article',
        title: seoTitle,
        description: seoDescription.substring(0, 160),
        path: `/blog/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        keywords,
        images: [{
            url: image,
            width: 1600,
            height: 1200,
            alt: title
        }],
        index: true,
        follow: true,
        additionalMetadata: {
            openGraph: {
                type: 'article',
                publishedTime: new Date(date).toISOString(),
                authors: [author],
                section: category,
            },
            twitter: {
                card: 'summary_large_image',
            },
            other: {
                'article:published_time': new Date(date).toISOString(),
                'article:author': author,
                'article:section': category,
                'article:tag': category,
                'article:opinion': 'false',
                'og:type': 'article',
                'profile:first_name': author.split(' ')[0],
                'profile:last_name': author.split(' ').slice(1).join(' '),
                'twitter:label1': 'Written by',
                'twitter:data1': `${author}, ${authorRole}`,
                'twitter:label2': 'Reading time',
                'twitter:data2': readTime
            }
        }
    });
}

// Add these functions to your seo.meta.js file

export function getCheckoutMetadata() {
    const title = 'Checkout - Secure Payment & Delivery';
    const description = `Complete your agricultural products purchase securely. Multiple payment options including cash on delivery, bank transfer, and card payment. Fast delivery across all Nigerian states with order tracking.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/checkout',
        keywords: [
            'checkout agricultural products',
            'secure payment Nigeria',
            'buy farm supplies',
            'agricultural products payment',
            'cash on delivery Nigeria',
            'agro products checkout',
            'farm equipment purchase',
            'secure checkout Nigeria',
            'agricultural payment options',
            'farming supplies delivery'
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
            },
            other: {
                'referrer': 'origin-when-cross-origin'
            }
        }
    });
}

// Add these functions to your seo.meta.js file

export function getPaymentVerifyMetadata(params = {}) {
    const { reference } = params;

    const title = 'Payment Verification - Processing Your Order';
    const description = `Verifying your payment for agricultural products. ${reference ? `Reference: ${reference}` : 'Your order is being processed'}. Secure transaction confirmation and order tracking.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/payment/verify',
        keywords: [
            'payment verification Nigeria',
            'order confirmation',
            'payment processing',
            'transaction verification',
            'agricultural payment confirm',
            'secure payment verification',
            'order tracking Nigeria',
            'payment success',
            'transaction status',
            'order confirmation Nigeria'
        ],
        index: false,
        follow: false,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            robots: {
                index: false,
                follow: false,
                nocache: true,
                noarchive: true,
                nosnippet: true
            },
            other: {
                'referrer': 'no-referrer'
            }
        }
    });
}

export function getServicesMetadata() {
    const title = 'Our Services - Comprehensive Agricultural Solutions';
    const description = `Explore ${SITE_DATA.name}'s comprehensive agricultural services: Agro-Input Products Authentication & Research, AgriCourt Ventures quality products supply, and HarvestYield Farm premium vegetable production. Professional farm management, agricultural consultancy, soil analysis, and laboratory services. Serving 10,000+ farmers nationwide with research-backed solutions and expert guidance.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/services',
        keywords: [
            'agricultural services Nigeria',
            'farm management services',
            'agro-input authentication',
            'agricultural consultancy Nigeria',
            'soil analysis services',
            'farm laboratory services',
            'vegetable production Nigeria',
            'agricultural research Nigeria',
            'quality agricultural products',
            'farm supplies Nigeria',
            'agricultural testing services',
            'crop consultancy Nigeria',
            'fertilizer analysis',
            'SON approved products',
            'NAFDAC certified inputs',
            'greenhouse systems Nigeria',
            'irrigation systems Nigeria',
            'farm machinery Nigeria',
            'agricultural innovation Nigeria',
            'sustainable farming services',
            'commercial farming Nigeria',
            'agribusiness solutions',
            'farm productivity services',
            'agricultural technology Nigeria'
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
                'article:section': 'Services',
                'article:tag': 'Agricultural Services, Farm Management, Consultancy, Research, Quality Assurance',
                'article:modified_time': new Date().toISOString(),
                'service:count': '3',
                'service:area': 'Nigeria',
                'service:network': '10,000+ farmers'
            }
        }
    });
}

export function getNotificationsMetadata() {
    const title = 'Notifications - Stay Connected & Informed';
    const description = 'View all your notifications including order updates, delivery status, payment confirmations, new blog posts, agricultural news, system updates, promotions, seasonal offers, and important account alerts. Stay informed about everything happening at SuperoAgrobase.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/notifications',
        keywords: [
            'notifications center',
            'order updates',
            'delivery notifications',
            'agricultural news alerts',
            'blog post notifications',
            'system updates',
            'promotional alerts',
            'account notifications',
            'farming news Nigeria',
            'agricultural updates',
            'product announcements',
            'seasonal offers',
            'farming tips alerts',
            'agribusiness news',
            'SuperoAgrobase updates',
            'order tracking updates',
            'payment confirmations',
            'agricultural innovations news'
        ],
        index: false, // User-specific page, should not be indexed
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
                'referrer': 'origin-when-cross-origin'
            }
        }
    });
}

export function getUserOrdersMetadata() {
    const title = 'My Orders - Order History & Tracking';
    const description = 'View and manage your agricultural products orders. Track deliveries, check order status, view order details, download invoices, initiate returns, and reorder favorite products. Complete order management in one place.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/account/orders',
        keywords: [
            'my orders',
            'order history',
            'track order Nigeria',
            'order status',
            'delivery tracking',
            'order management',
            'purchase history',
            'agricultural products orders',
            'order tracking SuperoAgrobase',
            'invoice download',
            'order details',
            'reorder products',
            'order cancellation',
            'return request',
            'order timeline'
        ],
        index: false, // User-specific page, should not be indexed
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
                'referrer': 'origin-when-cross-origin'
            }
        }
    });
}

export function getOrderDetailsMetadata(params = {}) {
    const { reference } = params;

    const title = reference
        ? `Order ${reference} - Details & Tracking`
        : 'Order Details - Track Your Purchase';

    const description = reference
        ? `View complete details for order ${reference}. Track delivery status, view order items, download invoice, check payment status, and manage your agricultural products purchase.`
        : 'View your order details including delivery tracking, order items, payment status, and invoice. Manage your agricultural products purchase with real-time updates.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: reference ? `/account/orders/${reference}` : '/account/orders/[reference]',
        keywords: [
            'order details',
            'order tracking',
            'delivery status Nigeria',
            'order information',
            'invoice download',
            'purchase details',
            'order items',
            'payment status',
            'shipping tracking',
            'order timeline',
            'delivery tracking Nigeria',
            'agricultural products order',
            'order management',
            'track delivery',
            'order confirmation',
            ...(reference ? [`order ${reference}`, reference] : [])
        ],
        index: false, // User-specific page, should not be indexed
        follow: false,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            robots: {
                index: false,
                follow: false,
                noarchive: true,
                nocache: true,
                nosnippet: true
            },
            other: {
                'referrer': 'no-referrer'
            }
        }
    });
}

export function getProductReviewsMetadata() {
    const title = 'My Product Reviews - Share Your Experience';
    const description = 'View and manage your product reviews. Share your experience with agricultural products, rate purchases, write detailed reviews, upload photos, edit existing reviews, and help other Nigerian farmers make informed decisions.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/account/reviews',
        keywords: [
            'my reviews',
            'product reviews',
            'customer reviews Nigeria',
            'rate products',
            'write review',
            'agricultural product reviews',
            'farming product ratings',
            'review history',
            'product feedback',
            'customer testimonials',
            'product ratings Nigeria',
            'farm supplies reviews',
            'review management',
            'edit reviews',
            'product experience',
            'farming reviews Nigeria'
        ],
        index: false, // User-specific page, should not be indexed
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
                'referrer': 'origin-when-cross-origin'
            }
        }
    });
}

export function getUserProfileMetadata() {
    const title = 'My Profile - Account Settings & Personal Information';
    const description = 'Manage your SuperoAgrobase account. Update personal information, change password, manage delivery addresses, set communication preferences, view account activity, and configure your profile settings for the best shopping experience.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/account/profile',
        keywords: [
            'my profile',
            'account settings',
            'user profile',
            'personal information',
            'update profile Nigeria',
            'change password',
            'manage addresses',
            'account preferences',
            'profile management',
            'user settings',
            'account security',
            'communication preferences',
            'delivery addresses',
            'profile picture',
            'account information',
            'edit profile'
        ],
        index: false, // User-specific page, should not be indexed
        follow: false,
        additionalMetadata: {
            openGraph: {
                type: 'profile',
            },
            robots: {
                index: false,
                follow: false,
                noarchive: true,
                nocache: true,
                nosnippet: true
            },
            other: {
                'referrer': 'no-referrer'
            }
        }
    });
}

export function getSupportMetadata() {
    const title = 'Customer Support - We\'re Here to Help';
    const description = `Get expert support for your agricultural products needs. Contact ${SITE_DATA.name} support team via phone ${SITE_DATA.phone}, email ${SITE_DATA.email}, or live chat. Help with orders, deliveries, returns, product information, technical support, and account assistance. Available Monday-Saturday with 24-hour response guarantee.`;

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/support',
        keywords: [
            'customer support Nigeria',
            'agricultural products help',
            'contact support',
            'order help Nigeria',
            'product support',
            'delivery support',
            'technical assistance',
            'customer service Nigeria',
            'help center',
            'support ticket',
            'live chat support',
            'email support',
            'phone support Nigeria',
            'return assistance',
            'refund help',
            'account support',
            'product information help',
            'farming support Nigeria',
            'agricultural consultancy support',
            '24/7 customer service',
            'support center Nigeria'
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
                'article:section': 'Customer Support',
                'article:tag': 'Support, Customer Service, Help, Assistance',
                'support:channels': 'Phone, Email, Live Chat, WhatsApp',
                'support:hours': `Mon-Fri: ${SITE_DATA.business.openingHours.weekdays.open}-${SITE_DATA.business.openingHours.weekdays.close}, Sat: ${SITE_DATA.business.openingHours.saturday.open}-${SITE_DATA.business.openingHours.saturday.close}`,
                'support:response_time': '24 hours'
            }
        }
    });
}

export function getUserWishlistMetadata() {
    const title = 'My Wishlist - Saved Agricultural Products';
    const description = 'View and manage your saved agricultural products. Track prices, get stock alerts, add items to cart, share your wishlist, and organize your favorite farming supplies for easy purchase later.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/account/wishlist',
        keywords: [
            'wishlist',
            'saved products',
            'favorite products Nigeria',
            'agricultural products wishlist',
            'save for later',
            'product favorites',
            'farming supplies wishlist',
            'saved items',
            'wishlist management',
            'price tracking',
            'stock alerts',
            'saved agricultural products',
            'favorite farming items',
            'product bookmarks',
            'shopping wishlist Nigeria'
        ],
        index: false, // User-specific page, should not be indexed
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
                'referrer': 'origin-when-cross-origin'
            }
        }
    });
}

export function getVendorProductsMetadata() {
    const title = 'My Products - Manage Your Inventory';
    const description = 'Manage your agricultural product inventory. Add new products, edit listings, update prices and stock levels, upload product images, set availability, monitor product performance, and optimize your catalog for maximum sales.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/account/products',
        keywords: [
            'vendor products',
            'manage inventory',
            'product listings vendor',
            'add products Nigeria',
            'edit product listings',
            'update prices',
            'stock management vendor',
            'product catalog',
            'inventory management',
            'vendor product management',
            'agricultural products vendor',
            'product performance',
            'product analytics',
            'listing optimization',
            'vendor inventory Nigeria',
            'manage agricultural products',
            'product availability'
        ],
        index: false, // Vendor-specific page, should not be indexed
        follow: false,
        additionalMetadata: {
            openGraph: {
                type: 'website',
            },
            robots: {
                index: false,
                follow: false,
                noarchive: true,
                nocache: true,
                nosnippet: true
            },
            other: {
                'referrer': 'no-referrer'
            }
        }
    });
}

// Add to seo.meta.js

export function getVendorAddProductMetadata() {
    const title = 'Add Products to Catalog - Select & Configure Products';
    const description = 'Browse our comprehensive product catalog and add items to your vendor inventory. Set competitive prices, manage stock levels, and control product availability. Update product details in real-time to optimize your sales.';

    return generateMetadata({
        pageType: 'website',
        title,
        description,
        path: '/account/products/add',
        keywords: [
            'add products vendor catalog',
            'vendor product selection',
            'configure product pricing',
            'manage product stock',
            'set product availability',
            'vendor inventory management',
            'product catalog management',
            'vendor dashboard products',
            'update product prices',
            'agricultural products vendor',
            'vendor product configuration',
            'manage product inventory',
            'vendor stock control',
            'product availability settings'
        ],
        index: false,
        follow: false,
        additionalMetadata: {
            robots: {
                index: false,
                follow: false,
                noarchive: true,
                nocache: true,
                nosnippet: true
            },
            other: {
                'application:section': 'Vendor Dashboard',
                'application:feature': 'Product Catalog Management',
                'application:action': 'Add Products',
                'application:access': 'Vendor Only',
                'page:type': 'Application Interface'
            }
        }
    });
}