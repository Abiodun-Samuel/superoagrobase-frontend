'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Sparkles, MoveLeft, MoveRight, PackageSearch } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import ProductCard from '@/components/products/ProductCard';
import TextBadge from '@/components/ui/TextBadge';
import ContentPlaceholder from '@/components/common/ContentPlaceholder';
import { useProducts } from '@/queries/products.query';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SWIPER_CONFIG = {
    spaceBetween: 20,
    slidesPerView: 1,
    centeredSlides: false,
    autoplay: {
        delay: 4500,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
    },
    pagination: {
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
    },
    breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
        1280: { slidesPerView: 3, spaceBetween: 20 },
    },
};

const SKELETON_COUNT = 4;

// ---------------------------------------------------------------------------
// Skeleton Card
// ---------------------------------------------------------------------------

const ProductCardSkeleton = () => (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
        <div className="p-3 space-y-2.5">
            <div className="h-3.5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="flex items-center justify-between pt-1">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Navigation Button
// ---------------------------------------------------------------------------

const NavigationButton = ({ direction, onClick }) => {
    const isPrev = direction === 'prev';
    const Icon = isPrev ? MoveLeft : MoveRight;

    return (
        <button
            onClick={onClick}
            className={`
                absolute ${isPrev ? 'left-0 -translate-x-5' : 'right-0 translate-x-5'}
                top-1/2 -translate-y-1/2 z-10
                bg-white dark:bg-gray-800 p-2.5 rounded-full
                shadow-lg hover:shadow-green-500/30 dark:hover:shadow-green-400/20
                transition-all duration-300 hover:scale-110
                border-2 border-gray-100 dark:border-gray-700
                group
            `}
            aria-label={`${isPrev ? 'Previous' : 'Next'} product`}
        >
            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
        </button>
    );
};

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------

const SectionHeader = ({ count }) => (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
            <TextBadge
                className="mb-3"
                color="green"
                variant="light"
                size="sm"
                startIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
                More to Explore
            </TextBadge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                You May{' '}
                <span className="text-green-600 dark:text-green-400">Also Like</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Similar products from this category
            </p>
        </div>

        {count > 0 && (
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/60 px-3 py-1.5 rounded-full self-start sm:self-auto whitespace-nowrap">
                {count} product{count !== 1 ? 's' : ''} found
            </span>
        )}
    </div>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function SimilarProducts({ subcategorySlug, categorySlug, currentProductId }) {
    const [isClient, setIsClient] = useState(false);
    const [swiperRef, setSwiperRef] = useState(null);

    useEffect(() => { setIsClient(true); }, []);

    const filters = useMemo(() => ({
        ...(categorySlug && { category: categorySlug }),
        ...(subcategorySlug && { subcategory: subcategorySlug }),
        per_page: 20,
        sort: 'newest',
    }), [subcategorySlug, categorySlug]);

    const { data, isLoading, isError } = useProducts(filters, {
        enabled: Boolean(subcategorySlug || categorySlug),
    });

    const similarProducts = useMemo(() => {
        const all = data?.data ?? data ?? [];
        if (!currentProductId) return all;
        return all.filter((p) => p.id !== currentProductId);
    }, [data, currentProductId]);

    const handlePrevSlide = useCallback(() => swiperRef?.slidePrev(), [swiperRef]);
    const handleNextSlide = useCallback(() => swiperRef?.slideNext(), [swiperRef]);

    const showNavigation = isClient && !isLoading && similarProducts.length > 0;

    if (isError) {
        return (
            <section className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                <SectionHeader count={0} />
                <ContentPlaceholder
                    icon={PackageSearch}
                    title="Unable to Load Similar Products"
                    description="We couldn't fetch related products right now. Please try refreshing the page."
                    color="red"
                    variant="light"
                />
            </section>
        );
    }

    if (!isLoading && similarProducts.length === 0) {
        return (
            <section className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                <SectionHeader count={0} />
                <ContentPlaceholder
                    icon={PackageSearch}
                    title="No Similar Products Found"
                    description="We couldn't find other products in this category right now. Check back soon!"
                    color="green"
                    variant="light"
                />
            </section>
        );
    }

    return (
        <section className="w-full bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <SectionHeader count={isLoading ? 0 : similarProducts.length} />

            <div className="relative">
                {showNavigation && (
                    <>
                        <NavigationButton direction="prev" onClick={handlePrevSlide} />
                        <NavigationButton direction="next" onClick={handleNextSlide} />
                    </>
                )}

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    onSwiper={setSwiperRef}
                    className="pb-12!"
                    {...SWIPER_CONFIG}
                >
                    {isLoading
                        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <SwiperSlide key={`skeleton-${i}`}>
                                <ProductCardSkeleton />
                            </SwiperSlide>
                        ))
                        : similarProducts.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </section>
    );
}