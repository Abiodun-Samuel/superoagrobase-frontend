'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, Shield, Leaf, Clock, ArrowRight, Package } from 'lucide-react';
import { useVerifyTransaction } from '@/queries/transactions.query';
import Button from '../ui/Button';

export default function PaymentVerify({ reference }) {
    const router = useRouter();

    const { data, isLoading, isError } = useVerifyTransaction(
        { reference },
        {
            enabled: !!reference,
            retry: false,
            refetchOnWindowFocus: false,
        }
    );

    const paymentData = data?.data;
    const paymentStatus = paymentData?.status;

    // Auto-redirect after 5 seconds regardless of status
    useEffect(() => {
        if (paymentStatus) {
            const timer = setTimeout(() => {
                router.replace(`/dashboard/orders/${reference?.toLowerCase()}`);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [paymentStatus, reference, router]);

    const getStatusConfig = () => {
        if (isLoading) {
            return {
                status: 'verifying',
                title: 'Verifying Payment',
                message: 'Verifying your payment...',
                color: 'green',
                icon: Loader2,
                showSecurityFeatures: true,
            };
        }

        if (isError || !paymentStatus) {
            return {
                status: 'failed',
                title: 'Verification Failed',
                message: 'Unable to verify payment. If money was deducted, it will be refunded within 24 hours.',
                color: 'red',
                icon: XCircle,
                showSecurityFeatures: false,
            };
        }

        if (paymentStatus === 'success') {
            return {
                status: 'success',
                title: 'Payment Successful!',
                message: `Payment of ₦${(paymentData.amount / 100).toLocaleString()} confirmed successfully.`,
                color: 'green',
                icon: CheckCircle2,
                showSecurityFeatures: false,
            };
        }

        if (paymentStatus === 'pending') {
            return {
                status: 'pending',
                title: 'Payment Pending',
                message: 'Your payment is being processed. You\'ll receive an email confirmation once completed.',
                color: 'amber',
                icon: Clock,
                showSecurityFeatures: false,
            };
        }

        return {
            status: 'failed',
            title: 'Payment Failed',
            message: 'Payment was not successful. Please try again or contact support if you need assistance.',
            color: 'red',
            icon: XCircle,
            showSecurityFeatures: false,
        };
    };

    const config = getStatusConfig();
    const StatusIcon = config.icon;

    const getColorClasses = (color) => {
        const colors = {
            green: {
                bar: 'from-green-600 to-emerald-600',
                bg: 'from-green-50 to-emerald-50',
                icon: 'text-green-600',
                text: 'text-green-900',
                badge: 'bg-green-50 border-green-200 text-green-800',
            },
            amber: {
                bar: 'from-amber-500 to-orange-500',
                bg: 'from-amber-50 to-orange-50',
                icon: 'text-amber-600',
                text: 'text-amber-900',
                badge: 'bg-amber-50 border-amber-200 text-amber-800',
            },
            red: {
                bar: 'from-red-600 to-rose-600',
                bg: 'from-red-50 to-rose-50',
                icon: 'text-red-600',
                text: 'text-red-900',
                badge: 'bg-red-50 border-red-200 text-red-800',
            },
        };
        return colors[color];
    };

    const colorClasses = getColorClasses(config.color);

    return (
        <div className="my-10 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
            </div>

            {/* Main Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-xl shadow shadow-green-500/10 overflow-hidden border border-green-100/50">

                    {/* Status Bar */}
                    <div className={`h-1 bg-gradient-to-r ${colorClasses.bar} ${isLoading ? 'animate-pulse' : ''}`} />

                    {/* Content */}
                    <div className="p-6 sm:p-8 md:p-10">

                        {/* Icon Container */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {/* Animated Ring for Loading */}
                                {isLoading && (
                                    <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping" />
                                )}

                                {/* Icon Background */}
                                <div className={`relative rounded-full p-3.5 bg-gradient-to-br ${colorClasses.bg}`}>
                                    <StatusIcon
                                        className={`w-10 h-10 ${colorClasses.icon} ${isLoading ? 'animate-spin' : 'animate-scale-in'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className={`text-2xl sm:text-3xl font-bold text-center mb-3 ${colorClasses.text}`}>
                            {config.title}
                        </h1>

                        {/* Message */}
                        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
                            {config.message}
                        </p>

                        {/* Security Features - Only show while verifying */}
                        {config.showSecurityFeatures && (
                            <div className="space-y-3 mb-8">
                                <SecurityBadge
                                    icon={Shield}
                                    title="Secure Connection"
                                    subtitle="256-bit SSL encryption"
                                    color="green"
                                />
                                <SecurityBadge
                                    icon={Leaf}
                                    title="Payment Gateway"
                                    subtitle="Processing with Paystack"
                                    color="emerald"
                                />
                                <SecurityBadge
                                    icon={Clock}
                                    title="Please Wait"
                                    subtitle="This may take a few moments"
                                    color="teal"
                                />
                            </div>
                        )}

                        {/* Payment Details - Show for success */}
                        {config.status === 'success' && paymentData && (
                            <div className="mb-8 space-y-3">
                                <div className={`p-4 rounded-xl border ${colorClasses.badge}`}>
                                    <div className="flex items-center gap-2 justify-center mb-3">
                                        <Leaf className="w-4 h-4" />
                                        <p className="text-sm font-medium">Payment Confirmed</p>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <DetailRow label="Reference" value={paymentData.reference} />
                                        <DetailRow label="Amount" value={`₦${(paymentData.amount / 100).toLocaleString()}`} />
                                        <DetailRow label="Channel" value={paymentData.channel?.toUpperCase()} />
                                        <DetailRow
                                            label="Date"
                                            value={new Date(paymentData.paid_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Details */}
                        {config.status === 'pending' && (
                            <StatusAlert
                                icon={Clock}
                                title="Payment Processing"
                                message="We're confirming your payment with the bank. You'll receive an email once completed."
                                color="amber"
                            />
                        )}

                        {config.status === 'failed' && (
                            <StatusAlert
                                icon={XCircle}
                                title="Verification Failed"
                                message="If money was deducted, it will be refunded within 24 hours. Contact support for assistance."
                                color="red"
                            />
                        )}

                        {/* Loading Progress Bar */}
                        {isLoading && (
                            <div className="space-y-2 mb-8">
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-progress" />
                                </div>
                                <p className="text-xs text-center text-gray-500">
                                    Do not close this window or press back
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!isLoading && (
                            <div className="space-y-3">
                                <Button
                                    href={`/dashboard/orders/${reference}`}
                                    color="green"
                                    className="w-full group"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Package className="w-4 h-4" />
                                        View Order Details
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>

                                <Button
                                    href="/dashboard/orders"
                                    variant="outline"
                                    color="gray"
                                    className="w-full"
                                >
                                    Browse All Orders
                                </Button>
                            </div>
                        )}

                        {/* Auto-redirect Notice */}
                        {!isLoading && (
                            <p className="text-xs text-center text-gray-500 mt-4">
                                Redirecting to order details in 5 seconds...
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 sm:px-8 md:px-10 pb-6 sm:pb-8 pt-4 border-t border-gray-100">
                        <p className="text-xs text-center text-gray-500">
                            Need help?{' '}
                            <a
                                href="mailto:contact@superoagrobase.com"
                                className="text-green-600 hover:text-green-700 font-medium underline decoration-green-300 hover:decoration-green-500 transition-colors"
                            >
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-gray-500 px-4">
                    <TrustBadge icon={Shield} label="PCI Compliant" color="text-green-600" />
                    <Divider />
                    <TrustBadge icon={Leaf} label="Secure Payment" color="text-emerald-600" />
                    <Divider />
                    <TrustBadge icon={Lock} label="SSL Encrypted" color="text-teal-600" />
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    from {
                        transform: scale(0);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 90%; }
                }
                
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

// Helper Components
function SecurityBadge({ icon: Icon, title, subtitle, color }) {
    const colorMap = {
        green: 'bg-green-50 border-green-100 text-green-900',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-900',
        teal: 'bg-teal-50 border-teal-100 text-teal-900',
    };

    const iconColorMap = {
        green: 'text-green-600',
        emerald: 'text-emerald-600',
        teal: 'text-teal-600',
    };

    const subtitleColorMap = {
        green: 'text-green-700',
        emerald: 'text-emerald-700',
        teal: 'text-teal-700',
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${colorMap[color]}`}>
            <div className="flex-shrink-0">
                <Icon className={`w-5 h-5 ${iconColorMap[color]}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{title}</p>
                <p className={`text-xs ${subtitleColorMap[color]}`}>{subtitle}</p>
            </div>
        </div>
    );
}

function StatusAlert({ icon: Icon, title, message, color }) {
    const colorMap = {
        amber: 'bg-amber-50 border-amber-200 text-amber-900',
        red: 'bg-red-50 border-red-200 text-red-900',
        blue: 'bg-blue-50 border-blue-200 text-blue-900',
    };

    const iconColorMap = {
        amber: 'text-amber-600',
        red: 'text-red-600',
        blue: 'text-blue-600',
    };

    const messageColorMap = {
        amber: 'text-amber-700',
        red: 'text-red-700',
        blue: 'text-blue-700',
    };

    return (
        <div className={`mb-8 p-4 rounded-xl border ${colorMap[color]}`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${iconColorMap[color]} flex-shrink-0 mt-0.5`} />
                <div>
                    <p className="text-sm font-medium mb-1">{title}</p>
                    <p className={`text-xs ${messageColorMap[color]}`}>{message}</p>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-600">{label}:</span>
            <span className="font-medium text-gray-900">{value}</span>
        </div>
    );
}

function TrustBadge({ icon: Icon, label, color }) {
    return (
        <div className="flex items-center gap-1.5">
            <Icon className={`w-4 h-4 ${color}`} />
            <span>{label}</span>
        </div>
    );
}

function Divider() {
    return <div className="w-px h-4 bg-gray-300 hidden sm:block" />;
}

function Lock({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
        </svg>
    );
}