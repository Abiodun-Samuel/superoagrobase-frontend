'use client';

import React from 'react';
import CategoriesSkeleton from './CategoriesSkeleton';


export default function FeaturedCategoriesSkeleton({ items = 6 }) {
    return (
        <section className="my-24" aria-busy="true" aria-label="Loading featured categories">
            <div className="text-center mb-12">
                {/* badge skeleton */}
                <div className="mx-auto mb-4 w-44 h-10 rounded-full bg-gray-200 animate-pulse" />

                {/* title skeleton */}
                <div className="mx-auto mb-4 max-w-3xl">
                    <div className="h-12 rounded-md bg-gray-200 animate-pulse w-64 md:w-96 lg:w-[520px] mx-auto"></div>
                </div>

                {/* description skeleton */}
                <div className="mx-auto max-w-2xl">
                    <div className="h-4 rounded bg-gray-200 animate-pulse max-w-[640px] mx-auto"></div>
                    <div className="h-4 rounded bg-gray-200 animate-pulse mt-3 max-w-[520px] mx-auto"></div>
                </div>
            </div>

            {/* categories skeleton grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {Array.from({ length: items }).map((_, idx) => (
                    <CategoriesSkeleton />
                ))}
            </div>
        </section>
    );
}
