'use client'

import { useState, useEffect } from 'react';
import { ShoppingCart, Leaf, TrendingUp, Users, ArrowRight, Package, Shield, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const featuredProducts = [
        {
            image: '/images/products/1.jpg',
        },
        {
            image: '/images/products/2.png',
        },
        {
            image: '/images/products/3.jpg',
        },
        {
            image: '/images/products/4.jpg',
        },
        {
            image: '/images/products/5.jpg',
        }
    ];

    useEffect(() => {
        setIsVisible(true);
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const stats = [
        { icon: Package, value: "5000+", label: "Products" },
        { icon: Users, value: "10K+", label: "Happy Farmers" },
        { icon: Shield, value: "100%", label: "Authentic" },
        { icon: Clock, value: "24/7", label: "Support" }
    ];

    return (
        <div className="mt-10 bg-[url('/images/bg/bg.png')] bg-no-repeat sm:bg-bottom bg-center relative bg-gradient-to-br from-slate-50 to-green-50 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Content */}
            <div className="relative mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center justify-between">
                    {/* Left Content */}
                    <div className={`p-3 text-center sm:text-left space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-800">Nigeria's Leading Agro Supplier</span>
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>

                        <div>
                            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                                Empowering
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                                    Modern Farming
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Your trusted partner for premium fertilizers, seeds, pesticides, and agricultural equipment. Quality products, competitive prices, fast delivery.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 flex items-center justify-center space-x-2">
                                <ShoppingCart className="w-5 h-5" />
                                <span>Shop Now</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex items-center justify-center space-x-2 border border-gray-200">
                                <Leaf className="w-5 h-5 text-green-600" />
                                <span>View Catalog</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow">
                                    <div className="mx-auto w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                                        <stat.icon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-xs text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Product Slider */}
                    <div className={`relative transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow bg-white">
                            {featuredProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-700 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <div className={`w-full h-full bg-gradient-to-br from-amber-500/20 to-green-600/20 relative`}>
                                        {/* Decorative Background Pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
                                                {[...Array(36)].map((_, i) => (
                                                    <div key={i} className="border border-green-600"></div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Content Layout */}
                                        <div className="relative h-full flex flex-col justify-between p-8 lg:p-12">
                                            {/* Top Badge */}
                                            <div className="flex justify-center items-start">
                                                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                                    Featured Product
                                                </div>
                                            </div>

                                            {/* Product Image - Centered */}
                                            <div className="flex-1 flex items-center justify-center py-8">
                                                <div className="relative transform hover:scale-105 transition-transform duration-500">
                                                    <div className="absolute inset-0 bg-white/50 rounded-3xl blur-2xl"></div>
                                                    <img
                                                        src={product.image}
                                                        alt={'featured products'}
                                                        className="relative w-80 h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Slide Indicators */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                                {featuredProducts.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`transition-all duration-300 rounded-full ${currentSlide === index
                                            ? 'bg-green-600 w-8 h-3'
                                            : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
                                            }`}
                                    >{''}</button>
                                ))}
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <div className="hidden sm:block absolute top-5 -left-0 bg-white rounded-2xl p-4 shadow animate-float">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">Certified Quality</div>
                                    <div className="text-xs text-gray-600">100% Authentic</div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:block absolute -bottom-0 -right-0 bg-white rounded-2xl p-4 shadow animate-float animation-delay-2000">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">Fast Delivery</div>
                                    <div className="text-xs text-gray-600">Nationwide</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
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