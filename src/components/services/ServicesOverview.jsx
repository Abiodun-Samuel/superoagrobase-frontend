import Link from 'next/link';
import { ArrowRight, FlaskConical, ShoppingBag, Sprout } from 'lucide-react';

const ServicesOverview = () => {
    const services = [
        {
            icon: FlaskConical,
            title: 'Agro-Input Authentication & Research',
            description: 'Protecting farmers from adulterated products through rigorous testing and quality authentication of SON and NAFDAC approved agricultural inputs.',
            features: [
                '3-hectare research facility',
                'Real farming condition testing',
                'Manufacturer claims verification',
                '10,000+ farmer network'
            ],
            href: '/services/agro-input',
            color: 'bg-blue-500'
        },
        {
            icon: ShoppingBag,
            title: 'AgriCourt Ventures',
            description: 'Quality agricultural input products including seeds, fertilizers, irrigation systems, greenhouses, crop protection, and farm machinery.',
            features: [
                'Premium quality seeds',
                'Complete irrigation systems',
                'Protected cultivation solutions',
                'Nationwide delivery'
            ],
            href: '/services/agricourt-ventures',
            color: 'bg-green-500'
        },
        {
            icon: Sprout,
            title: 'HarvestYield Farm',
            description: '10-hectare farm producing premium vegetables with professional farm management, consultancy, and laboratory services.',
            features: [
                'Premium vegetable production',
                'Farm management services',
                'Agricultural consultancy',
                'Soil & fertilizer analysis'
            ],
            href: '/services/harvestyield-farm',
            color: 'bg-amber-500'
        }
    ];

    return (
        <section className="space-y-10 my-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={service.title}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            <div className="p-8">
                                <div className={`${service.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                    {service.title}
                                </h2>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {service.features.map((feature, index) => (
                                        <li key={index} className="flex items-start text-sm text-gray-700">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={service.href}
                                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 group-hover:gap-3 gap-2 transition-all"
                                >
                                    Learn More
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Need Help Choosing the Right Service?
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Our agricultural experts are here to guide you. Contact us for personalized recommendations based on your specific farming needs.
                </p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    Contact Our Experts
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    );
};

export default ServicesOverview;