'use client'

import React, { useState, useEffect } from 'react';
import {
    Leaf,
    Users,
    Target,
    Award,
    TrendingUp,
    Globe,
    CheckCircle,
    ArrowRight,
    Microscope,
    ShoppingBag,
    Sprout,
    LineChart,
    Shield,
    Heart,
    Sparkles,
    MapPin,
    Phone,
    Mail,
    Clock
} from 'lucide-react';

export default function AboutPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const services = [
        {
            id: 1,
            title: "Agricultural Inputs Supply",
            description: "Premium quality fertilizers, seeds, pesticides, and farming equipment from trusted global brands. We ensure authenticity and competitive pricing for maximum farm productivity.",
            icon: ShoppingBag,
            color: "from-green-500 to-emerald-600",
            features: ["Certified Products", "Nationwide Delivery", "Bulk Discounts", "Expert Guidance"],
            link: "/services/agricultural-inputs"
        },
        {
            id: 2,
            title: "Farm Management & Consultancy",
            description: "Professional advisory services to optimize your farming operations. From soil analysis to crop management, our experts guide you through every step of modern agriculture.",
            icon: Sprout,
            color: "from-blue-500 to-cyan-600",
            features: ["Soil Testing", "Crop Planning", "Pest Management", "Yield Optimization"],
            link: "/services/farm-consultancy"
        },
        {
            id: 3,
            title: "Agricultural Laboratory Services",
            description: "State-of-the-art testing facilities for soil, water, and crop analysis. Data-driven insights to help you make informed decisions for sustainable farming practices.",
            icon: Microscope,
            color: "from-purple-500 to-indigo-600",
            features: ["Soil Analysis", "Water Quality Test", "Nutrient Profiling", "Disease Detection"],
            link: "/services/laboratory-services"
        }
    ];

    const stats = [
        { icon: Users, value: "10,000+", label: "Happy Farmers", color: "text-green-600" },
        { icon: MapPin, value: "36", label: "States Covered", color: "text-blue-600" },
        { icon: Award, value: "5+", label: "Years Experience", color: "text-purple-600" },
        { icon: ShoppingBag, value: "5,000+", label: "Products", color: "text-orange-600" }
    ];

    const values = [
        {
            icon: Shield,
            title: "Quality Assurance",
            description: "We guarantee 100% authentic products from verified suppliers with rigorous quality control."
        },
        {
            icon: Heart,
            title: "Customer Focus",
            description: "Your success is our priority. We provide personalized support and expert guidance."
        },
        {
            icon: Sparkles,
            title: "Innovation",
            description: "Leveraging cutting-edge research to bring modern solutions to traditional farming."
        },
        {
            icon: TrendingUp,
            title: "Sustainability",
            description: "Promoting eco-friendly practices for long-term agricultural productivity."
        }
    ];

    const timeline = [
        { year: "2019", event: "Company Founded", description: "Started with a vision to revolutionize Nigerian agriculture" },
        { year: "2020", event: "Laboratory Established", description: "Launched state-of-the-art agricultural testing facility" },
        { year: "2022", event: "10,000+ Farmers", description: "Reached milestone of serving over 10,000 satisfied farmers" },
        { year: "2024", event: "Nationwide Coverage", description: "Expanded delivery services to all 36 states in Nigeria" }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[70vh] bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

                    {/* Decorative Leaves */}
                    <Leaf className="absolute top-20 left-10 w-24 h-24 text-white/10 transform rotate-45 animate-float" />
                    <Leaf className="absolute bottom-32 right-20 w-32 h-32 text-white/10 transform -rotate-12 animate-float animation-delay-2000" />
                </div>

                {/* Content */}
                <div className={`relative max-w-7xl mx-auto px-6 py-20 lg:py-32 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-white font-semibold text-sm">Empowering Nigerian Agriculture</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                            About <span className="text-green-200">Supero Agrobase</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed font-light">
                            A fast-rising agribusiness enterprise that leverages in-depth research and development to provide farmers with high-quality agricultural inputs, farm management, consultancy, and agricultural laboratory services.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a href="#services" className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-green-700 rounded-xl font-bold shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300">
                                <span>Our Services</span>
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a href="#contact" className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                                <span>Contact Us</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-b from-white to-green-50/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Our <span className="text-green-600">Foundation</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Built on principles of excellence, innovation, and commitment to transforming agriculture
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Mission Card */}
                        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-3xl text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold">Our Mission</h3>
                            </div>
                            <p className="text-white/95 text-lg leading-relaxed">
                                To empower Nigerian farmers with premium agricultural solutions, cutting-edge technology, and expert knowledge for sustainable and profitable farming. We are committed to delivering quality products and services that enhance productivity and ensure food security.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-700 p-8 rounded-3xl text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold">Our Vision</h3>
                            </div>
                            <p className="text-white/95 text-lg leading-relaxed">
                                To become Africa's leading agribusiness enterprise, driving agricultural transformation through innovation, research, and unwavering commitment to farmer success. We envision a future where every farmer has access to world-class agricultural solutions.
                            </p>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <value.icon className="w-7 h-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 px-6 bg-gradient-to-b from-white to-green-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">What We Offer</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Our <span className="text-green-600">Services</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Comprehensive agricultural solutions designed to maximize your farm's potential
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
                                {/* Icon Header */}
                                <div className={`bg-gradient-to-br ${service.color} p-8 relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                    <service.icon className="w-16 h-16 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-3 text-gray-700">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <a
                                        href={service.link}
                                        className="inline-flex items-center space-x-2 text-green-600 font-bold hover:text-green-700 group/link"
                                    >
                                        <span>Learn More</span>
                                        <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-300" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section id="contact" className="py-20 px-6 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    <Leaf className="absolute top-10 left-10 w-64 h-64 text-white transform rotate-12" />
                    <Leaf className="absolute bottom-10 right-10 w-48 h-48 text-white transform -rotate-45" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Farm?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of farmers who trust Supero Agrobase for their agricultural needs
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <a href="tel:+2348000000000" className="inline-flex items-center space-x-2 bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300">
                            <Phone className="w-5 h-5" />
                            <span>+234 800 000 0000</span>
                        </a>
                        <a href="mailto:info@superoagrobase.com" className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-300">
                            <Mail className="w-5 h-5" />
                            <span>info@superoagrobase.com</span>
                        </a>
                    </div>

                    <a
                        href="/contact"
                        className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-green-700 rounded-2xl font-bold shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300"
                    >
                        <span>Get Started Today</span>
                        <ArrowRight className="w-6 h-6" />
                    </a>
                </div>
            </section>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
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