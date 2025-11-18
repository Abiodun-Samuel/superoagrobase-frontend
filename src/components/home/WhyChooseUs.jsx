'use client'
import { features, trustIndicators } from '@/utils/data';
import { Shield, Truck, Headphones, CreditCard, Award, Leaf, TrendingUp, Heart, CheckCircle2, Zap, Users, Globe } from 'lucide-react';

export default function WhyChooseUs() {


    return (
        <section className="my-24">
            {/* Section Header */}
            <div className="text-center mb-16 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    <Shield className="w-4 h-4" />
                    <span>Trusted by 10,000+ Farmers Nationwide</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Why Farmers Choose
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                        Our Platform
                    </span>
                </h2>

                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    We're not just suppliers—we're your partners in agricultural success. Here's what makes us different.
                </p>
            </div>

            {/* Trust Indicators Bar */}
            <div className="mb-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow p-6 border border-gray-100">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {trustIndicators.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <item.icon className="w-5 h-5 text-green-600" />
                            </div>


                            <div>
                                <div className="text-lg font-semibold text-gray-900">{item.value}</div>
                                <div className="text-xs text-gray-600">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className={`relative h-full bg-white rounded-2xl p-6 shadow transition-all duration-500 border border-gray-100 overflow-hidden}`}>
                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

                                {/* Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-50 text-gray-700">
                                        {feature.badge}
                                    </span>
                                </div>

                                {/* Icon Container */}
                                <div className="relative mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-amber-50 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all duration-500">
                                        <Icon className="w-5 h-5 text-yellow-600" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative space-y-3">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                            </div>

                            {/* Decorative Corner Element */}
                            <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-16 text-center ">
                <div className="bg-[url('/images/bg/product-bg.jpg')] bg-cover bg-center rounded-3xl p-8 lg:p-12 shadow relative overflow-hidden">

                    <div className="relative z-10 space-y-6">
                        <h3 className="text-3xl lg:text-4xl font-bold text-gray-700">
                            Ready to Get Started?
                        </h3>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Join thousands of successful farmers who trust us for their agricultural needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <button className="group px-8 py-4 bg-white text-green-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                                <span>Start Shopping</span>
                                <CheckCircle2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}