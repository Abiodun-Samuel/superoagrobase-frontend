'use client';

import { Package, Sparkles, MoveLeft, MoveRight } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

import TextBadge from '../ui/TextBadge';
import ContentPlaceholder from '../common/ContentPlaceholder';
import CategoriesItem from '../category/CategoriesItem';
import CategoriesSkeleton from '../category/CategoriesSkeleton';
import { useCategories } from '@/queries/categories.query';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Constants
const SWIPER_CONFIG = {
    spaceBetween: 30,
    slidesPerView: 1,
    centeredSlides: false,
    autoplay: {
        delay: 5000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
    },
    pagination: {
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
    },
    breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
        1280: { slidesPerView: 3.5, spaceBetween: 30 },
    },
};

const SKELETON_COUNT = 4;

const NavigationButton = ({ direction, onClick }) => {
    const isPrev = direction === 'prev';
    const Icon = isPrev ? MoveLeft : MoveRight;

    return (
        <button
            onClick={onClick}
            className={`
        absolute ${isPrev ? 'left-0 -translate-x-6' : 'right-0 translate-x-6'}
        top-1/2 -translate-y-1/2 z-10
        bg-white dark:bg-slate-800 p-3 rounded-full
        shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30
        transition-all duration-300 hover:scale-110
        border-2 border-slate-200 dark:border-slate-700 group
      `}
            aria-label={`${isPrev ? 'Previous' : 'Next'} slide`}
        >
            <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </button>
    );
};

// Section Header Component
const SectionHeader = () => (
    <div className="text-center mb-12">
        <TextBadge
            className="mb-4"
            color="green"
            variant="light"
            size="lg"
            startIcon={<Sparkles />}
            endIcon={<Package />}
        >
            Shop by Category
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-green-600">Categories</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of agricultural products tailored for modern farming
        </p>
    </div>
);

export default function FeaturedCategories() {
    const [isClient, setIsClient] = useState(false);
    const [swiperRef, setSwiperRef] = useState(null);
    const { data: categories = [], isLoading, isError, error } = useCategories();
    const handlePrevSlide = useCallback(() => swiperRef?.slidePrev(), [swiperRef]);
    const handleNextSlide = useCallback(() => swiperRef?.slideNext(), [swiperRef]);

    const hasCategories = categories.length > 0;
    const showNavigation = hasCategories && !isLoading && isClient;

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Render empty state
    if (!isLoading && !hasCategories) {
        return (
            <section className="my-24">
                <SectionHeader />
                <ContentPlaceholder
                    icon={Package}
                    title="No Categories Available"
                    description="We're currently updating our product categories. Our selection of premium agricultural supplies, farming equipment, and organic products will be available soon. Check back shortly to explore our comprehensive range!"
                    color="green"
                    variant="light"
                />
            </section>
        );
    }

    if (isError) {
        return (
            <section className="my-24">
                <SectionHeader />
                <ContentPlaceholder
                    icon={Package}
                    title="Unable to Load Categories"
                    description="We're experiencing technical difficulties loading our featured categories. Please try refreshing the page or check back in a few moments."
                    color="red"
                    variant="light"
                />
            </section>
        );
    }

    return (
        <section className="my-24">
            <SectionHeader />

            <div className="relative">
                {showNavigation && (
                    <>
                        <NavigationButton direction="prev" onClick={handlePrevSlide} />
                        <NavigationButton direction="next" onClick={handleNextSlide} />
                    </>
                )}

                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    onSwiper={setSwiperRef}
                    className="pb-16!"
                    {...SWIPER_CONFIG}
                >
                    {isLoading
                        ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <SwiperSlide key={`skeleton-${i}`}>
                                <CategoriesSkeleton />
                            </SwiperSlide>
                        ))
                        : categories.map((category) => (
                            <SwiperSlide key={category.id}>
                                <CategoriesItem category={category} />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </section>
    );
}