import { Shield, Award, Users, Search, TestTube, TrendingUp, Sprout, Building2 } from 'lucide-react';
import IconBadge from '../ui/IconBadge';

export default function AgroInputSection() {
    const features = [
        {
            icon: Shield,
            title: "Quality Authentication",
            description: "Rigorous verification of manufacturer claims for SON and NAFDAC approved products"
        },
        {
            icon: TestTube,
            title: "Research Excellence",
            description: "Advanced testing on our 3-hectare research facility with controlled trials"
        },
        {
            icon: Users,
            title: "10,000+ Farmers Network",
            description: "Direct access to a verified database of small-scale and commercial farmers"
        },
        {
            icon: TrendingUp,
            title: "Product Promotion",
            description: "Strategic brand promotion to reach the right agricultural market"
        }
    ];

    const process = [
        {
            icon: Search,
            title: "Problem Identification",
            description: "We analyze agricultural production challenges and farmer pain points"
        },
        {
            icon: TestTube,
            title: "Product Research",
            description: "Comprehensive testing to validate manufacturer claims and product efficacy"
        },
        {
            icon: Award,
            title: "Quality Certification",
            description: "Authentication of products meeting SON and NAFDAC standards"
        },
        {
            icon: Building2,
            title: "Nationwide Distribution",
            description: "Product availability through our extensive dealer network"
        }
    ];

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow transition-all duration-300 hover:-translate-y-1 border border-green-100"
                    >
                        <IconBadge size='lg' color='green' className='mb-2' icon={<feature.icon />} />

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Main Content Section */}
            <div className="bg-white rounded-xl shadow p-6 sm:p-8 md:p-12 border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                    <Sprout className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Our Commitment to Agricultural Excellence
                    </h3>
                </div>

                <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
                    <p>
                        The agricultural sector faces a critical challenge: <strong>adulterated and low-quality
                            inputs</strong> that devastate farm yields for both small-scale and commercial farmers.
                        The financial losses are staggering, with countless farmers losing their investments to
                        substandard fertilizers, pesticides, and seeds that fail to deliver promised results.
                    </p>

                    <p>
                        We stand as <strong>guardians of agricultural quality</strong>, authenticating manufacturer
                        claims on agro-input products through rigorous scientific research. Our state-of-the-art
                        <strong> 3-hectare research facility</strong> serves as a testing ground where products are
                        evaluated under real farming conditions before reaching our network of over <strong>10,000
                            registered farmers</strong> (as of December 2020).
                    </p>

                    <p>
                        Our comprehensive approach ensures that only <strong>verified, high-quality agricultural
                            inputs</strong> reach Nigerian farmers, protecting investments and maximizing crop yields
                        across the nation.
                    </p>
                </div>
            </div>

            {/* Process Section */}
            <div className="">
                <div className="text-center mb-12">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Proven <span className="text-green-600">Quality Assurance Process</span>
                    </h3>
                    <p className="text-gray-600 text-lg mx-auto">
                        From identification to distribution, we ensure every product meets the highest standards
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {process.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 h-full border-2 border-green-200 hover:border-green-400 transition-all duration-300">
                                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-4">
                                    {index + 1}
                                </div>
                                <step.icon className="w-10 h-10 text-green-600 mb-4" />
                                <h4 className="text-lg font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                            {index < process.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-green-300" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Value Proposition */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 sm:p-10 md:p-12 text-white shadow">
                <div className="mx-auto">
                    <div className="flex items-start gap-4 mb-6">
                        <Award className="w-12 h-12 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                                Nationwide Network, Local Trust
                            </h3>
                            <p className="text-base sm:text-lg leading-relaxed text-green-50 mb-6">
                                We identify agricultural production challenges, research effective solutions,
                                conduct comprehensive trials to verify manufacturer claims, and promote authenticated
                                products to our extensive farmer network. Through our nationwide agro-input dealer
                                network, we ensure that <strong>quality-verified products</strong> are accessible
                                to farmers across Nigeria.
                            </p>
                            <p className="text-base sm:text-lg leading-relaxed text-green-50">
                                Join thousands of farmers who trust our research-backed recommendations for
                                fertilizers, pesticides, herbicides, seeds, and all agricultural inputs. Together,
                                we're building a more productive and sustainable agricultural future.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold mb-1">3ha</div>
                            <div className="text-sm text-green-100">Research Facility</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold mb-1">10,000+</div>
                            <div className="text-sm text-green-100">Registered Farmers</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold mb-1">100%</div>
                            <div className="text-sm text-green-100">Quality Verified</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}