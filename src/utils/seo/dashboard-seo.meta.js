// utils/seo/dashboard-seo.meta.js
// Dashboard SEO Metadata Functions for SuperoAgroBase

import { generateMetadata } from "../config/seo.config";

/**
 * Base function for all dashboard metadata
 * Uses your existing generateMetadata() from seo.config.js
 */
function createDashboardMeta(title, description, options = {}) {
    const { path, keywords = [] } = options;

    return generateMetadata({
        pageType: 'website',
        title: `Dashboard: ${title}`,
        description,
        path: path || '/dashboard',
        keywords: [
            'dashboard',
            'admin panel',
            'management system',
            'SuperoAgroBase dashboard',
            ...keywords
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
                'referrer': 'no-referrer'
            }
        }
    });
}

// ========================================
// DASHBOARD PAGE METADATA FUNCTIONS
// ========================================

/**
 * Dashboard Home - Overview page
 */
export function getDashboardHomeMetadata() {
    return createDashboardMeta(
        'Overview',
        'Comprehensive dashboard overview with analytics, recent activities, quick stats, and system insights for managing your SuperoAgroBase platform.',
        {
            path: '/dashboard',
            keywords: ['dashboard home', 'overview', 'analytics', 'statistics']
        }
    );
}

/**
 * Users Management - Manage all platform users
 */
export function getDashboardUsersMetadata() {
    return createDashboardMeta(
        'Users Management',
        'Manage all platform users including customers, vendors, and administrators. View user details, monitor activity, manage permissions, and handle user accounts.',
        {
            path: '/dashboard/users',
            keywords: ['users management', 'user accounts', 'customer management', 'user administration']
        }
    );
}

/**
 * Vendors Management - Manage vendor accounts
 */
export function getDashboardVendorsMetadata() {
    return createDashboardMeta(
        'Vendors Management',
        'Manage vendor accounts, monitor vendor performance, track sales metrics, approve vendor applications, and oversee vendor product listings.',
        {
            path: '/dashboard/vendors',
            keywords: ['vendors management', 'vendor accounts', 'vendor performance', 'seller management']
        }
    );
}

/**
 * Vendor Requests - Review vendor applications
 */
export function getDashboardVendorRequestsMetadata() {
    return createDashboardMeta(
        'Vendor Requests',
        'Review and process vendor registration requests. Verify business information, validate documents, approve or reject applications, and manage vendor onboarding.',
        {
            path: '/dashboard/vendor-requests',
            keywords: ['vendor requests', 'vendor applications', 'vendor approval', 'vendor onboarding']
        }
    );
}

/**
 * Vendor Request Details - Review specific vendor request
 */
export function getDashboardVendorRequestDetailsMetadata() {
    return createDashboardMeta(
        'Vendor Request Details',
        'Review detailed vendor request information, verify business documents, validate contact information, and approve or reject vendor application.',
        {
            path: '/dashboard/vendor-requests/details',
            keywords: ['vendor request details', 'vendor verification', 'application review', 'business validation']
        }
    );
}

/**
 * Orders Management - Manage all customer orders
 */
export function getDashboardOrdersMetadata() {
    return createDashboardMeta(
        'Orders Management',
        'View and manage all customer orders. Track order status, process shipments, handle refunds, monitor order analytics, and resolve order issues.',
        {
            path: '/dashboard/orders',
            keywords: ['orders management', 'order tracking', 'order processing', 'shipment management']
        }
    );
}

/**
 * Order Details - View specific order information
 */
export function getDashboardOrderDetailsMetadata() {
    return createDashboardMeta(
        'Order Details',
        'View complete order information including customer details, order items, payment status, shipping information, and order timeline.',
        {
            path: '/dashboard/orders/details',
            keywords: ['order details', 'order information', 'order management', 'order tracking']
        }
    );
}

/**
 * Products Management - Manage product catalog
 */
