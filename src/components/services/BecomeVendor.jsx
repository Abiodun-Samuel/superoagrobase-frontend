'use client'

import React, { useState } from 'react';
import { Sprout, TrendingUp, Users, Shield, Clock, Package, CheckCircle, ArrowRight, Star, DollarSign } from 'lucide-react';

export default function BecomeVendor() {
    const [formData, setFormData] = useState({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        businessType: '',
        productCategories: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Application submitted! Our team will contact you within 24 hours.');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-green-500 bg-opacity-30 px-4 py-2 rounded-full mb-6">
                            <Sprout className="w-5 h-5" />
                            <span className="text-sm font-medium">Join Thousands of Successful Vendors</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Grow Your Agricultural Business Online
                        </h1>
                        <p className="text-lg sm:text-xl text-green-50 mb-8 leading-relaxed">
                            Connect with buyers nationwide, set your own prices, and scale your agribusiness with our trusted ecommerce platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#apply" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl">
                                Start Selling Today <ArrowRight className="w-5 h-5" />
                            </a>
                            <a href="#benefits" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-all">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">5,000+</div>
                            <div className="text-gray-600">Active Vendors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">50,000+</div>
                            <div className="text-gray-600">Daily Buyers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">95%</div>
                            <div className="text-gray-600">Satisfaction Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">24/7</div>
                            <div className="text-gray-600">Support Available</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Why Sell With Us?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Join Africa's fastest-growing agricultural marketplace and unlock unlimited potential for your business
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <DollarSign className="w-7 h-7 text-green-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Set Your Own Prices</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Complete control over your pricing strategy. Adjust prices anytime to stay competitive and maximize profits.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-green-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Reach More Customers</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Access thousands of verified buyers actively searching for quality agricultural products daily.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <TrendingUp className="w-7 h-7 text-green-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow Your Revenue</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our vendors report an average 3x increase in sales within the first six months of joining our platform.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <Shield className="w-7 h-7 text-green-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Get paid on time with our secure payment system. Weekly payouts directly to your bank account.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <Clock className="w-7 h-7 text-green-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Setup</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Start selling in minutes. Simple onboarding process with step-by-step guidance from our support team.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <Package className="w-7 h-7 text-green-700" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Product Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Select from our extensive product catalog and add your prices. Update inventory with simple tools.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 sm:py-24 bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            How to Get Started
                        </h2>
                        <p className="text-lg text-gray-600">
                            Three simple steps to start selling your agricultural products online
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">1</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Apply & Get Approved</h3>
                            <p className="text-gray-600">
                                Fill out our simple application form. Our team reviews and approves vendors within 24 hours.
                            </p>
                        </div>

                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">2</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Select & Price Products</h3>
                            <p className="text-gray-600">
                                Browse our product catalog, select items you sell, and set competitive prices for your inventory.
                            </p>
                        </div>

                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">3</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Selling & Earning</h3>
                            <p className="text-gray-600">
                                Receive orders, fulfill them, and get paid weekly. Track your sales with real-time analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            What Our Vendors Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-green-50 p-8 rounded-xl">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">
                                "This platform transformed my farm business. I now reach customers across the country and my sales have tripled!"
                            </p>
                            <div className="font-semibold text-gray-900">Amina Ibrahim</div>
                            <div className="text-sm text-gray-600">Rice Farmer, Kano</div>
                        </div>

                        <div className="bg-green-50 p-8 rounded-xl">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">
                                "Easy to use, reliable payments, and excellent support. Best decision for my vegetable distribution business."
                            </p>
                            <div className="font-semibold text-gray-900">Chidi Okafor</div>
                            <div className="text-sm text-gray-600">Vegetable Supplier, Lagos</div>
                        </div>

                        <div className="bg-green-50 p-8 rounded-xl">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">
                                "The platform gives me full control over pricing. I can compete effectively while maintaining good margins."
                            </p>
                            <div className="font-semibold text-gray-900">Fatima Musa</div>
                            <div className="text-sm text-gray-600">Poultry Farmer, Abuja</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section id="apply" className="py-16 sm:py-24 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Ready to Start Selling?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Complete this form and join thousands of successful agricultural vendors
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Business Name *
                                </label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter your business name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact Person Name *
                                </label>
                                <input
                                    type="text"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="+234 800 000 0000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Business Type *
                                </label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select your business type</option>
                                    <option value="farmer">Farmer/Producer</option>
                                    <option value="distributor">Distributor/Wholesaler</option>
                                    <option value="processor">Processor/Manufacturer</option>
                                    <option value="cooperative">Cooperative/Association</option>
                                    <option value="retailer">Retailer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Categories (select all that apply)
                                </label>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {['Grains & Cereals', 'Vegetables', 'Fruits', 'Livestock', 'Poultry', 'Dairy Products', 'Fish & Seafood', 'Processed Foods'].map((category) => (
                                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-gray-700">
                                        By submitting this application, you agree to our vendor terms and conditions. We'll review your application and contact you within 24 hours.
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                Submit Application <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <details className="bg-green-50 rounded-lg p-6 cursor-pointer">
                            <summary className="font-semibold text-gray-900 text-lg">
                                What are the requirements to become a vendor?
                            </summary>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                You need a registered business, valid contact information, and agricultural products to sell. We welcome farmers, distributors, processors, and cooperatives.
                            </p>
                        </details>

                        <details className="bg-green-50 rounded-lg p-6 cursor-pointer">
                            <summary className="font-semibold text-gray-900 text-lg">
                                How much does it cost to join?
                            </summary>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                Registration is free. We only charge a small commission on successful sales, ensuring our success is tied to yours.
                            </p>
                        </details>

                        <details className="bg-green-50 rounded-lg p-6 cursor-pointer">
                            <summary className="font-semibold text-gray-900 text-lg">
                                How do I set my product prices?
                            </summary>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                Once approved, you'll access our product catalog. Simply select the items you sell and add your competitive prices. You can update prices anytime through your vendor dashboard.
                            </p>
                        </details>

                        <details className="bg-green-50 rounded-lg p-6 cursor-pointer">
                            <summary className="font-semibold text-gray-900 text-lg">
                                When and how do I get paid?
                            </summary>
                            <p className="mt-4 text-gray-600 leading-relaxed">
                                Payments are processed weekly via direct bank transfer. You'll receive payment for all orders delivered in the previous week.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Join Africa's Leading Agricultural Marketplace Today
                    </h2>
                    <p className="text-lg text-green-50 mb-8 max-w-2xl mx-auto">
                        Start reaching thousands of buyers, grow your revenue, and take your agricultural business to the next level.
                    </p>
                    <a
                        href="#apply"
                        className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
                    >
                        Become a Vendor Now <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>
        </div>
    );
}