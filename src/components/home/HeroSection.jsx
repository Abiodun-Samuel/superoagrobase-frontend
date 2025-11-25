'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShoppingCart, Leaf, TrendingUp, ArrowRight, Star, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import IconBadge from '../ui/IconBadge';
import TextBadge from '../ui/TextBadge';
import Button from '../ui/Button';
import { MOCK_PRODUCTS, STATS } from '@/utils/data';
import { HeroSectionImageSkeleton } from '../skeletonloader';

const SLIDE_INTERVAL = 5000;

const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
    </div>
);

const StatsGrid = ({ stats }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
        {stats.map((stat, index) => (
            <div
                key={`stat-${index}`}
                className="text-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow transition-transform hover:scale-105"
            >
                <IconBadge color="green" icon={<stat.icon className="w-5 h-5 text-green-600" />} />
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
        ))}
    </div>
);

const ProductSlide = ({ product, isActive, isFirst }) => (
    <div
        className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
    >
        <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-green-600/20 relative">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                    {Array.from({ length: 36 }, (_, i) => (
                        <div key={`grid-${i}`} className="border border-green-600" />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-8">
                <div className="flex justify-center items-start">
                    <TextBadge
                        endIcon={<ShoppingCart className="w-4 h-4" />}
                        variant="solid"
                        color="green"
                        size="md"
                        startIcon={<Package className="w-4 h-4" />}
                    >
                        Featured Product
                    </TextBadge>
                </div>

                <div className="flex-1 flex items-center justify-center py-8">
                    <Link
                        href={`/products/${product.slug}`}
                        className="relative transform hover:scale-105 transition-transform duration-500"
                        aria-label={`View ${product.title}`}
                    >
                        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                            <Image
                                fill
                                src={product.image}
                                alt={product.title}
                                className="object-contain drop-shadow-2xl rounded-xl"
                                priority={isFirst}
                                loading={isFirst ? 'eager' : 'lazy'}
                                sizes="(max-width: 1024px) 320px, 384px"
                            />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const SlideIndicators = ({ total, current, onSelect }) => (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {Array.from({ length: total }, (_, index) => (
            <button
                key={`indicator-${index}`}
                onClick={() => onSelect(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${current === index
                    ? 'bg-green-600 w-8 h-3'
                    : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
                    }`}
            />
        ))}
    </div>
);

export default function HeroSection({
    isError = false,
    isLoading = false,
    featuredProducts = [],
}) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const products = useMemo(() => {
        if (isError || !featuredProducts || featuredProducts.length === 0) {
            return MOCK_PRODUCTS;
        }
        return featuredProducts;
    }, [isError, featuredProducts]);


    const handleSlideSelect = useCallback((index) => {
        setCurrentSlide(index);
    }, []);

    useEffect(() => {
        if (products.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % products.length);
        }, SLIDE_INTERVAL);
        return () => clearInterval(timer);
    }, [products.length]);

    return (
        <div className="bg-[url('/images/bg/bg.png')] bg-no-repeat sm:bg-bottom bg-center relative bg-gradient-to-br from-slate-50 to-green-50 overflow-hidden">
            <AnimatedBackground />

            <div className="relative mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div className="p-3 text-center lg:text-left space-y-8">
                        <TextBadge
                            size="md"
                            startIcon={<TrendingUp className="w-4 h-4 text-green-600" />}
                            endIcon={<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        >
                            <span className="text-sm font-semibold text-gray-800">
                                Nigeria's Leading Agro Supplier
                            </span>
                        </TextBadge>

                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Empowering
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                    Modern Farming
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                                We Provide Innovative Agricultural Solutions, Quality Products and Services to
                                Improve Crop Yields Optimally.
                            </p>
                        </div>

                        <div className="flex justify-center lg:justify-start">
                            <div className='flex flex-col sm:flex-row gap-4 md:max-w-sm max-w-xs w-full'>
                                <Button
                                    href="/products"
                                    startIcon={<ShoppingCart className="w-5 h-5" />}
                                    endIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />}
                                >
                                    Shop Now
                                </Button>
                                <Button
                                    href="/contact"
                                    variant="outline"
                                    startIcon={<Leaf className="w-5 h-5 text-green-600" />}
                                    endIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />}
                                >
                                    Contact Us
                                </Button>
                            </div>
                        </div>

                        <StatsGrid stats={STATS} />
                    </div>

                    {/* Right Content - Product Slider */}
                    <div className="relative">
                        {isLoading ? <HeroSectionImageSkeleton /> : <div className="relative h-[500px] lg:h-[550px] rounded-3xl overflow-hidden shadow bg-white">
                            {products.map((product, index) => (
                                <ProductSlide
                                    key={`${product.slug}-${product.id}`}
                                    product={product}
                                    isActive={currentSlide === index}
                                />
                            ))}

                            <SlideIndicators
                                total={products.length}
                                current={currentSlide}
                                onSelect={handleSlideSelect}
                            />
                        </div>}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}