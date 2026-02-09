'use client';

import React, { memo } from 'react';
import { ChevronRight, Home, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// ============================================
// Breadcrumb Components
// ============================================
const BreadcrumbHome = memo(() => (
    <li
        className="flex items-center"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
    >
        <Link
            href="/"
            className="flex items-center gap-1.5 py-0.5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 font-medium group"
            itemProp="item"
        >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span itemProp="name" className="hidden sm:inline">Home</span>
        </Link>
        <meta itemProp="position" content="1" />
    </li>
));
BreadcrumbHome.displayName = 'BreadcrumbHome';

const BreadcrumbItem = memo(({ item, index, isLast }) => {
    const position = index + 2;

    return (
        <>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
            <li
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
            >
                {!isLast ? (
                    <>
                        <Link
                            href={item?.href || item?.url}
                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 font-medium truncate max-w-[150px] sm:max-w-none px-2 py-0.5 rounded-md -mx-2"
                            itemProp="item"
                        >
                            <span itemProp="name">{item?.label || item?.name}</span>
                        </Link>
                        <meta itemProp="position" content={position.toString()} />
                    </>
                ) : (
                    <>
                        <span
                            className="py-0.5 text-gray-700 dark:text-gray-300 font-semibold truncate max-w-[150px] sm:max-w-none"
                            itemProp="name"
                            aria-current="page"
                        >
                            {item?.label || item?.name}
                        </span>
                        <meta itemProp="position" content={position.toString()} />
                    </>
                )}
            </li>
        </>
    );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';

const Breadcrumb = memo(({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="relative z-10">
            <ol
                className="flex flex-wrap items-center text-xs sm:text-sm gap-1.5"
                itemScope
                itemType="https://schema.org/BreadcrumbList"
            >
                <BreadcrumbHome />
                {items.map((item, index) => (
                    <BreadcrumbItem
                        key={`${item?.href || item?.url}-${index}`}
                        item={item}
                        index={index}
                        isLast={index === items.length - 1}
                    />
                ))}
            </ol>
        </nav>
    );
});
Breadcrumb.displayName = 'Breadcrumb';

// ============================================
// Badge Component
// ============================================
const HeaderBadge = memo(({ badge }) => {
    if (!badge) return null;

    return (
        <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="text-green-700 dark:text-green-300 font-semibold text-xs sm:text-sm">
                {badge}
            </span>
        </div>
    );
});
HeaderBadge.displayName = 'HeaderBadge';

// ============================================
// Back Button Component
// ============================================
const BackButton = memo(({ isBackButton, backLabel }) => {
    const router = useRouter();

    if (!isBackButton) return null;

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 group"
            aria-label={backLabel}
        >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">{backLabel}</span>
        </button>
    );
});
BackButton.displayName = 'BackButton';

// ============================================
// Primary Action Link Component
// ============================================
const PrimaryActionLink = memo(({ href, label }) => {
    if (!href || !label) return null;

    const linkClasses = "inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm group";

    return (
        <Link
            href={href}
            className={linkClasses}
        >
            <span>{label}</span>
        </Link>
    );
});
PrimaryActionLink.displayName = 'PrimaryActionLink';

// ============================================
// Main PageHeader Component
// ============================================
/**
 * PageHeader - Reusable header component for internal pages
 * 
 * @param {string} title - Page title (required)
 * @param {string} subtitle - Optional subtitle
 * @param {string} description - Optional description text
 * @param {string} badge - Optional badge text with sparkle icon
 * @param {Array} breadcrumbs - Breadcrumb items [{label, href}]
 * @param {boolean} isBackButton - Show back button (optional)
 * @param {string} backLabel - Custom back button label (default: "Back")
 * @param {string} actionUrl - URL for primary action link (optional)
 * @param {string} actionLabel - Label for primary action link (optional)
 * @param {boolean} showPattern - Show decorative background pattern (default: true)
 */
const PageHeader = memo(({
    title,
    subtitle,
    description,
    badge,
    breadcrumbs = [],
    isBackButton,
    backLabel = 'Back',
    actionUrl,
    actionLabel,
    isHome = false
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className={`${isHome ? 'container' : 'max-w-7xl'} relative mx-auto px-3 sm:px-5 lg:px-7 py-6`}>
                {/* Back Button */}
                {isBackButton && (
                    <div className="mb-4">
                        <BackButton isBackButton={isBackButton} backLabel={backLabel} />
                    </div>
                )}

                {/* Main Content */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Badge */}
                        {badge && <HeaderBadge badge={badge} />}

                        {/* Title & Subtitle */}
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                                {title}
                            </h1>
                            {subtitle && (
                                <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                                    {subtitle}
                                </h2>
                            )}
                        </div>

                        {/* Description */}
                        {description && (
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                                {description}
                            </p>
                        )}

                        {/* Breadcrumbs */}
                        {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
                    </div>

                    {/* Right Side - Primary Action Link */}
                    {actionUrl && actionLabel && (
                        <div className="flex-shrink-0 self-start sm:self-center">
                            <PrimaryActionLink
                                href={actionUrl}
                                label={actionLabel}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;