'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSearchParams } from 'next/navigation';
import {
    ArrowRight,
    CheckCircle,
    Star,
    Store,
    Package,
    Bell,
    Shield,
    BarChart3,
    Users,
    PhoneCall,
    Percent,
    AlertCircle,
    XCircle,
} from 'lucide-react';

// Form Components
import InputForm from '@/components/form/InputForm';
import TextareaForm from '@/components/form/TextareaForm';
import SwitchForm from '@/components/form/SwitchForm';
import Button from '@/components/ui/Button';
import Alert from '@/components/common/Alert';

// Validation & API
import { VendorRequestSchema } from '@/validation/schema';
import { useSubmitVendorRequest, useVendorRequestByEmail } from '@/queries/vendor.query';

export default function BecomeVendor() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch existing request by email if provided
    const {
        data: existingRequest,
        isLoading: isLoadingRequest,
        isError: isRequestError,
    } = useVendorRequestByEmail(email);

    // Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
    } = useForm({
        resolver: yupResolver(VendorRequestSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: email || '',
            phone_number: '',
            company_name: '',
            company_email: '',
            company_phone: '',
            company_address: '',
            company_website: '',
            terms_accepted: false,
        },
    });

    // Populate form with existing request data
    useEffect(() => {
        if (existingRequest?.data) {
            const request = existingRequest.data;
            setValue('first_name', request.first_name || '');
            setValue('last_name', request.last_name || '');
            setValue('email', request.email || '');
            setValue('phone_number', request.phone_number || '');
            setValue('company_name', request.company_name || '');
            setValue('company_email', request.company_email || '');
            setValue('company_phone', request.company_phone || '');
            setValue('company_address', request.company_address || '');
            setValue('company_website', request.company_website || '');
        }
    }, [existingRequest, setValue]);

    // API mutation
    const { mutateAsync: submitRequest, isPending, isError, error } = useSubmitVendorRequest();

    // Form submission handler
    const onSubmit = async (data) => {
        try {
            await submitRequest(data);
            setIsSuccess(true);
            reset();

            setTimeout(() => {
                document.getElementById('success-message')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
        } catch (err) {
            // Error handled by handleError in useSubmitVendorRequest
        }
    };

    // Handle new application
    const handleNewApplication = () => {
        setIsSuccess(false);
        reset();

        setTimeout(() => {
            document.getElementById('apply')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white space-y-10 my-10">
            <StatsSection />
            <HowItWorksSection />
            <BenefitsSection />
            <TestimonialsSection />

            {/* Application Form Section */}
            <section id="apply" className="py-16 sm:py-24 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoadingRequest ? (
                        <FormSkeleton />
                    ) : !isSuccess ? (
                        <ApplicationForm
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            register={register}
                            errors={errors}
                            control={control}
                            isPending={isPending}
                            isError={isError}
                            error={error}
                            existingRequest={existingRequest?.data}
                            isRequestError={isRequestError}
                        />
                    ) : (
                        <SuccessMessage onNewApplication={handleNewApplication} />
                    )}
                </div>
            </section>

            <FAQSection />
            <CTASection />
        </div>
    );
}

// ========================================
// Form Skeleton Loader
// ========================================

function FormSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow p-8 sm:p-12 border border-gray-100">
            <div className="animate-pulse space-y-8">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>

                {/* Form sections skeleton */}
                {[1, 2].map((section) => (
                    <div key={section} className="space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[1, 2].map((field) => (
                                <div key={field}>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}

                {/* Button skeleton */}
                <div className="h-12 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

// ========================================
// Application Form Component
// ========================================

function ApplicationForm({
    handleSubmit,
    onSubmit,
    register,
    errors,
    control,
    isPending,
    isError,
    error,
    existingRequest,
    isRequestError,
}) {
    const showRejectionAlert = existingRequest?.is_rejected && existingRequest?.rejection_reason;
    const showPendingAlert = existingRequest?.is_pending;
    const showApprovedAlert = existingRequest?.is_approved;

    return (
        <>
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Ready to Join Our Marketplace?
                </h2>
                <p className="text-lg text-gray-600">
                    List your products, set your prices, and start receiving orders from thousands of buyers
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-8 sm:p-12 border border-gray-100">
                {/* Rejection Alert */}
                {showRejectionAlert && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-900 mb-1">Previous Application Rejected</h3>
                                <p className="text-sm text-red-800 mb-2">
                                    Your previous application was not approved. Please review the feedback below and resubmit with the necessary improvements.
                                </p>
                                <div className="bg-red-100 border border-red-200 rounded p-3 mt-2">
                                    <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                                    <p className="text-sm text-red-800">{existingRequest.rejection_reason}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Alert */}
                {showPendingAlert && (
                    <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-amber-900 mb-1">Application Under Review</h3>
                                <p className="text-sm text-amber-800">
                                    Your application is currently being reviewed by our team. We'll contact you within 24-48 hours. You can update your information below if needed.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Approved Alert */}
                {showApprovedAlert && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 mb-1">Application Approved</h3>
                                <p className="text-sm text-green-800">
                                    Your vendor application has been approved! Check your email for login credentials and next steps.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                    {/* Personal Information Section */}
                    <FormSection title="Personal Information">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputForm
                                label="First Name"
                                name="first_name"
                                type="text"
                                register={register}
                                error={errors.first_name?.message}
                                placeholder="Enter your first name"
                                required
                                disabled={isPending}
                            />
                            <InputForm
                                label="Last Name"
                                name="last_name"
                                type="text"
                                register={register}
                                error={errors.last_name?.message}
                                placeholder="Enter your last name"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputForm
                                label="Email Address"
                                name="email"
                                type="email"
                                register={register}
                                error={errors.email?.message}
                                placeholder="you@example.com"
                                required
                                disabled={isPending}
                            />
                            <InputForm
                                label="Phone Number"
                                name="phone_number"
                                type="tel"
                                register={register}
                                error={errors.phone_number?.message}
                                placeholder="08012345678"
                                required
                                disabled={isPending}
                            />
                        </div>
                    </FormSection>

                    {/* Company Information Section */}
                    <FormSection title="Business/Market Information">
                        <InputForm
                            label="Business/Market Name"
                            name="company_name"
                            type="text"
                            register={register}
                            error={errors.company_name?.message}
                            placeholder="E.g., Green Valley Market, Fresh Farms Ltd"
                            required
                            disabled={isPending}
                        />

                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputForm
                                label="Business Email"
                                name="company_email"
                                type="email"
                                register={register}
                                error={errors.company_email?.message}
                                placeholder="info@yourmarket.com"
                                required
                                disabled={isPending}
                            />
                            <InputForm
                                label="Business Phone"
                                name="company_phone"
                                type="tel"
                                register={register}
                                error={errors.company_phone?.message}
                                placeholder="08012345678"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <TextareaForm
                            label="Business Address"
                            name="company_address"
                            register={register}
                            error={errors.company_address?.message}
                            placeholder="Enter your complete business/market address"
                            rows={3}
                            required
                            disabled={isPending}
                        />

                        <InputForm
                            label="Website (Optional)"
                            name="company_website"
                            type="url"
                            register={register}
                            error={errors.company_website?.message}
                            placeholder="https://yourwebsite.com"
                            disabled={isPending}
                        />
                    </FormSection>

                    {/* Terms and Submit */}
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <SwitchForm
                                name="terms_accepted"
                                control={control}
                                error={errors.terms_accepted?.message}
                                required
                                color="green"
                                label="I Accept Terms & Conditions"
                                description="By submitting this application, you agree to our vendor terms and conditions. We'll review your application and contact you within 24-48 hours."
                                disabled={isPending}
                            />
                        </div>

                        {isError && <Alert error={error} />}

                        <Button
                            endIcon={<ArrowRight />}
                            type="submit"
                            loading={isPending}
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Submitting Application...' : existingRequest ? 'Update Application' : 'Submit Application'}
                        </Button>

                        <p className="text-xs text-center text-gray-500">
                            By submitting, you confirm that all information provided is accurate and complete
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
}

// ========================================
// Form Section Component
// ========================================

function FormSection({ title, children }) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

// ========================================
// Stats Section
// ========================================

function StatsSection() {
    const stats = [
        { value: '5,000+', label: 'Active Vendors' },
        { value: '50,000+', label: 'Monthly Buyers' },
        { value: '₦2.5B+', label: 'Orders Processed' },
        { value: '24/7', label: 'Support Available' },
    ];

    return (
        <section className="py-12 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ========================================
// How It Works Section
// ========================================

function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            title: 'Apply & Get Verified',
            description: 'Submit your application with business details. Our team verifies and approves qualified vendors within 24-48 hours.',
            icon: CheckCircle,
        },
        {
            number: 2,
            title: 'List Products & Set Prices',
            description: 'Browse our product catalog, select items available in your market, and set your competitive prices.',
            icon: Package,
        },
        {
            number: 3,
            title: 'Receive Orders & Get Paid',
            description: 'When buyers order from you, we notify you immediately. Fulfill orders and receive weekly payments directly to your bank.',
            icon: Bell,
        },
    ];

    return (
        <section id="how-it-works" className="py-16 sm:py-24 bg-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Simple, transparent process to start selling on SuperoAgrobase
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.number} className="bg-white p-8 rounded-xl shadow-md relative">
                                <div className="absolute -top-4 left-8">
                                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow">
                                        {step.number}
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-7 h-7 text-green-700" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ========================================
// Benefits Section
// ========================================

function BenefitsSection() {
    const benefits = [
        {
            icon: PhoneCall,
            title: 'We Find Customers For You',
            description: 'Focus on what you do best - providing quality products. We handle marketing and bring verified buyers directly to you.',
        },
        {
            icon: Percent,
            title: 'Set Your Own Prices',
            description: 'Complete control over your pricing. Adjust prices anytime based on market conditions and your profit margins.',
        },
        {
            icon: Bell,
            title: 'Instant Order Notifications',
            description: 'Get notified immediately when a buyer places an order. Quick response time means happy customers and repeat business.',
        },
        {
            icon: Shield,
            title: 'Secure & Timely Payments',
            description: 'Get paid on time, every time. Weekly automatic transfers directly to your bank account with complete transaction transparency.',
        },
        {
            icon: BarChart3,
            title: 'Track Your Performance',
            description: 'Real-time dashboard to monitor orders, sales, and revenue. Make data-driven decisions to grow your business.',
        },
        {
            icon: Users,
            title: 'Dedicated Support Team',
            description: '24/7 support to help you succeed. From onboarding to daily operations, we\'re here to assist you every step of the way.',
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Why Partner With Us?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of successful vendors earning more by connecting with buyers nationwide
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-md hover:shadow transition-all border border-gray-100 hover:border-green-200"
                            >
                                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                    <Icon className="w-7 h-7 text-green-700" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ========================================
// Testimonials Section
// ========================================

function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Amina Ibrahim',
            role: 'Rice Supplier, Kano',
            content: "SuperoAgrobase transformed how I sell. They bring me customers daily, and I just focus on quality products and fulfillment. My revenue has tripled!",
            rating: 5,
        },
        {
            name: 'Chidi Okafor',
            role: 'Fresh Produce Market, Lagos',
            content: 'The order notifications are instant, payments are reliable, and the support team is excellent. Best marketplace decision I\'ve made.',
            rating: 5,
        },
        {
            name: 'Fatima Musa',
            role: 'Poultry Supplier, Abuja',
            content: 'I love the pricing control. I can adjust based on my costs and still stay competitive. The platform handles everything else.',
            rating: 5,
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-green-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Success Stories From Our Vendors
                    </h2>
                    <p className="text-lg text-gray-600">
                        Real results from real vendors across Nigeria
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic leading-relaxed">
                                "{testimonial.content}"
                            </p>
                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ========================================
// Success Message Component
// ========================================

function SuccessMessage({ onNewApplication }) {
    return (
        <div id="success-message" className="bg-white rounded-2xl shadow p-8 sm:p-12 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you for your interest in becoming a vendor on SuperoAgrobase. Our team will review your
                application and contact you within 24-48 hours.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                    <strong>What's Next?</strong>
                    <br />
                    Check your email for a confirmation message. Once approved, we'll send you login credentials and
                    onboarding instructions to start listing your products.
                </p>
            </div>
            <button
                onClick={onNewApplication}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow"
            >
                Submit Another Application
            </button>
        </div>
    );
}

// ========================================
// FAQ Section
// ========================================

function FAQSection() {
    const faqs = [
        {
            question: 'What are the requirements to become a vendor?',
            answer: 'You need a registered business or established market, valid contact information, and agricultural products available for sale. We welcome farmers, markets, distributors, processors, and cooperatives.',
        },
        {
            question: 'How do I receive orders from buyers?',
            answer: 'When a buyer places an order for your products, you receive an instant notification via SMS and email. You can also track all orders in real-time through your vendor dashboard.',
        },
        {
            question: 'How much does it cost to join?',
            answer: 'Registration is completely free. We only charge a small commission on successful sales, which means our success is directly tied to yours. No hidden fees or monthly subscriptions.',
        },
        {
            question: 'How do I set prices for my products?',
            answer: 'After approval, you access our product catalog and select items available in your market. You set your own competitive prices and can adjust them anytime through your dashboard based on market conditions.',
        },
        {
            question: 'When and how do I get paid?',
            answer: 'Payments are processed weekly via direct bank transfer every Friday. You receive payment for all orders successfully delivered in the previous week, with complete transaction transparency.',
        },
        {
            question: 'What if I need help or have questions?',
            answer: 'Our dedicated support team is available 24/7 via phone, email, and WhatsApp. We provide onboarding training and ongoing support to ensure your success on the platform.',
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about becoming a vendor
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="group bg-green-50 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors"
                        >
                            <summary className="font-semibold text-gray-900 text-lg flex justify-between items-center">
                                <span>{faq.question}</span>
                                <ArrowRight className="w-5 h-5 text-green-600 transition-transform group-open:rotate-90" />
                            </summary>
                            <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ========================================
// CTA Section
// ========================================

function CTASection() {
    return (
        <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Ready to Grow Your Business?
                </h2>
                <p className="text-lg text-green-50 mb-8 max-w-2xl mx-auto">
                    Join thousands of vendors already earning more by connecting with buyers nationwide. Start your journey today.
                </p>
                <a
                    href="#apply"
                    className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all shadow hover:shadow"
                >
                    Become a Vendor Now <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </section>
    );
}