import React from 'react';
import { Sprout, Droplets, Home, Shield, Tractor, Package, Leaf, Layers, Sun, Bug, ShoppingCart, CheckCircle, Warehouse, Truck } from 'lucide-react';
import IconBadge from '../ui/IconBadge';

export default function AgriCourt() {
    const productCategories = [
        {
            icon: <Sprout />,
            title: "Premium Seeds",
            description: "High-quality, certified seeds for maximum germination and yield potential across diverse crop varieties"
        },
        {
            icon: <Droplets />,
            title: "Fertilizer Solutions",
            description: "Granular and water-soluble fertilizers scientifically formulated for optimal nutrient delivery"
        },
        {
            icon: <Home />,
            title: "Greenhouse Systems",
            description: "Modern and locally adapted greenhouses, net houses, covers, shade nets, and insect protection"
        },
        {
            icon: <Layers />,
            title: "Growing Media",
            description: "Premium Cocopeat, Peat moss, and Worm compost for superior plant growth and root development"
        },
        {
            icon: <Package />,
            title: "Planting Accessories",
            description: "Seedling trays, mulch film, and grow bags designed for efficient cultivation practices"
        },
        {
            icon: <Droplets />,
            title: "Irrigation Systems",
            description: "Advanced water management solutions for efficient and sustainable crop production"
        },
        {
            icon: <Shield />,
            title: "Crop Protection",
            description: "High-quality pesticides, herbicides, and fungicides to safeguard your investment"
        },
        {
            icon: <Tractor />,
            title: "Farm Machinery",
            description: "Tractors, implements, and agricultural machines for modern farming operations"
        }
    ];

    const features = [
        {
            icon: <CheckCircle />,
            title: "Research-Backed Products",
            description: "Every product undergoes rigorous testing and validation in our research facility"
        },
        {
            icon: <Warehouse />,
            title: "Quality Assurance",
            description: "All inputs meet international standards and local agricultural requirements"
        },
        {
            icon: <Truck />,
            title: "Nationwide Delivery",
            description: "Efficient distribution network ensuring timely product availability"
        },
        {
            icon: <ShoppingCart />,
            title: "Competitive Pricing",
            description: "Premium quality products at prices that work for Nigerian farmers"
        }
    ];

    const highlights = [
        "High-quality certified seeds",
        "Granular & water-soluble fertilizers",
        "Modern irrigation systems",
        "Cocopeat, Peat moss & Worm compost",
        "Seedling trays & grow bags",
        "Mulch film & greenhouse covers",
        "Shade nets & insect nets",
        "Tractors & farm implements",
        "Crop protection products",
        "Locally adapted structures"
    ];

    return (
        <>
            {/* Quick Highlights Grid */}
            <div className="bg-white rounded-xl shadow p-6 sm:p-8 md:p-10  border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                    <Package className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl md:text-xl font-bold text-gray-900">
                        Comprehensive Product Portfolio
                    </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {highlights.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-2 bg-green-50 rounded-xl p-3 border border-green-100 hover:border-green-300 transition-colors"
                        >
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs md:text-sm text-gray-700 font-medium leading-tight">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Categories */}
            <div className="">
                <div className="text-center mb-12">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-green-600">Product Categories</span>
                    </h3>
                    <p className="text-gray-600 text-lg mx-auto">
                        Quality inputs for every stage of agricultural production
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productCategories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow transition-all duration-300 hover:-translate-y-1 border border-green-100"
                        >
                            <IconBadge size='lg' color='green' className='mb-4' icon={category.icon} />

                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {category.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {category.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Section */}
            <div className="bg-white rounded-xl shadow p-6 sm:p-8 md:p-12  border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                    <Sprout className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Complete Agricultural Solutions
                    </h3>
                </div>

                <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
                    <p>
                        <strong>AgriCourt Ventures</strong> represents our commitment to empowering Nigerian
                        farmers with access to <strong>world-class agricultural inputs</strong>. Our extensive
                        product line includes everything from <strong>high-quality certified seeds</strong> and
                        <strong> advanced fertilizer solutions</strong> (both granular and water-soluble) to
                        cutting-edge <strong>irrigation systems</strong> that optimize water usage and boost
                        crop productivity.
                    </p>

                    <p>
                        We specialize in <strong>growing media solutions</strong> including premium Cocopeat,
                        Peat moss, and nutrient-rich Worm compost that create ideal conditions for plant
                        development. Our range of <strong>planting accessories</strong>—seedling trays, mulch
                        film, and grow bags—enables efficient and professional cultivation practices suitable
                        for both small-scale and commercial farming operations.
                    </p>

                    <p>
                        Understanding Nigeria's unique agricultural context, we offer <strong>modern yet locally
                            adapted greenhouse and net house systems</strong>, complete with specialized covers,
                        shade nets, and insect protection nets. These structures provide controlled growing
                        environments that extend growing seasons and protect crops from environmental stresses.
                    </p>

                    <p>
                        Our <strong>crop protection portfolio</strong> features high-quality pesticides,
                        herbicides, and fungicides that safeguard investments against pests and diseases. For
                        mechanization needs, we supply <strong>tractors, implements, and agricultural machinery</strong>
                        that modernize farming operations and improve efficiency across all farm sizes.
                    </p>

                    <p>
                        Every product in the AgriCourt Ventures catalog has been <strong>researched, tested,
                            and validated</strong> to meet the specific needs of Nigerian agriculture, ensuring
                        farmers receive inputs that deliver real results and maximum return on investment.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="">
                <div className="text-center mb-12">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose <span className="text-green-600">AgriCourt Ventures</span>
                    </h3>
                    <p className="text-gray-600 text-lg mx-auto">
                        More than just products—a partnership for agricultural success
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow transition-all duration-300 hover:-translate-y-1 border border-green-100"
                        >
                            <IconBadge size='lg' color='green' className='mb-4' icon={feature.icon} />

                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 sm:p-10 md:p-12 text-white shadow">
                <div className="mx-auto">
                    <div className="flex items-start gap-4 mb-6">
                        <ShoppingCart className="w-12 h-12 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                                Equip Your Farm for Success
                            </h3>
                            <p className="text-base sm:text-lg leading-relaxed text-green-50 mb-6">
                                From seeds to harvest, from planting to protection, from irrigation to mechanization—
                                AgriCourt Ventures provides the complete range of <strong>quality agricultural inputs</strong>
                                that Nigerian farmers need to thrive. Our products combine <strong>international quality
                                    standards</strong> with <strong>local adaptation</strong>, ensuring they perform optimally
                                in Nigeria's diverse agricultural zones.
                            </p>
                            <p className="text-base sm:text-lg leading-relaxed text-green-50">
                                Join thousands of successful farmers who rely on AgriCourt Ventures for their input needs.
                                Experience the difference that research-backed, quality-assured agricultural products can
                                make in your farming operation.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold mb-1">500+</div>
                            <div className="text-sm text-green-100">Quality Products</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold mb-1">8</div>
                            <div className="text-sm text-green-100">Product Categories</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold mb-1">100%</div>
                            <div className="text-sm text-green-100">Quality Tested</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold mb-1">24/7</div>
                            <div className="text-sm text-green-100">Support Available</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}