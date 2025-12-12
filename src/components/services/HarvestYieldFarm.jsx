import React from 'react';
import { Leaf, MapPin, Users, FlaskConical, TrendingUp, CheckCircle, Sprout, Apple, Waves, Sun, Award, Target, LineChart, Microscope, AppleIcon } from 'lucide-react';
import IconBadge from '../ui/IconBadge';

export default function HarvestYieldFarm() {
    const crops = [
        {
            icon: <AppleIcon />,
            name: "Tomato",
            description: "Premium quality tomatoes grown with precision agriculture techniques"
        },
        {
            icon: <Sprout />,
            name: "Cucumber",

            description: "Fresh, crisp cucumbers cultivated under optimal growing conditions"
        },
        {
            icon: <Sun />,
            name: "Sweetcorn",
            description: "Sweet, tender corn varieties selected for superior taste and texture"
        },
        {
            icon: <Waves />,
            name: "Special Watermelon",
            description: "Specially bred watermelon varieties with exceptional sweetness"
        },
        {
            icon: <Leaf />,
            name: "Pepper",
            description: "High-quality pepper varieties for diverse culinary applications"
        }
    ];

    const services = [
        {
            icon: <Users />,
            title: "Farm Management",
            description: "Professional farm management services leveraging best practices and modern techniques"
        },
        {
            icon: <Target />,
            title: "Agricultural Consultancy",
            description: "Expert guidance on crop selection, planning, and optimization strategies"
        },
        {
            icon: <FlaskConical />,
            title: "Soil Analysis",
            description: "Comprehensive soil testing to determine nutrient levels and pH balance"
        },
        {
            icon: <Microscope />,
            title: "Laboratory Services",
            description: "Fertilizer and manure analysis through partnerships with reputable labs"
        }
    ];

    const stats = [
        {
            icon: <MapPin />,
            value: "10",
            unit: "Hectares",
            label: "Productive Farmland"
        },
        {
            icon: <Sprout />,
            value: "5",
            unit: "Crops",
            label: "Premium Vegetables"
        },
        {
            icon: <Award />,
            value: "100%",
            unit: "Quality",
            label: "Guaranteed"
        },
        {
            icon: <LineChart />,
            value: "Year-Round",
            unit: "Production",
            label: "Continuous Supply"
        }
    ];

    return (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow border border-green-100 text-center hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex justify-center mb-3">
                            <IconBadge size='lg' color='green' icon={stat.icon} />
                        </div>
                        <div className="text-xl md:text-xl font-bold text-gray-900 mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm font-semibold text-green-600 mb-1">
                            {stat.unit}
                        </div>
                        <div className="text-xs text-gray-600">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Crops Section */}
            <div className="">
                <div className="text-center mb-12">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-green-600">Premium Crops</span>
                    </h3>
                    <p className="text-gray-600 text-lg mx-auto">
                        Five specially selected vegetable varieties grown with precision and care
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {crops.map((crop, index) => (
                        <div
                            key={index}
                            className={`bg-green-50 rounded-xl p-6 border-2 border-green-200 hover:shadow transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className={`bg-gradient-to-br from-green-500 to-green-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white`}>
                                {React.cloneElement(crop.icon, { className: 'w-5 h-5' })}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {crop.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {crop.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Section */}
            <div className="bg-white rounded-xl shadow p-6 sm:p-8 md:p-12  border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Modern Vegetable Production Excellence
                    </h3>
                </div>

                <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
                    <p>
                        <strong>HarvestYield Farm</strong> operates on a <strong>10-hectare agricultural
                            facility</strong> dedicated to the production of premium vegetable crops. Our farm
                        specializes in five high-demand vegetables: <strong>Tomato, Cucumber, Sweetcorn,
                            Special Watermelon, and Pepper</strong>—each cultivated using advanced agricultural
                        techniques and sustainable farming practices.
                    </p>

                    <p>
                        We combine <strong>traditional farming wisdom with modern agricultural science</strong>
                        to maximize yield, quality, and nutritional value. Our production system emphasizes
                        soil health, water conservation, and integrated pest management to ensure that every
                        crop meets the highest standards of quality and food safety.
                    </p>

                    <p>
                        Beyond crop production, HarvestYield Farm provides <strong>comprehensive farm management
                            and consultancy services</strong> to help other farmers optimize their operations. Our
                        team of experienced agronomists works closely with clients to develop customized
                        strategies for improved productivity and profitability.
                    </p>

                    <p>
                        Through strategic partnerships with <strong>reputable agricultural laboratories</strong>,
                        we offer essential services including <strong>soil analysis, fertilizer testing, and
                            manure composition analysis</strong>. These laboratory services provide critical data
                        that guides fertilization programs, soil amendment strategies, and overall crop
                        nutrition management—key factors for successful vegetable production.
                    </p>

                    <p>
                        Our <strong>science-based approach</strong> ensures that growing decisions are informed
                        by accurate data rather than guesswork, leading to more efficient resource utilization,
                        reduced input costs, and consistently superior crop quality that meets market demands.
                    </p>
                </div>
            </div>

            {/* Services Section */}
            <div className="">
                <div className="text-center mb-12">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-green-600">Professional Services</span>
                    </h3>
                    <p className="text-gray-600 text-lg mx-auto">
                        Comprehensive support for successful vegetable cultivation
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow transition-all duration-300 hover:-translate-y-1 border border-green-100"
                        >
                            <IconBadge size='lg' color='green' className='mb-4' icon={service.icon} />

                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 sm:p-10 md:p-12 text-white shadow">
                <div className="mx-auto">
                    <div className="flex items-start gap-4 mb-6">
                        <TrendingUp className="w-12 h-12 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                                Partner with Agricultural Excellence
                            </h3>
                            <p className="text-base sm:text-lg leading-relaxed text-green-50 mb-6">
                                Whether you're looking for <strong>premium quality vegetables</strong>, need
                                <strong> professional farm management services</strong>, or require <strong>laboratory
                                    analysis</strong> for your agricultural operations, HarvestYield Farm delivers
                                reliable solutions backed by expertise and proven results.
                            </p>
                            <p className="text-base sm:text-lg leading-relaxed text-green-50">
                                Our <strong>10-hectare demonstration farm</strong> showcases what's possible with
                                proper planning, scientific approach, and commitment to quality. We're not just
                                growing vegetables—we're cultivating success stories and building Nigeria's
                                agricultural future, one harvest at a time.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                            <div className="text-sm text-green-100">Quality Produce</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                            <div className="text-sm text-green-100">Expert Guidance</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                            <div className="text-sm text-green-100">Lab Services</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                            <div className="text-sm text-green-100">Proven Results</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}