'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Sprout,
    Mail,
    Phone,
    MapPin,
    Send,
    ChevronRight,
    CheckCircle,
    ArrowUp,
    Heart
} from 'lucide-react';
import { footerData } from '@/utils/data';

// Main Footer Component
const Footer = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail('');
            }, 3000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-gray-300 overflow-x-hidden!">
            {/* Newsletter Section */}
            <NewsletterSection
                email={email}
                setEmail={setEmail}
                isSubmitted={isSubmitted}
                onSubmit={handleNewsletterSubmit}
            />

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Company Info - Larger Column */}
                    <div className="lg:col-span-4">
                        <CompanyInfo data={footerData.company} />
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <FooterColumn title="Quick Links" links={footerData.links.quickLinks} />
                    </div>

                    {/* Customer Service */}
                    <div className="lg:col-span-2">
                        <FooterColumn title="Customer Service" links={footerData.links.customerService} />
                    </div>

                    {/* Shop */}
                    <div className="lg:col-span-2">
                        <FooterColumn title="Shop" links={footerData.links.shop} />
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <FooterColumn title="Legal" links={footerData.links.legal} />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-8 lg:my-12"></div>

                {/* Bottom Section */}
                <BottomSection
                    social={footerData.social}
                    paymentMethods={footerData.paymentMethods}
                    companyName={footerData.company.name}
                />
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white rounded-full shadow-2xl hover:shadow-[#7CB342]/50 hover:scale-110 transition-all duration-300 group"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </footer>
    );
};

// Newsletter Section Component
const NewsletterSection = ({ email, setEmail, isSubmitted, onSubmit }) => (
    <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                {/* Left Side - Text */}
                <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
                        <Mail className="text-[#7CB342]" size={32} />
                        Subscribe to Our Newsletter
                    </h3>
                    <p className="text-gray-400 text-sm lg:text-base">
                        Get the latest updates on products, exclusive offers, and farming tips delivered to your inbox.
                    </p>
                </div>

                {/* Right Side - Newsletter Input */}
                <div className="w-full lg:w-auto lg:min-w-[400px]">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && onSubmit(e)}
                            placeholder="Enter your email address"
                            className="w-full px-6 py-4 pr-32 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-[#7CB342] focus:ring-2 focus:ring-[#7CB342]/20 transition-all duration-300"
                        />
                        <button
                            onClick={onSubmit}
                            disabled={isSubmitted}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white rounded-full font-semibold hover:shadow-lg hover:shadow-[#7CB342]/30 transition-all duration-300 disabled:opacity-70 flex items-center space-x-2"
                        >
                            {isSubmitted ? (
                                <>
                                    <CheckCircle size={18} />
                                    <span className="hidden sm:inline">Subscribed!</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span className="hidden sm:inline">Subscribe</span>
                                </>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center lg:text-left">
                        🔒 We respect your privacy. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// Company Info Component
const CompanyInfo = ({ data }) => (
    <div className="space-y-6">
        {/* Logo & Description */}
        <div>
            <Link href="/" className="inline-flex items-center space-x-3 group mb-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#7CB342] rounded-lg blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-[#7CB342] to-[#558B2F] p-3 rounded-lg">
                        <Sprout className="text-white" size={32} />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{data.name}</h2>
                    <p className="text-xs text-[#7CB342]">{data.tagline}</p>
                </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">{data.description}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h4>

            <a href={`mailto:${data.contact.email}`} className="flex items-start space-x-3 text-gray-400 hover:text-[#7CB342] transition-colors group">
                <Mail size={18} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{data.contact.email}</span>
            </a>

            <a href={`tel:${data.contact.phone}`} className="flex items-start space-x-3 text-gray-400 hover:text-[#7CB342] transition-colors group">
                <Phone size={18} className="mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{data.contact.phone}</span>
            </a>

            <div className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm">{data.contact.address}</span>
            </div>
        </div>
    </div>
);

// Footer Column Component
const FooterColumn = ({ title, links }) => (
    <div>
        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-6 pb-2 border-b border-gray-700">
            {title}
        </h4>
        <ul className="space-y-3">
            {links.map((link, index) => (
                <li key={index}>
                    <Link
                        href={link.href}
                        className="text-gray-400 hover:text-[#7CB342] text-sm transition-colors duration-200 flex items-center group"
                    >
                        <ChevronRight size={14} className="mr-1 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

// Bottom Section Component
const BottomSection = ({ social, paymentMethods, companyName }) => (
    <div className="space-y-8">
        {/* Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
                <div className="flex items-center space-x-3">
                    {social.map((platform, index) => {
                        const Icon = platform.icon;
                        return (
                            <a
                                key={index}
                                href={platform.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-gray-800 hover:bg-gradient-to-r hover:from-[#7CB342] hover:to-[#558B2F] text-gray-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#7CB342]/30 group"
                                aria-label={platform.name}
                            >
                                <Icon size={20} className="group-hover:rotate-12 transition-transform" />
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Payment Methods */}
            <div className="text-center sm:text-right">
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">We Accept</h4>
                <div className="flex items-center justify-center sm:justify-end space-x-3">
                    {paymentMethods.map((method, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                            title={method.name}
                        >
                            <span className="text-2xl group-hover:scale-110 inline-block transition-transform">{method.logo}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Copyright & Links */}
        <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                <p className="text-center md:text-left">
                    © {new Date().getFullYear()} {companyName}. All rights reserved.
                    <span className="inline-flex items-center ml-2 text-red-500">
                        Made with <Heart size={14} className="mx-1 fill-current" /> in Nigeria
                    </span>
                </p>

                <div className="flex items-center space-x-6">
                    <Link href="/sitemap" className="hover:text-[#7CB342] transition-colors">
                        Sitemap
                    </Link>
                    <span className="text-gray-700">|</span>
                    <Link href="/security" className="hover:text-[#7CB342] transition-colors">
                        Security
                    </Link>
                    <span className="text-gray-700">|</span>
                    <Link href="/privacy" className="hover:text-[#7CB342] transition-colors">
                        Privacy
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default Footer;