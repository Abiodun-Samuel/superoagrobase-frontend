'use client'

import { memo } from 'react';
import { ChevronRight, Home, Sparkles, Leaf } from 'lucide-react';
import Link from 'next/link';

// Constants
const SPACING = {
    container: 'p-6 sm:p-7 lg:p-8',
    badge: 'mb-4',
    title: 'mb-3',
    description: 'mb-4',
    divider: 'mb-4',
};

const ANIMATIONS = {
    blob: 'animate-blob',
    float: 'animate-float',
    pulse: 'animate-pulse',
    delay2s: 'animation-delay-2000',
    delay4s: 'animation-delay-4000',
};

/**
 * BackgroundPattern - Animated background decorations
 */
const BackgroundPattern = memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl ${ANIMATIONS.blob}`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl ${ANIMATIONS.blob} ${ANIMATIONS.delay2s}`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl ${ANIMATIONS.blob} ${ANIMATIONS.delay4s}`} />

        {/* Decorative Elements */}
        <Leaf className={`absolute top-16 left-10 w-20 h-20 text-white/10 transform rotate-45 ${ANIMATIONS.float}`} />
        <Sparkles className={`absolute top-32 right-20 w-12 h-12 text-white/10 ${ANIMATIONS.pulse}`} />
        <Leaf className={`absolute bottom-24 right-16 w-24 h-24 text-white/10 transform -rotate-12 ${ANIMATIONS.float} ${ANIMATIONS.delay2s}`} />
    </div>
));
BackgroundPattern.displayName = 'BackgroundPattern';

/**
 * BreadcrumbHome - Home breadcrumb item with proper contrast
 */
const BreadcrumbHome = memo(() => (
    <li
        className="flex items-center"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
    >
        <Link
            href="/"
            className="flex items-center py-0.5 text-gray-600 hover:text-green-600 transition-colors duration-200 font-semibold group"
            style={{ gap: '0.375rem' }}
            itemProp="item"
        >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span itemProp="name" className="hidden sm:inline">Home</span>
        </Link>
        <meta itemProp="position" content="1" />
    </li>
));
BreadcrumbHome.displayName = 'BreadcrumbHome';

/**
 * BreadcrumbItem - Individual breadcrumb item with clear visual hierarchy
 */
const BreadcrumbItem = memo(({ item, index, isLast }) => {
    const position = index + 2;

    return (
        <>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <li
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
            >
                {!isLast ? (
                    <>
                        <Link
                            href={item.href}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors duration-200 font-semibold truncate max-w-[150px] sm:max-w-none px-2 py-0.5 rounded-md -mx-2"
                            itemProp="item"
                        >
                            <span itemProp="name">{item.label}</span>
                        </Link>
                        <meta itemProp="position" content={position.toString()} />
                    </>
                ) : (
                    <>
                        <span
                            className="py-0.5 text-gray-500 font-medium truncate max-w-[150px] sm:max-w-none"
                            itemProp="name"
                            aria-current="page"
                        >
                            {item.label}
                        </span>
                        <meta itemProp="position" content={position.toString()} />
                    </>
                )}
            </li>
        </>
    );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * Breadcrumb - SEO-optimized navigation with solid white background for maximum visibility
 */
const Breadcrumb = memo(({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className="relative z-10 bg-white rounded-xl border border-gray-100 shadow"
        >
            <div className="px-4 sm:px-6 lg:px-8 py-3">
                <ol
                    className="flex flex-wrap items-center text-xs sm:text-sm"
                    style={{ gap: '0.375rem' }}
                    itemScope
                    itemType="https://schema.org/BreadcrumbList"
                >
                    <BreadcrumbHome />
                    {items.map((item, index) => (
                        <BreadcrumbItem
                            key={`${item.href}-${index}`}
                            item={item}
                            index={index}
                            isLast={index === items.length - 1}
                        />
                    ))}
                </ol>
            </div>
        </nav>
    );
});
Breadcrumb.displayName = 'Breadcrumb';

/**
 * HeroBadge - Optional badge display
 */
const HeroBadge = memo(({ badge }) => {
    if (!badge) return null;

    return (
        <div className={`inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 ${SPACING.badge}`} style={{ gap: '0.5rem' }}>
            <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white font-semibold text-sm">{badge}</span>
        </div>
    );
});
HeroBadge.displayName = 'HeroBadge';

/**
 * HeroTitle - Main title
 */
const HeroTitle = memo(({ title }) => (
    <div className={SPACING.title}>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-lg">
            {title}
        </h1>
    </div>
));
HeroTitle.displayName = 'HeroTitle';

/**
 * HeroDescription - Optional description
 */
const HeroDescription = memo(({ description }) => {
    if (!description) return null;

    return (
        <p className={`text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-light max-w-3xl ${SPACING.description}`}>
            {description}
        </p>
    );
});
HeroDescription.displayName = 'HeroDescription';

/**
 * DecorativeDivider - Visual separator
 */
const DecorativeDivider = memo(() => (
    <div className={`h-1 w-20 bg-white/30 rounded-full ${SPACING.divider}`} />
));
DecorativeDivider.displayName = 'DecorativeDivider';

/**
 * PageHero - Dynamic hero section for internal pages
 * 
 * @param {string} title - Page title (required)
 * @param {string} description - Page description
 * @param {string} badge - Optional badge text
 * @param {Array} breadcrumbs - Breadcrumb items [{label, href}]
 */
const PageHero = ({
    title,
    description,
    badge,
    breadcrumbs = []
}) => {
    return (
        <section className="relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 overflow-hidden rounded-2xl mb-10">
            <BackgroundPattern />

            <div className={`relative ${SPACING.container}`}>
                <div className="max-w-4xl">
                    <HeroBadge badge={badge} />
                    <HeroTitle title={title} />
                    <HeroDescription description={description} />
                </div>

                <DecorativeDivider />
                <Breadcrumb items={breadcrumbs} />
            </div>
        </section>
    );
};

export default memo(PageHero);