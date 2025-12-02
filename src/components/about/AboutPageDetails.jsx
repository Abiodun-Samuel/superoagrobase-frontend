'use client'

import { Users, Target, Award, TrendingUp, Globe, CheckCircle, ArrowRight, Microscope, ShoppingBag, Sprout, Shield, Heart, Sparkles, MapPin } from 'lucide-react';
import TextBadge from '../ui/TextBadge';
import IconBadge from '../ui/IconBadge';
import PageHero from '../page/PageHero';
import CTASection from '../common/CTASection';
import Link from 'next/link';


const StatCard = ({ icon: Icon, value, label }) => {
    return (
        <div className="text-center">
            <IconBadge
                icon={<Icon />}
                variant="light"
                color="green"
                size="xl"
                className="mb-1"
            />
            <div className="text-xl font-black text-gray-700">{value}</div>
            <div className="text-gray-500 font-normal">{label}</div>
        </div>
    );
};

const ValueCard = ({ icon: Icon, title, description }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <IconBadge
                icon={<Icon className="w-7 h-7" />}
                variant="light"
                color="green"
                size="md"
                className="mb-4"
            />
            <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
};

const ServiceCard = ({ service }) => {
    const Icon = service.icon;

    return (
        <div className="group bg-white rounded-3xl shadow overflow-hidden border border-gray-100">
            {/* Icon Header */}
            <div className={`bg-gradient-to-br from-green-500 to-emerald-600 p-3.5 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <Icon className="w-8 h-6 text-white relative" />
                <h3 className="text-xl font-bold text-white">
                    {service.title}
                </h3>
            </div>

            {/* Content */}
            <div className="p-8">

                <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA Link */}
                <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 group/link"
                >
                    <span>Learn More</span>
                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        </div>
    );
};

// ============================================================================
// DATA (Open/Closed Principle - easy to extend without modification)
// ============================================================================

const STATS_DATA = [
    { icon: Users, value: "10,000+", label: "Happy Farmers" },
    { icon: MapPin, value: "36", label: "States Covered", },
    { icon: Award, value: "5+", label: "Years Experience", },
    { icon: ShoppingBag, value: "5,000+", label: "Products" }
];

const VALUES_DATA = [
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

const SERVICES_DATA = [
    {
        id: 1,
        title: "AgriCourt Ventures",
        description: "Premium quality fertilizers, seeds, pesticides, and farming equipment from trusted global brands. We ensure authenticity and competitive pricing for maximum farm productivity.",
        icon: ShoppingBag,
        features: ["Certified Products", "Nationwide Delivery", "Bulk Discounts", "Expert Guidance"],
        link: "/services/agricourt-ventures"
    },
    {
        id: 2,
        title: "HarvestYield Farm",
        description: "Through our 10Ha farmland focused on vegetable crop production including tomato, cucumber, sweetcorn, special watermelon and pepper, we provide comprehensive farm management and consultancy services.",
        icon: Sprout,
        features: ["Soil Testing", "Crop Planning", "Pest Management", "Yield Optimization"],
        link: "/services/harvestyield-farm"
    },
    {
        id: 3,
        title: "Agro-Input Claims",
        description: "Protecting farmers from losses due to adulterated and low-quality inputs. We provide quality assurance, testing, and claims support to ensure your investments are protected.",
        icon: Microscope,
        features: ["Soil Analysis", "Water Quality Test", "Nutrient Profiling", "Disease Detection"],
        link: "/services/agro-input-claims"
    }
];
// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AboutPageDetails() {

    return (
        <>
            <PageHero
                title={
                    <>
                        About <span className="text-green-200">Supero Agrobase</span>
                    </>
                }
                description={'A fast-rising agribusiness enterprise leveraging in-depth research and development to empower Nigerian farmers with quality agricultural inputs, expert farm management, and comprehensive laboratory services.'}
                badge="Empowering Nigerian Agriculture"
                breadcrumbs={[{ label: 'About Us', href: '/about' }]}
            />

            {/* Stats Section */}
            <section className="py-16">
                <div className="mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {STATS_DATA.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20">
                <div className="mx-auto">
                    <div className="text-center mb-12">
                        <TextBadge
                            variant="light"
                            color="green"
                            size="md"
                            startIcon={<Sparkles className="w-4 h-4" />}
                        >
                            Our Foundation
                        </TextBadge>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-6 mb-4">
                            Built on <span className="text-green-600">Excellence</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Committed to transforming agriculture through innovation and dedication
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Mission Card */}
                        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-3xl text-white shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <IconBadge
                                    icon={<Target className="w-8 h-8" />}
                                    variant="light"
                                    color="green"
                                    size="lg"
                                />
                                <h3 className="text-3xl font-bold">Our Mission</h3>
                            </div>
                            <p className="text-white/95 text-lg leading-relaxed">
                                To empower Nigerian farmers with premium agricultural solutions, cutting-edge technology, and expert knowledge for sustainable and profitable farming. We are committed to delivering quality products and services that enhance productivity and ensure food security.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-gradient-to-br border border-green-600 from-green-50 to-emerald-50 p-8 rounded-3xl text-green-600 shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <IconBadge
                                    icon={<Globe className="w-8 h-8" />}
                                    variant="solid"
                                    color="green"
                                    size="lg"
                                />
                                <h3 className="text-3xl font-bold">Our Vision</h3>
                            </div>
                            <p className="text-green-600 text-lg leading-relaxed">
                                To become Africa's leading agribusiness enterprise, driving agricultural transformation through innovation, research, and unwavering commitment to farmer success. We envision a future where every farmer has access to world-class agricultural solutions.
                            </p>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES_DATA.map((value, index) => (
                            <ValueCard key={index} {...value} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20">
                <div className="mx-auto">
                    <div className="text-center mb-16">
                        <TextBadge
                            variant="light"
                            color="green"
                            size="md"
                            startIcon={<Sparkles className="w-4 h-4" />}
                        >
                            What We Offer
                        </TextBadge>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-6 mb-4">
                            Our <span className="text-green-600">Services</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Comprehensive agricultural solutions designed to maximize your farm's potential
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {SERVICES_DATA.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </>
    );
}

