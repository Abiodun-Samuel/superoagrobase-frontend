'use client'

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award, UserCheck } from 'lucide-react';
import TextBadge from '../ui/TextBadge';
import { useReviews } from '@/queries/reviews.query';

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const AUTOPLAY_INTERVAL = 5000;
const TRANSITION_DURATION = 700;

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Section Header Component
 */
const SectionHeader = () => (
    <header className="text-center">
        <TextBadge
            endIcon={<UserCheck aria-hidden="true" />}
            size='lg'
            className="mb-4"
            variant='solid'
            color='green'
            startIcon={<Award aria-hidden="true" />}
        >
            <span>Customer Success Stories</span>
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Customers Say
            </span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of farmers, retailers, and agricultural businesses across Nigeria
        </p>
    </header>
);

/**
 * Testimonial Card Component
 */
const TestimonialCard = ({ testimonial, position, onClick }) => {
    const isCenter = position === 'center';
    const isClickable = !isCenter;

    return (
        <div
            className={`absolute transition-all duration-${TRANSITION_DURATION} ease-in-out ${position === 'center'
                ? 'w-full lg:w-[600px] scale-100 opacity-100 z-30'
                : position === 'left'
                    ? 'w-full lg:w-[500px] -translate-x-[70%] lg:-translate-x-[70%] scale-90 opacity-40 z-10'
                    : position === 'right'
                        ? 'w-full lg:w-[500px] translate-x-[70%] lg:translate-x-[70%] scale-90 opacity-40 z-10'
                        : 'opacity-0 scale-75 pointer-events-none'
                }`}
            onClick={onClick}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : -1}
            onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            aria-label={isClickable ? `View testimonial from ${testimonial.user.full_name}` : undefined}
        >
            <div className="bg-white mx-5 rounded-xl shadow-2xl p-8 lg:p-10 relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10" aria-hidden="true">
                    <Quote className="w-24 h-24 text-green-600" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-green-100 shadow-lg">
                                <img
                                    src={testimonial.user.avatar}
                                    alt={`${testimonial.user.full_name}'s profile picture`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            {/* Verified Badge */}
                            <div
                                className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center border-2 border-white"
                                aria-label="Verified customer"
                            >
                                <Award className="w-4 h-4 text-white" aria-hidden="true" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h3 className="text-xl font-bold text-gray-900">
                                {testimonial.user.full_name}
                            </h3>
                            <p className="text-green-600 font-semibold">
                                {testimonial.user.city}, {testimonial.user.state}
                            </p>
                            {testimonial.product && (
                                <p className="text-sm text-gray-500">
                                    Reviewed: {testimonial.product.title}
                                </p>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < testimonial.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200'
                                        }`}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                        <p className="italic">"{testimonial.comment}"</p>
                    </blockquote>

                    {/* Date & Product Info */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                            <div className="w-2 h-2 bg-green-600 rounded-full" aria-hidden="true"></div>
                            Verified Purchase
                        </div>
                        <time className="text-sm text-gray-500" dateTime={testimonial.created_at}>
                            {new Date(testimonial.created_at).toLocaleDateString('en-NG', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" aria-hidden="true"></div>
            </div>
        </div>
    );
};

/**
 * Navigation Button Component
 */
const NavButton = ({ direction, onClick, ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`absolute ${direction === 'prev' ? 'left-0 lg:left-4' : 'right-0 lg:right-4'
            } top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
    >
        {direction === 'prev' ? (
            <ChevronLeft className="w-6 h-6 text-green-600 group-hover:text-white" aria-hidden="true" />
        ) : (
            <ChevronRight className="w-6 h-6 text-green-600 group-hover:text-white" aria-hidden="true" />
        )}
    </button>
);

/**
 * Dots Indicator Component
 */
const DotsIndicator = ({ total, currentIndex, onDotClick }) => (
    <div className="flex justify-center gap-2 mt-10" role="tablist" aria-label="Testimonial navigation">
        {[...Array(total)].map((_, index) => (
            <button
                key={index}
                onClick={() => onDotClick(index)}
                role="tab"
                aria-selected={currentIndex === index}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${currentIndex === index
                    ? 'w-8 h-3 bg-green-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-green-400'
                    }`}
            >{''}</button>
        ))}
    </div>
);

/**
 * Loading Skeleton Component
 */
const TestimonialsSkeleton = () => (
    <section className="my-24 py-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="relative z-10">
            {/* Header Skeleton */}
            <header className="text-center mb-12 space-y-4">
                <div className="flex justify-center">
                    <div className="h-10 w-64 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-12 w-96 bg-gray-200 rounded-xl mx-auto animate-pulse"></div>
                <div className="h-6 w-[500px] bg-gray-200 rounded-xl mx-auto animate-pulse"></div>
            </header>

            {/* Card Skeleton */}
            <div className="relative h-[500px] lg:h-[450px] flex items-center justify-center">
                <div className="w-full lg:w-[600px]">
                    <div className="bg-white mx-5 rounded-xl shadow-2xl p-8 lg:p-10">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                            {/* Avatar Skeleton */}
                            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>

                            {/* Info Skeleton */}
                            <div className="flex-1 space-y-2">
                                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            {/* Rating Skeleton */}
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        </div>

                        {/* Comment Skeleton */}
                        <div className="space-y-3 mb-6">
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        {/* Badge Skeleton */}
                        <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Dots Skeleton */}
            <div className="flex justify-center gap-2 mt-10">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
            </div>
        </div>
    </section>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function Testimonials() {
    const { data: reviewsData, isLoading, isError } = useReviews({
        per_page: 10,
        is_published: true
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const testimonials = reviewsData?.data || [];

    // Auto-play effect
    useEffect(() => {
        if (!isAutoPlaying || testimonials.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, AUTOPLAY_INTERVAL);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    // Navigation handlers
    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
    };

    // Calculate slide position
    const getSlidePosition = (index) => {
        if (testimonials.length === 0) return 'hidden';

        const diff = index - currentIndex;
        if (diff === 0) return 'center';
        if (diff === 1 || diff === -(testimonials.length - 1)) return 'right';
        if (diff === -1 || diff === testimonials.length - 1) return 'left';
        return 'hidden';
    };

    // Loading state
    if (isLoading) {
        return <TestimonialsSkeleton />;
    }

    // Error state
    if (isError || !testimonials.length) {
        return null;
    }

    return (
        <section
            className="my-24 py-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden"
            aria-label="Customer testimonials"
        >
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <SectionHeader />

                {/* Testimonials Carousel */}
                <div className="relative" role="region" aria-roledescription="carousel" aria-label="Customer testimonials carousel">
                    <div className="relative h-[500px] lg:h-[450px] flex items-center justify-center">
                        {testimonials.map((testimonial, index) => {
                            const position = getSlidePosition(index);
                            return (
                                <TestimonialCard
                                    key={testimonial.id}
                                    testimonial={testimonial}
                                    position={position}
                                    onClick={() => position !== 'center' && goToSlide(index)}
                                />
                            );
                        })}
                    </div>

                    {/* Navigation Buttons */}
                    {testimonials.length > 1 && (
                        <>
                            <NavButton
                                direction="prev"
                                onClick={prevSlide}
                                ariaLabel="Previous testimonial"
                            />
                            <NavButton
                                direction="next"
                                onClick={nextSlide}
                                ariaLabel="Next testimonial"
                            />
                        </>
                    )}
                </div>

                {/* Dots Indicator */}
                {testimonials.length > 1 && (
                    <DotsIndicator
                        total={testimonials.length}
                        currentIndex={currentIndex}
                        onDotClick={goToSlide}
                    />
                )}

                {/* SEO-friendly content (hidden but crawlable) */}
                <div className="sr-only">
                    <h3>Customer Reviews and Testimonials</h3>
                    {testimonials.map((testimonial) => (
                        <article key={testimonial.id} itemScope itemType="https://schema.org/Review">
                            <meta itemProp="author" content={testimonial.user.full_name} />
                            <meta itemProp="datePublished" content={testimonial.created_at} />
                            <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                                <meta itemProp="ratingValue" content={testimonial.rating} />
                                <meta itemProp="bestRating" content="5" />
                            </div>
                            {testimonial.product && (
                                <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Product">
                                    <meta itemProp="name" content={testimonial.product.title} />
                                </div>
                            )}
                            <p itemProp="reviewBody">{testimonial.comment}</p>
                        </article>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border-width: 0;
                }
            `}</style>
        </section>
    );
}