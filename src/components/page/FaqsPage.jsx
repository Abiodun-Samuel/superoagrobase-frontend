'use client'
import React, { useState } from 'react';
import { ChevronDown, Package, CreditCard, Truck, Shield, Headphones, ShoppingCart, FileText, MapPin, Clock, Phone, Mail, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { SITE_DATA } from '@/utils/data';
import IconBadge from '../ui/IconBadge';

const FAQItem = ({ question, answer, isOpen, onClick, icon: Icon }) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-500 transition-all duration-300">
            <button
                onClick={onClick}
                className="w-full px-6 py-4 flex items-start justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={isOpen}
            >
                <div className="flex items-start gap-3 text-left flex-1">
                    {Icon && <Icon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />}
                    <span className="font-normal text-gray-900 text-base md:text-lg">{question}</span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-green-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px]' : 'max-h-0'}`}
            >
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-gray-700 leading-relaxed space-y-2">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategorySection = ({ title, description, icon: Icon, children }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <IconBadge size='xl' color='green' icon={<Icon />} />
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
};

const ContactCard = ({ icon: Icon, title, content, link }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center text-center flex-col gap-2">
                <IconBadge icon={<Icon />} size='lg' color='green' shape='circle' />
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

    const orderingFAQs = [
        {
            icon: ShoppingCart,
            question: "How do I place an order on SuperoAgrobase?",
            answer: (
                <div>
                    <p className="mb-2">Ordering from SuperoAgrobase is simple and straightforward:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Browse our extensive catalog of agricultural products including seeds, fertilizers, pesticides, herbicides, and farm equipment</li>
                        <li>Add your desired items to cart by clicking the "Add to Cart" button</li>
                        <li>Review your cart and proceed to checkout</li>
                        <li>Fill in your delivery address and contact information</li>
                        <li>Choose your preferred payment method</li>
                        <li>Confirm your order and receive an order confirmation via email or SMS</li>
                    </ol>
                    <p className="mt-2">You can also place orders via WhatsApp at {SITE_DATA.phone} or call us directly for personalized assistance.</p>
                </div>
            )
        },
        {
            icon: FileText,
            question: "Do I need to create an account to place an order?",
            answer: (
                <p>While you can browse our products without an account, we recommend creating one for a better shopping experience. With an account, you can track your orders, save your delivery addresses, access exclusive deals, view your purchase history, and enjoy faster checkout on future orders. Registration is quick, free, and takes less than 2 minutes.</p>
            )
        },
        {
            icon: AlertCircle,
            question: "What is the minimum order quantity or value?",
            answer: (
                <p>We welcome orders of all sizes at SuperoAgrobase. There is no minimum order quantity for most products. Whether you're a smallholder farmer needing a few packets of seeds or a large-scale commercial farmer requiring bulk quantities of fertilizers, we're here to serve you. For bulk orders above ₦500,000, please contact us for special pricing and dedicated support.</p>
            )
        },
        {
            icon: CheckCircle,
            question: "Can I modify or cancel my order after placing it?",
            answer: (
                <p>Yes, you can modify or cancel your order within 2 hours of placing it. Please contact our customer support team immediately via WhatsApp at {SITE_DATA.phone}, call us at {SITE_DATA.phone}, or email {SITE_DATA.email}. Once your order has been processed for dispatch, modifications may not be possible. We'll do our best to accommodate your request whenever feasible.</p>
            )
        }
    ];

    const paymentFAQs = [
        {
            icon: CreditCard,
            question: "What payment methods do you accept?",
            answer: (
                <div>
                    <p className="mb-2">SuperoAgrobase offers multiple secure payment options for your convenience:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Bank Transfer:</strong> Direct transfer to our company account</li>
                        <li><strong>Online Payment:</strong> Pay with your debit or credit card (Visa, Mastercard, Verve)</li>
                        <li><strong>Mobile Money:</strong> Payment via mobile wallets and USSD codes</li>
                        <li><strong>Payment on Delivery:</strong> Available for select locations (Lagos and Ogun State)</li>
                        <li><strong>POS Payment:</strong> Pay with your card upon delivery (where available)</li>
                    </ul>
                    <p className="mt-2">All online transactions are secured with industry-standard encryption to protect your financial information.</p>
                </div>
            )
        },
        {
            icon: Shield,
            question: "Is it safe to pay online on your website?",
            answer: (
                <p>Absolutely! Your security is our top priority. We use advanced SSL encryption and partner with trusted payment gateways to ensure your financial information is completely secure. We never store your complete card details on our servers. All transactions are processed through PCI-DSS compliant payment processors. You can shop with confidence knowing your data is protected at every step.</p>
            )
        },
        {
            icon: FileText,
            question: "Will I receive a receipt or invoice for my purchase?",
            answer: (
                <p>Yes, you will receive a detailed invoice for every purchase. An electronic invoice will be sent to your registered email address immediately after payment confirmation. For corporate customers requiring official receipts for accounting purposes, we can provide stamped company invoices upon request. All invoices include product details, quantities, prices, tax information, and our company details.</p>
            )
        },
        {
            icon: Clock,
            question: "How long does it take to confirm my payment?",
            answer: (
                <p>Online card payments are confirmed instantly. For bank transfers, confirmation typically takes between 10 minutes to 2 hours during banking hours (Monday to Friday, 8:00 AM - 5:00 PM). To speed up the process, please send your payment receipt via WhatsApp to {SITE_DATA.phone} or email it to {SITE_DATA.email} with your order number. Weekend or holiday transfers may take slightly longer to reflect.</p>
            )
        }
    ];

    const deliveryFAQs = [
        {
            icon: Truck,
            question: "Which locations do you deliver to?",
            answer: (
                <p>SuperoAgrobase provides fast nationwide delivery across all 36 states in Nigeria and the FCT. We have partnerships with reliable logistics companies to ensure your agricultural products reach you safely, whether you're in Lagos, Abuja, Port Harcourt, Kano, Ibadan, Kaduna, Onitsha, or any other location in Nigeria. Delivery times vary by location, with urban areas typically receiving orders faster than remote rural areas.</p>
            )
        },
        {
            icon: Clock,
            question: "How long will it take to receive my order?",
            answer: (
                <div>
                    <p className="mb-2">Delivery times depend on your location:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Lagos & Ogun State:</strong> 1-3 business days</li>
                        <li><strong>Major cities (Abuja, Port Harcourt, Ibadan, Kano):</strong> 3-5 business days</li>
                        <li><strong>Other states:</strong> 5-7 business days</li>
                        <li><strong>Remote locations:</strong> 7-10 business days</li>
                    </ul>
                    <p className="mt-2">Orders placed before 2:00 PM on weekdays are typically processed the same day. Weekend orders are processed on the next business day. You'll receive tracking information once your order is dispatched.</p>
                </div>
            )
        },
        {
            icon: Package,
            question: "How much does delivery cost?",
            answer: (
                <p>Delivery fees are calculated based on your location and the weight/size of your order. Rates start from as low as ₦1,500 for intra-city delivery in Lagos. The exact delivery cost will be displayed at checkout before you complete your order. We offer FREE DELIVERY on orders above ₦50,000 to select locations. For bulk orders, please contact us for special delivery rates and arrangements.</p>
            )
        },
        {
            icon: MapPin,
            question: "Can I track my order?",
            answer: (
                <p>Yes! Once your order is dispatched, you'll receive a tracking number via SMS and email. You can use this number to monitor your delivery status in real-time. You can also check your order status by logging into your account on our website. For immediate assistance with tracking, contact our customer support team via WhatsApp at {SITE_DATA.phone}.</p>
            )
        },
        {
            icon: AlertCircle,
            question: "What happens if I'm not available to receive my delivery?",
            answer: (
                <p>Our delivery partner will call you 30 minutes to 1 hour before arrival. If you're unavailable, you can arrange for someone else to receive the order on your behalf (please inform us in advance). Alternatively, we can reschedule delivery for another convenient day. Please note that additional delivery charges may apply for multiple delivery attempts. We recommend providing accurate contact information and being available on your chosen delivery date.</p>
            )
        }
    ];

    const productFAQs = [
        {
            icon: Shield,
            question: "Are all your products genuine and of good quality?",
            answer: (
                <p>Absolutely! At SuperoAgrobase, we guarantee 100% genuine products. All our agricultural inputs—including seeds, fertilizers, pesticides, herbicides, and equipment—are sourced directly from authorized manufacturers and certified distributors. We work with leading global and local brands to ensure you receive only authentic, high-quality products that meet international standards. Every product undergoes quality checks before dispatch. Your success as a farmer is our priority.</p>
            )
        },
        {
            icon: Package,
            question: "Do you sell both local and imported agricultural products?",
            answer: (
                <p>Yes, we offer a comprehensive selection of both locally-produced and imported agricultural products. Our inventory includes trusted Nigerian brands as well as internationally recognized products from leading manufacturers worldwide. Whether you prefer local varieties adapted to Nigerian conditions or specialized imported inputs for specific crops, we have you covered. All imported products meet Nigerian regulatory standards and have proper NAFDAC or regulatory approvals.</p>
            )
        },
        {
            icon: FileText,
            question: "Can I get technical advice on which products to use for my farm?",
            answer: (
                <p>Yes! SuperoAgrobase offers free agricultural consultancy services to help you make informed decisions. Our team of experienced agronomists can provide recommendations on the best seeds, fertilizers, pesticides, and herbicides for your specific crops, soil type, and farming conditions. Contact us via WhatsApp at {SITE_DATA.phone}, call {SITE_DATA.phone}, or email {SITE_DATA.email} to speak with our agricultural experts. We're committed to supporting your farming success beyond just selling products.</p>
            )
        },
        {
            icon: CheckCircle,
            question: "Do your products come with usage instructions?",
            answer: (
                <p>Yes, all our products come with detailed usage instructions and application guidelines. For pesticides, herbicides, and fertilizers, we provide clear dosage recommendations, safety precautions, and application methods. Seeds come with planting instructions including spacing, depth, and growing conditions. For any questions about product usage, our agricultural experts are always available to provide guidance and support. Safety first—always read and follow product labels.</p>
            )
        }
    ];

    const returnFAQs = [
        {
            icon: Shield,
            question: "What is your return and refund policy?",
            answer: (
                <div>
                    <p className="mb-2">We want you to be completely satisfied with your purchase. Our return policy includes:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Products can be returned within 7 days of delivery if unused and in original packaging</li>
                        <li>Damaged or defective products are eligible for immediate replacement or full refund</li>
                        <li>Wrong items delivered will be replaced at no extra cost to you</li>
                        <li>Perishable items like seeds must be reported within 24 hours of delivery</li>
                    </ul>
                    <p className="mt-2">To initiate a return, contact our customer support with your order number and photos of the product. Approved returns are processed within 7-14 business days.</p>
                </div>
            )
        },
        {
            icon: Package,
            question: "What should I do if I receive a damaged or wrong product?",
            answer: (
                <p>We sincerely apologize if this happens. Please contact us immediately via WhatsApp at {SITE_DATA.phone}, call {SITE_DATA.phone}, or email {SITE_DATA.email} with your order number and clear photos of the damaged or wrong product. Do not open or use the product. Our team will arrange for collection and send you the correct product or a replacement at no additional cost. Your satisfaction is our priority, and we'll resolve the issue promptly.</p>
            )
        },
        {
            icon: CreditCard,
            question: "How long does it take to receive a refund?",
            answer: (
                <p>Once your return is approved and we receive the product back, refunds are processed within 7-14 business days. The refund will be credited to the original payment method you used. For bank transfers, the funds will reflect in your account within 3-5 business days after processing. For card payments, it may take 7-14 business days depending on your bank. You'll receive a confirmation email once the refund is processed.</p>
            )
        }
    ];

    const supportFAQs = [
        {
            icon: Headphones,
            question: "How can I contact customer support?",
            answer: (
                <div>
                    <p className="mb-2">Our dedicated customer support team is here to help you. Contact us through any of these channels:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>WhatsApp:</strong> {SITE_DATA.phone} (Fastest response)</li>
                        <li><strong>Phone:</strong> {SITE_DATA.phone} (Monday to Saturday, 8:00 AM - 6:00 PM)</li>
                        <li><strong>Email:</strong> {SITE_DATA.email} (24/7, response within 24 hours)</li>
                        <li><strong>Visit us:</strong> {SITE_DATA.address.full}</li>
                    </ul>
                    <p className="mt-2">We typically respond to WhatsApp messages within minutes during business hours. For urgent matters, calling is recommended.</p>
                </div>
            )
        },
        {
            icon: Clock,
            question: "What are your business hours?",
            answer: (
                <div>
                    <p className="mb-2">SuperoAgrobase operates at the following hours:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Monday to Friday:</strong> 8:00 AM - 6:00 PM</li>
                        <li><strong>Saturday:</strong> 9:00 AM - 4:00 PM</li>
                        <li><strong>Sunday:</strong> Closed</li>
                    </ul>
                    <p className="mt-2">You can place orders online 24/7 through our website. Orders placed outside business hours will be processed the next business day. Our WhatsApp line is monitored during business hours for quick responses.</p>
                </div>
            )
        },
        {
            icon: MapPin,
            question: "Can I visit your physical store or warehouse?",
            answer: (
                <p>Yes, you're welcome to visit our store in Ikorodu, Lagos! Our address is {SITE_DATA.address.full}. You can inspect products, place orders in person, and receive expert advice from our agricultural specialists. We recommend calling ahead at {SITE_DATA.phone} or sending a WhatsApp message to ensure we have your desired products in stock. Our team will be happy to assist you with all your agricultural needs.</p>
            )
        },
        {
            icon: FileText,
            question: "Do you offer bulk purchase discounts for large orders?",
            answer: (
                <p>Yes! We provide attractive discounts for bulk purchases and are committed to supporting large-scale farmers and agro-dealers. The discount rate depends on the quantity and product category. For orders exceeding ₦200,000, please contact our sales team at {SITE_DATA.phone} or {SITE_DATA.email} to discuss special pricing, payment terms, and dedicated logistics support. We also offer flexible payment plans for registered commercial farmers and agricultural cooperatives.</p>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
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
            <section className="max-w-6xl mx-auto py-16">
                {/* Ordering & Account */}
                <CategorySection
                    title="Ordering & Account"
                    description="Learn how to place orders and manage your account"
                    icon={ShoppingCart}
                >
                    {orderingFAQs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            {...faq}
                            isOpen={openIndex[`ordering-${index}`]}
                            onClick={() => toggleFAQ('ordering', index)}
                        />
                    ))}
                </CategorySection>

                {/* Payment */}
                <CategorySection
                    title="Payment & Billing"
                    description="Information about payment methods and security"
                    icon={CreditCard}
                >
                    {paymentFAQs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            {...faq}
                            isOpen={openIndex[`payment-${index}`]}
                            onClick={() => toggleFAQ('payment', index)}
                        />
                    ))}
                </CategorySection>

                {/* Delivery */}
                <CategorySection
                    title="Delivery & Shipping"
                    description="Everything about our delivery process"
                    icon={Truck}
                >
                    {deliveryFAQs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            {...faq}
                            isOpen={openIndex[`delivery-${index}`]}
                            onClick={() => toggleFAQ('delivery', index)}
                        />
                    ))}
                </CategorySection>

                {/* Products */}
                <CategorySection
                    title="Products & Quality"
                    description="Information about our agricultural products"
                    icon={Package}
                >
                    {productFAQs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            {...faq}
                            isOpen={openIndex[`product-${index}`]}
                            onClick={() => toggleFAQ('product', index)}
                        />
                    ))}
                </CategorySection>

                {/* Returns */}
                <CategorySection
                    title="Returns & Refunds"
                    description="Our return policy and refund process"
                    icon={Shield}
                >
                    {returnFAQs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            {...faq}
                            isOpen={openIndex[`return-${index}`]}
                            onClick={() => toggleFAQ('return', index)}
                        />
                    ))}
                </CategorySection>

                {/* Support */}
                <CategorySection
                    title="Customer Support"
                    description="How to reach us and get help"
                    icon={Headphones}
                >
                    {supportFAQs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            {...faq}
                            isOpen={openIndex[`support-${index}`]}
                            onClick={() => toggleFAQ('support', index)}
                        />
                    ))}
                </CategorySection>
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
                            icon={MessageCircle}
                            title="WhatsApp"
                            content="Chat with us instantly"
                            link={SITE_DATA.whatsapp}
                        />
                        <ContactCard
                            icon={Phone}
                            title="Call Us"
                            content={SITE_DATA.phone}
                            link={`tel:${SITE_DATA.phone}`}
                        />
                        <ContactCard
                            icon={Mail}
                            title="Email"
                            content={SITE_DATA.email}
                            link={`mailto:${SITE_DATA.email}`}
                        />
                        <ContactCard
                            icon={MapPin}
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