'use client'
import React, { useState, useMemo } from 'react';
import { FAQ_CATEGORIES, FAQ_DATA, SITE_DATA } from '@/utils/data';
import IconBadge from '../ui/IconBadge';
import { ChevronDown, Headphones, Mail, MapPin, MessageCircle, Phone, Shield, Truck } from 'lucide-react';


const replacePlaceholders = (text) => {
    return text
        .replace(/{phone}/g, SITE_DATA.phone)
        .replace(/{email}/g, SITE_DATA.email)
        .replace(/{address}/g, SITE_DATA.address.full);
};

// Helper function to format answer text with proper structure
const formatAnswer = (answer) => {
    const formattedText = replacePlaceholders(answer);
    const parts = formattedText.split('\n\n');

    return parts.map((part, index) => {
        // Check if it's a list (starts with bullet or number)
        if (part.includes('\n•') || part.includes('\n1.') || part.includes('\n2.')) {
            const [intro, ...listItems] = part.split('\n');
            return (
                <div key={index}>
                    {intro && <p className="mb-2">{intro}</p>}
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        {listItems.map((item, i) => (
                            <li key={i}>{item.replace(/^[•\d.]\s*/, '')}</li>
                        ))}
                    </ul>
                </div>
            );
        }

        // Check if it's a numbered list
        if (/^\d+\./.test(part)) {
            const listItems = part.split('\n');
            return (
                <ol key={index} className="list-decimal list-inside space-y-1 ml-2">
                    {listItems.map((item, i) => (
                        <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                </ol>
            );
        }

        // Regular paragraph with potential bold text
        const boldPattern = /\*\*(.*?)\*\*/g;
        const textWithBold = part.split(boldPattern).map((text, i) =>
            i % 2 === 0 ? text : <strong key={i}>{text}</strong>
        );

        return <p key={index} className={index < parts.length - 1 ? 'mb-3' : ''}>{textWithBold}</p>;
    });
};

const FAQItem = ({ question, answer, isOpen, onClick, Icon }) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-500 transition-all duration-300">
            <button
                onClick={onClick}
                className="w-full px-6 py-4 flex items-start justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <div className="flex items-start gap-3 text-left flex-1">
                    {Icon && <Icon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />}
                    <span className="font-normal text-gray-900 text-base">{question}</span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-green-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px]' : 'max-h-0'
                    }`}
            >
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-gray-700 leading-relaxed space-y-2">
                        {formatAnswer(answer)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategorySection = ({ title, description, Icon, children }) => {
    return (
        <div className="mb-12">
            <div className="flex items-start gap-3 mb-6">
                {Icon && <IconBadge size='xl' color='green' icon={<Icon />} />}
                <div>
                    <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
};

const ContactCard = ({ Icon, title, content, link }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center text-center flex-col gap-2">
                {Icon && <IconBadge icon={<Icon />} size='lg' color='green' shape='circle' />}
                <div>
                    <h3 className="font-medium text-gray-900">{title}</h3>
                    {link ? (
                        <a href={link} className="text-green-600 hover:text-green-700">{content}</a>
                    ) : (
                        <p className="text-gray-700">{content}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState({});

    const toggleFAQ = (category, index) => {
        setOpenIndex(prev => ({
            ...prev,
            [`${category}-${index}`]: !prev[`${category}-${index}`]
        }));
    };

    // Group FAQs by category
    const groupedFAQs = useMemo(() => {
        return FAQ_CATEGORIES.map(category => ({
            ...category,
            faqs: FAQ_DATA?.faqsPAGE?.filter(faq => faq.faqType === category.key) || []
        }));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section - unchanged */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 md:py-24 rounded-lg">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg md:text-xl text-green-50 max-w-3xl mx-auto mb-8">
                            Find answers to common questions about ordering, payment, delivery, products, and more. We're here to help you succeed.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href={SITE_DATA.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-200"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Chat on WhatsApp
                            </a>
                            <a
                                href={`tel:${SITE_DATA.phone}`}
                                className="inline-flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-900 transition-colors duration-200"
                            >
                                <Phone className="w-5 h-5" />
                                Call Us Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
                {groupedFAQs.map((category) => (
                    <CategorySection
                        key={category.key}
                        title={category.title}
                        description={category.description}
                        Icon={category.icon}
                    >
                        {category.faqs?.map((faq, index) => (
                            <FAQItem
                                key={`${category.key}-${index}`}
                                question={faq.question}
                                answer={faq.answer}
                                Icon={faq.icon}
                                isOpen={openIndex[`${category.key}-${index}`]}
                                onClick={() => toggleFAQ(category.key, index)}
                            />
                        ))}
                    </CategorySection>
                ))}
            </section>

            {/* Still Have Questions */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 rounded-lg">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto">
                            Our team is ready to help you. Reach out through any of these channels and we'll respond quickly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ContactCard
                            Icon={MessageCircle}
                            title="WhatsApp"
                            content="Chat with us instantly"
                            link={SITE_DATA.whatsapp}
                        />
                        <ContactCard
                            Icon={Phone}
                            title="Call Us"
                            content={SITE_DATA.phone}
                            link={`tel:${SITE_DATA.phone}`}
                        />
                        <ContactCard
                            Icon={Mail}
                            title="Email"
                            content={SITE_DATA.email}
                            link={`mailto:${SITE_DATA.email}`}
                        />
                        <ContactCard
                            Icon={MapPin}
                            title="Visit Us"
                            content={`${SITE_DATA.address.city}, ${SITE_DATA.address.state}`}
                        />
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <IconBadge className='mb-1' icon={<Shield />} size='xl' shape='circle' color='green' />
                            <h3 className="text-xl font-bold text-gray-900 mb-1">100% Genuine Products</h3>
                            <p className="text-gray-600">All products sourced from authorized manufacturers and certified distributors</p>
                        </div>
                        <div className="text-center">
                            <IconBadge className='mb-1' icon={<Truck />} size='xl' shape='circle' color='green' />
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Fast Nationwide Delivery</h3>
                            <p className="text-gray-600">Reliable delivery to all 36 states with tracking support</p>
                        </div>
                        <div className="text-center">
                            <IconBadge className='mb-1' icon={<Headphones />} size='xl' shape='circle' color='green' />
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Expert Support</h3>
                            <p className="text-gray-600">Free agricultural consultancy and technical assistance</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}