'use client'

import { Search, ShoppingCart, Package, Truck, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "Browse",
            description: "Explore our extensive catalog of premium agricultural products, seeds, fertilizers, and equipment",
            icon: Search,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            iconBg: "bg-blue-100",
            delay: "0"
        },
        {
            id: 2,
            title: "Order",
            description: "Add items to cart, choose payment method, and complete your purchase securely in minutes",
            icon: ShoppingCart,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            iconBg: "bg-green-100",
            delay: "100"
        },
        {
            id: 3,
            title: "Track",
            description: "Monitor your order in real-time with our tracking system and receive instant updates",
            icon: Package,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-50",
            iconBg: "bg-orange-100",
            delay: "200"
        },
        {
            id: 4,
            title: "Get Delivered",
            description: "Receive your quality products at your doorstep with our fast and reliable delivery service",
            icon: Truck,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            iconBg: "bg-purple-100",
            delay: "300"
        }
    ];

    return (
        <section className="my-24">     {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-20">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <CheckCircle className="w-4 h-4" />
                        Simple Process
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        How It{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            Works
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get your agricultural products delivered in 4 easy steps
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
                    {/* Connection Lines - Desktop Only */}
                    <div className="hidden lg:block absolute top-20 left-0 right-0 h-1">
                        <div className="relative h-full max-w-6xl mx-auto px-24">
                            <div className="h-full bg-gradient-to-r from-blue-300 via-green-300 via-orange-300 to-purple-300 rounded-full opacity-30"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2">
                                <div className="h-full bg-gradient-to-r from-blue-400 via-green-400 via-orange-400 to-purple-400 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.id}
                                className="relative group"
                                style={{ animationDelay: `${step.delay}ms` }}
                            >
                                {/* Step Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full border-2 border-transparent hover:border-green-200">
                                    {/* Step Number */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="relative">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                                            </div>
                                            {/* Pulse Effect */}
                                            <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} opacity-20 animate-ping`}></div>
                                        </div>
                                        <div className="text-5xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors">
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
                                    <div className={`mt-6 h-1 w-16 rounded-full bg-gradient-to-r ${step.color} transform origin-left group-hover:scale-x-150 transition-transform duration-300`}></div>
                                </div>

                                {/* Mobile Arrow */}
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center lg:hidden my-4">
                                        <ArrowRight className="w-6 h-6 text-green-400 animate-bounce" />
                                    </div>
                                )}
                            </div>
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
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
}