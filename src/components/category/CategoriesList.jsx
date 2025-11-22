'use client';
import { Package, Sparkles, MoveLeft, MoveRight } from 'lucide-react';
import TextBadge from '../ui/TextBadge';
import { useCategories } from "@/queries/category.query";
import { useState } from 'react';
import CategoriesSkeleton from './CategoriesSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-fade';
import CategoriesItem from './CategoriesItem';
import ContentPlaceholder from '../common/ContentPlaceholder';

export default function CategoriesList({ categories: featuredCategories }) {
    const [swiperRef, setSwiperRef] = useState(null);
    console.log(featuredCategories)

    // const { data: featuredCategories = [], isLoading, error, isError } = useCategories();
    const hasCategories = featuredCategories?.length > 0;

    return (
        <>
            {/* <div className="text-center mb-12">
                <TextBadge className='mb-4' color='green' variant='light' size='lg' startIcon={<Sparkles />} endIcon={<Package />}>
                    Shop by Category
                </TextBadge>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Featured <span className="text-green-600">Categories</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore our comprehensive range of agricultural products tailored for modern farming
                </p>
            </div> */}

            {/* {!hasCategories ? (
                <ContentPlaceholder color='red' description={'error?.data?.message'} variant='light' />
            ) : (
            )} */}
            <div className="relative">
                {hasCategories && (
                    <>
                        <button
                            onClick={() => swiperRef?.slidePrev()}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white dark:bg-slate-800 p-3 rounded-full shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 transition-all duration-300 hover:scale-110 border-2 border-slate-200 dark:border-slate-700 group"
                            aria-label="Previous slide"
                        >
                            <MoveLeft className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </button>

                        <button
                            onClick={() => swiperRef?.slideNext()}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white dark:bg-slate-800 p-3 rounded-full shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 transition-all duration-300 hover:scale-110 border-2 border-slate-200 dark:border-slate-700 group"
                            aria-label="Next slide"
                        >
                            <MoveRight className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </button>
                    </>
                )}

                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                    spaceBetween={30}
                    slidesPerView={1}
                    centeredSlides={false}
                    onSwiper={setSwiperRef}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 3
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: true,
                        pauseOnMouseEnter: true
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30
                        },
                        1280: {
                            slidesPerView: 3.5,
                            spaceBetween: 30
                        }
                    }}
                    className="pb-16!"
                >
                    {/* {hasCategories ? (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <SwiperSlide key={i}>
                                    <CategoriesSkeleton />
                                </SwiperSlide>
                            ))}
                        </>
                    ) : (
                    )} */}
                    <>
                        {featuredCategories.map((category) => (
                            <SwiperSlide key={category.id}>
                                <CategoriesItem category={category} />
                            </SwiperSlide>
                        ))}
                    </>
                </Swiper>
            </div>
            <style>
                {`
                .swiper-pagination-bullet {
                width: 12px;
                height: 12px;
                background: rgb(148 163 184);
                opacity: 0.5;
                transition: all 0.3s ease;
                }
                .dark .swiper-pagination-bullet {
                background: rgb(71 85 105);
                }
                .swiper-pagination-bullet-active {
                width: 32px;
                border-radius: 6px;
                background: linear-gradient(135deg, rgb(0 200 0), rgb(0 100 4));
                opacity: 1;
                }
                .swiper-pagination-bullet:hover {
                opacity: 0.8;
                transform: scale(1.2);
                }
            `}</style>
        </>
    );
}