export function getDashboardProductsMetadata() {
    return createDashboardMeta(
        'Products Management',
        'Manage agricultural product catalog. Add new products, edit listings, update inventory, set pricing, monitor product performance, and approve vendor products.',
        {
            path: '/dashboard/products',
            keywords: ['products management', 'inventory management', 'product catalog', 'agricultural products']
        }
    );
}

/**
 * Product Details - Edit specific product
 */
export function getDashboardProductDetailsMetadata() {
    return createDashboardMeta(
        'Product Details',
        'View and edit product information including pricing, inventory levels, descriptions, images, categories, and product specifications.',
        {
            path: '/dashboard/products/details',
            keywords: ['product details', 'product editing', 'product management', 'inventory']
        }
    );
}

/**
 * Categories Management - Manage product categories
 */
export function getDashboardCategoriesMetadata() {
    return createDashboardMeta(
        'Categories Management',
        'Manage product categories for agricultural supplies. Create new categories, edit existing ones, organize category hierarchy, and optimize category structure.',
        {
            path: '/dashboard/categories',
            keywords: ['categories management', 'product categories', 'category organization', 'taxonomy management']
        }
    );
}

/**
 * Subcategories Management - Manage product subcategories
 */
export function getDashboardSubcategoriesMetadata() {
    return createDashboardMeta(
        'Subcategories Management',
        'Manage product subcategories and organize product taxonomy. Create, edit, and arrange subcategories under parent categories for better product organization.',
        {
            path: '/dashboard/subcategories',
            keywords: ['subcategories management', 'product subcategories', 'taxonomy management', 'category hierarchy']
        }
    );
}

/**
 * Blogs Management - Manage blog content
 */
export function getDashboardBlogsMetadata() {
    return createDashboardMeta(
        'Blogs Management',
        'Manage agricultural blog content. Create new blog posts, edit articles, publish content, manage categories, and monitor blog performance and engagement.',
        {
            path: '/dashboard/blogs',
            keywords: ['blog management', 'content management', 'blog posts', 'article management']
        }
    );
}

/**
 * Blog Details - Create or edit blog post
 */
export function getDashboardBlogDetailsMetadata() {
    return createDashboardMeta(
        'Blog Post Details',
        'Create or edit blog post content. Manage post title, content, featured images, categories, tags, SEO settings, and publishing status.',
        {
            path: '/dashboard/blogs/details',
            keywords: ['blog post editing', 'content editing', 'blog management', 'article creation']
        }
    );
}

/**
 * Wishlists Management - Monitor user wishlists
 */
export function getDashboardWishlistsMetadata() {
    return createDashboardMeta(
        'Wishlists Management',
        'Monitor user wishlists across the platform. View popular wishlist items, track wishlist trends, and analyze customer preferences and interests.',
        {
            path: '/dashboard/wishlists',
            keywords: ['wishlists management', 'user wishlists', 'customer preferences', 'wishlist analytics']
        }
    );
}

/**
 * Messages Center - Manage platform communications
 */
export function getDashboardMessagesMetadata() {
    return createDashboardMeta(
        'Messages Center',
        'Manage platform communications. View and respond to customer inquiries, vendor messages, support tickets, and internal communications.',
        {
            path: '/dashboard/messages',
            keywords: ['messages management', 'customer support', 'communications', 'support tickets']
        }
    );
}

/**
 * Notifications Center - Manage system notifications
 */
export function getDashboardNotificationsMetadata() {
    return createDashboardMeta(
        'Notifications Center',
        'Manage system notifications, user alerts, and platform announcements. Create, schedule, and send notifications to users, vendors, and administrators.',
        {
            path: '/dashboard/notifications',
            keywords: ['notifications management', 'alerts', 'announcements', 'system notifications']
        }
    );
}

/**
 * System Settings - Configure platform settings
 */
export function getDashboardSettingsMetadata() {
    return createDashboardMeta(
        'System Settings',
        'Configure platform settings including payment gateways, shipping options, email configurations, SEO settings, security preferences, and general system configurations.',
        {
            path: '/dashboard/settings',
            keywords: ['system settings', 'platform configuration', 'admin settings', 'system preferences']
        }
    );
}