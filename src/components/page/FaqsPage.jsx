'use client'
import React, { useState, useMemo } from 'react';
import { FAQ_CATEGORIES, FAQ_DATA, SITE_DATA } from '@/utils/data';
import IconBadge from '../ui/IconBadge';
import { ChevronDown, Headphones, Shield, Truck } from 'lucide-react';


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
        <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-green-500 transition-all duration-300">
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
        <div className="min-h-screen space-y-10 my-10">
            {/* FAQ Categories */}
            <>
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

                <div className="grid md:grid-cols-3 gap-8 my-20">
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
            </>
        </div>
    );
}