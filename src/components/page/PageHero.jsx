'use client'
import React from 'react';
import { ChevronRight, Home, Sparkles, Leaf } from 'lucide-react';
import Link from 'next/link';

/**
 * BackgroundPattern - Animated background decorations
 */
const BackgroundPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Decorative Elements */}
        <Leaf className="absolute top-16 left-10 w-20 h-20 text-white/10 transform rotate-45 animate-float" />
        <Sparkles className="absolute top-32 right-20 w-12 h-12 text-white/10 animate-pulse" />
        <Leaf className="absolute bottom-24 right-16 w-24 h-24 text-white/10 transform -rotate-12 animate-float animation-delay-2000" />
    </div>
);

/**
 * Breadcrumb - SEO-optimized navigation breadcrumb
 */
const Breadcrumb = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow hover:bg-white/15 transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                <ol
                    className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    itemScope
                    itemType="https://schema.org/BreadcrumbList"
                >
                    {/* Home Link */}
                    <li
                        className="flex items-center"
                        itemProp="itemListElement"
                        itemScope
                        itemType="https://schema.org/ListItem"
                    >
                        <Link
                            href="/"
                            className="flex items-center gap-1 sm:gap-1.5 text-white/90 hover:text-white transition-colors duration-200 font-semibold group"
                            itemProp="item"
                        >
                            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                            <span itemProp="name" className="hidden sm:inline">Home</span>
                        </Link>
                        <meta itemProp="position" content="1" />
                    </li>

                    {/* Dynamic Breadcrumb Items */}
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        const position = index + 2;

                        return (
                            <React.Fragment key={index}>
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60 flex-shrink-0" />
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
                                                className="text-white/90 hover:text-white transition-colors duration-200 font-semibold truncate max-w-[150px] sm:max-w-none hover:drop-shadow-lg"
                                                itemProp="item"
                                            >
                                                <span itemProp="name">{item.label}</span>
                                            </Link>
                                            <meta itemProp="position" content={position.toString()} />
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className="text-white font-bold truncate max-w-[150px] sm:max-w-none drop-shadow-md"
                                                itemProp="name"
                                                aria-current="page"
                                            >
                                                {item.label}
                                            </span>
                                            <meta itemProp="position" content={position.toString()} />
                                        </>
                                    )}
                                </li>
                            </React.Fragment>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};


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
        <section className={`relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 overflow-hidden rounded-2xl mb-8`}>


            {/* Background Pattern */}
            <BackgroundPattern />

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
                <div className="max-w-4xl">
                    {/* Badge */}
                    {badge && (
                        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-white font-semibold text-sm">{badge}</span>
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">
                            {title}
                        </h1>
                    </div>

                    {/* Description */}
                    {description && (
                        <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-light max-w-3xl">
                            {description}
                        </p>
                    )}
                </div>

                {/* Decorative Line */}
                <div className="mt-12 mb-8 h-1 w-24 bg-white/30 rounded-full" />

                {/* Breadcrumb - Positioned above wave */}
                <Breadcrumb items={breadcrumbs} />
            </div>
        </section>
    );
};

export default PageHero;