'use client'

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award } from 'lucide-react';

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const testimonials = [
        {
            id: 1,
            name: "Adeola Adebayo",
            role: "Commercial Farmer",
            location: "Ogun State",
            avatar: "https://i.pravatar.cc/150?img=12",
            rating: 5,
            comment: "Supero Agrobase has transformed my farming business. Their fertilizers are top-quality and the delivery is always on time. I've seen a 40% increase in my crop yield!",
            businessType: "Large Scale Farming"
        },
        {
            id: 2,
            name: "Chioma Okonkwo",
            role: "Restaurant Owner",
            location: "Lagos",
            avatar: "https://i.pravatar.cc/150?img=45",
            rating: 5,
            comment: "As a restaurant owner, I need fresh quality produce consistently. Their seeds and organic products have helped me start my own vegetable garden. Excellent service!",
            businessType: "Food & Hospitality"
        },
        {
            id: 3,
            name: "Ibrahim Musa",
            role: "Agricultural Retailer",
            location: "Kano",
            avatar: "https://i.pravatar.cc/150?img=33",
            rating: 5,
            comment: "I've been sourcing products from Supero Agrobase for 3 years. Their wholesale prices are competitive and product authenticity is guaranteed. Highly recommended!",
            businessType: "Retail & Distribution"
        },
        {
            id: 4,
            name: "Grace Okafor",
            role: "Organic Farmer",
            location: "Enugu",
            avatar: "https://i.pravatar.cc/150?img=47",
            rating: 5,
            comment: "The customer support is exceptional! They guided me in choosing the right organic fertilizers and pest control methods. My farm is now fully organic and thriving.",
            businessType: "Organic Agriculture"
        },
        {
            id: 5,
            name: "Yusuf Abdullahi",
            role: "Greenhouse Manager",
            location: "Abuja",
            avatar: "https://i.pravatar.cc/150?img=51",
            rating: 5,
            comment: "Their irrigation equipment and greenhouse supplies are world-class. The technical support team helped set up my entire system. Production has doubled since!",
            businessType: "Greenhouse Operations"
        }
    ];

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

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

    const getSlidePosition = (index) => {
        const diff = index - currentIndex;
        if (diff === 0) return 'center';
        if (diff === 1 || diff === -(testimonials.length - 1)) return 'right';
        if (diff === -1 || diff === testimonials.length - 1) return 'left';
        return 'hidden';
    };

    return (
        <section className="my-24 py-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Award className="w-4 h-4" />
                        Customer Success Stories
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        What Our{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            Customers Say
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Trusted by thousands of farmers, retailers, and agricultural businesses across Nigeria
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div className="relative">
                    <div className="relative h-[500px] lg:h-[450px] flex items-center justify-center">
                        {testimonials.map((testimonial, index) => {
                            const position = getSlidePosition(index);

                            return (
                                <div
                                    key={testimonial.id}
                                    className={`absolute transition-all duration-700 ease-in-out ${position === 'center'
                                        ? 'w-full lg:w-[600px] scale-100 opacity-100 z-30'
                                        : position === 'left'
                                            ? 'w-full lg:w-[500px] -translate-x-[70%] lg:-translate-x-[70%] scale-90 opacity-40 z-10'
                                            : position === 'right'
                                                ? 'w-full lg:w-[500px] translate-x-[70%] lg:translate-x-[70%] scale-90 opacity-40 z-10'
                                                : 'opacity-0 scale-75 pointer-events-none'
                                        }`}
                                    onClick={() => position !== 'center' && goToSlide(index)}
                                    style={{ cursor: position !== 'center' ? 'pointer' : 'default' }}
                                >
                                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 relative overflow-hidden">
                                        {/* Quote Icon */}
                                        <div className="absolute top-6 right-6 opacity-10">
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
                                                            src={testimonial.avatar}
                                                            alt={testimonial.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    {/* Verified Badge */}
                                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center border-2 border-white">
                                                        <Award className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div className="text-center sm:text-left flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                                                    <p className="text-green-600 font-semibold">{testimonial.role}</p>
                                                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex gap-1">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Comment */}
                                            <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                                                "{testimonial.comment}"
                                            </p>

                                            {/* Business Type Badge */}
                                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                {testimonial.businessType}
                                            </div>
                                        </div>

                                        {/* Decorative Element */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 lg:left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-300 group"
                    >
                        <ChevronLeft className="w-6 h-6 text-green-600 group-hover:text-white" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-300 group"
                    >
                        <ChevronRight className="w-6 h-6 text-green-600 group-hover:text-white" />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${currentIndex === index
                                ? 'w-8 h-3 bg-green-600'
                                : 'w-3 h-3 bg-gray-300 hover:bg-green-400'
                                }`}
                        >{''}</button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                    {[
                        { label: "Happy Customers", value: "10,000+" },
                        { label: "5-Star Reviews", value: "8,500+" },
                        { label: "Success Rate", value: "98%" },
                        { label: "Products Sold", value: "50,000+" }
                    ].map((stat, index) => (
                        <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                            <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
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
            `}</style>
        </section>
    );
}