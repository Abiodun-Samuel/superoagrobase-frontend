'use client'

import { useMemo } from 'react';
import {
    Shield,
    Headphones,
    ArrowRight,
    ShoppingBag,
} from 'lucide-react';
import Button from '../ui/Button';
import TextBadge from '../ui/TextBadge';
import IconBadge from '../ui/IconBadge';
import { FEATURES, TRUST_INDICATORS } from '@/utils/data';

// Subcomponents
const SectionHeader = () => (
    <header className="text-center mb-12 space-y-4">
        <TextBadge size='lg' color='green' startIcon={<Shield className="w-5 h-5" />}>
            <span>Trusted by 10,000+ Nigerian Farmers</span>
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Why Choose{' '}
            <span className="text-green-600">Our Platform</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for quality agricultural products, expert support, and reliable delivery across Nigeria
        </p>
    </header>
);

const TrustIndicatorsBar = ({ indicators }) => (
    <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow p-6 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {indicators.map((indicator, index) => {
                const Icon = indicator.icon;
                return (
                    <article
                        key={`trust-${index}`}
                        className="flex items-center gap-4 group cursor-pointer"
                        itemScope
                        itemType="https://schema.org/Rating"
                    >
                        <IconBadge size='lg' icon={<Icon aria-hidden="true" />} color='green' />

                        <div className="flex-1 min-w-0">
                            <div className="text-lg font-bold text-gray-900 truncate" itemProp="ratingValue">
                                {indicator.value}
                            </div>
                            <div className="text-sm text-gray-600 truncate" itemProp="name">
                                {indicator.label}
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    </div>
);

const FeatureCard = ({ feature }) => {
    const Icon = feature.icon;

    return (
        <article
            className="group relative h-full"
            itemScope
            itemType="https://schema.org/Service"
        >
            <div className="relative h-full bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500`} aria-hidden="true" />

                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <TextBadge size='sm' color='orange'>{feature.badge}</TextBadge>
                </div>

                {/* Icon Container */}
                <div className="relative mb-4">
                    <IconBadge size='lg' color='orange' icon={<Icon aria-hidden="true" />}></IconBadge>
                </div>

                {/* Content */}
                <div className="relative space-y-3">
                    <h3
                        className="text-xl font-bold text-gray-900 leading-tight"
                        itemProp="name"
                    >
                        {feature.title}
                    </h3>
                    <p
                        className="text-gray-600 text-sm leading-relaxed"
                        itemProp="description"
                    >
                        {feature.description}
                    </p>
                </div>
            </div>

            {/* Decorative Glow Effect */}
            <div className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} aria-hidden="true" />
        </article>
    );
};

const CTASection = () => (
    <div className="mt-16 text-center">
        <div className="bg-[url('/images/bg/product-bg.jpg')] bg-cover bg-center rounded-3xl p-8 lg:p-12 shadow relative overflow-hidden">
            <div className="relative z-10 space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-700">
                    Start Ordering Farm Supplies Today
                </h3>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Join thousands of Nigerian farmers who buy quality agricultural products from our trusted platform
                </p>
                <div className="max-w-sm mx-auto flex flex-col w-fit sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button
                        href="/products"
                        color='red'
                        variant='solid'
                        startIcon={<ShoppingBag />}
                        endIcon={<ArrowRight />}
                    >
                        <span>Shop Products</span>
                    </Button>

                    <Button
                        startIcon={<Headphones />}
                        endIcon={<ArrowRight />}
                        href="/contact"
                        variant='outline'
                        color='red'
                    >
                        <span>Contact Expert</span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

// Main Component
export default function WhyChooseUs({
    trustIndicators = TRUST_INDICATORS,
    features = FEATURES
}) {
    const memoizedIndicators = useMemo(() => trustIndicators, [trustIndicators]);
    const memoizedFeatures = useMemo(() => features, [features]);

    return (
        <section
            className="my-24"
            aria-labelledby="why-choose-us-heading"
            itemScope
            itemType="https://schema.org/Organization"
        >
            <SectionHeader />
            <TrustIndicatorsBar indicators={memoizedIndicators} />

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {memoizedFeatures.map((feature, index) => (
                    <FeatureCard
                        key={`feature-${index}`}
                        feature={feature}
                        index={index}
                    />
                ))}
            </div>

            <CTASection />
        </section>
    );
}