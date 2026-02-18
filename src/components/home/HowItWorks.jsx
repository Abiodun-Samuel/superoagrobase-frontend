'use client'

import { CheckCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import TextBadge from '../ui/TextBadge';
import IconBadge from '../ui/IconBadge';
import { STEPS } from '@/utils/data';

const SectionHeader = () => (
    <header className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-3 sm:space-y-4">
        <TextBadge
            color='green'
            variant="solid"
            startIcon={<CheckCircle className="w-5 h-5" />}
        >
            <span>Easy Ordering Process</span>
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            How to{" "}
            <span className="text-green-600">Order Online</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Order farm supplies, seeds, fertilizers, and equipment in 4 simple steps with flexible payment and delivery options
        </p>

        <TextBadge
            color="green"
            startIcon={<ShoppingCart />}
            href="/products"
            variant="outline"
            endIcon={<ArrowRight />}
        >
            <span>Start Shopping Now</span>
        </TextBadge>
    </header>
);

export default function HowItWorks() {

    return (
        <section
            className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8"
            aria-labelledby="how-it-works-heading"
        >
            <div className="relative z-10">
                {/* Section Header */}
                <SectionHeader />

                {/* Steps Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 relative">
                    {/* Connection Lines - Desktop Only */}
                    <div className="hidden lg:block absolute top-20 left-0 right-0 h-1" aria-hidden="true">
                        <div className="relative h-full mx-auto px-24">
                            <div className="h-full bg-gradient-to-r from-green-300 via-green-300 to-green-300 rounded-full"></div>
                        </div>
                    </div>

                    {STEPS?.map((step) => {
                        const Icon = step.icon;
                        return (
                            <article
                                key={step.id}
                                className="relative group"
                                aria-label={step.ariaLabel}
                            >
                                {/* Step Card */}
                                <div className="bg-white rounded-xl p-6 shadow transition-all duration-300 transform hover:-translate-y-2 h-full border-2 border-transparent hover:border-green-200">
                                    {/* Step Number */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="relative">
                                            <IconBadge
                                                className='transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'
                                                variant='light'
                                                size='xl'
                                                color='green'
                                                icon={<Icon aria-hidden="true" />}
                                            />
                                            {/* Pulse Effect */}
                                            <div className="bg-green-300 absolute inset-0 w-13 h-13 rounded-xl opacity-20 animate-ping" aria-hidden="true"></div>
                                        </div>
                                        <div className="text-5xl font-bold text-gray-200 group-hover:text-gray-200 transition-colors" aria-hidden="true">
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Decorative Element */}
                                    <div
                                        className="mt-6 h-1 w-16 rounded-full bg-green-500 transform origin-left group-hover:scale-x-150 transition-transform duration-300"
                                        aria-hidden="true"
                                    ></div>
                                </div>
                            </article>
                        );
                    })}
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
            `}</style>
        </section>
    );
}