'use client';

import { useState } from 'react';
import { Package, ChevronRight, ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';
import { featuredCategories } from '@/utils/data';
import Button from '../ui/Button';
import BadgeText from '../ui/BadgeText';

export default function FeaturedCategories() {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <section className="my-24">
            <div className="text-center mb-12">
                <BadgeText className='mb-4' color='green' variant='light' size='lg' startIcon={<Sparkles />} endIcon={<Package />}>Shop by Category</BadgeText>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Featured <span className="text-green-600">Categories</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Explore our comprehensive range of agricultural products tailored for modern farming
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
                {featuredCategories.map((category, index) => (
                    <div
                        key={category.id}
                        className="group relative"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Main Card */}
                        <div className="cursor-pointer relative h-[420px] rounded-3xl overflow-hidden bg-white shadow">

                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-70`}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            </div>

                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            </div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col p-6">

                                {/* Top Section */}
                                <div className="flex justify-between items-start mb-auto">
                                    {/* Icon with Animated Ring */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:scale-150 transition-all duration-500"></div>
                                        <div className="relative w-14 h-14 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border-2 border-white/80">
                                            <span className="text-2xl">{category.icon}</span>
                                        </div>
                                        {/* Orbiting dot */}
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>

                                    {/* Arrow Button */}
                                    <button className="w-11 h-11 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1">
                                        <ArrowUpRight className="w-5 h-5 text-gray-800" />
                                    </button>
                                </div>

                                {/* Bottom Section */}
                                <div className="space-y-4">

                                    {/* Stats Bar */}
                                    <div className="flex items-center justify-between">
                                        {/* Product Count */}
                                        <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/80">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-bold text-gray-800">
                                                {category.productCount}
                                            </span>
                                            <span className="text-xs text-gray-600">products</span>
                                        </div>

                                        {/* Subcategory Count */}
                                        <div className="bg-white/90 backdrop-blur-xl px-3 py-2 rounded-full shadow-lg">
                                            <span className="text-xs font-bold text-gray-700">
                                                {category.subcategories.length} types
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="text-2xl font-black text-white drop-shadow-2xl group-hover:translate-x-2 transition-transform duration-300">
                                        {category.name}
                                    </h3>

                                    {/* Subcategories Preview */}
                                    <div className="space-y-2 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                        {category.subcategories.slice(0, 2).map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 justify-between bg-white/90 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg border border-white/80"
                                                style={{ transitionDelay: `${idx * 50}ms` }}
                                            >
                                                <span className="text-xs font-semibold text-gray-800">
                                                    {sub.name}
                                                </span>
                                                <span className="text-xs font-bold text-green-600">
                                                    {sub.count}
                                                </span>
                                            </div>
                                        ))}
                                        {category.subcategories.length > 2 && (
                                            <div className="text-center">
                                                <button className="text-xs font-semibold text-white/90 hover:text-white transition-colors">
                                                    +{category.subcategories.length - 2} more
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <Button href='/' endIcon={<ChevronRight />} color="green">Explore Collection</Button>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                            Popular
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
