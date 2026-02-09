'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    ArrowLeft,
    AlertCircle,
    Shield,
    ExternalLink,
    Send,
    Ban,
    RefreshCw,
} from 'lucide-react';

// Components
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import TextareaForm from '@/components/form/TextareaForm';
import Alert from '@/components/common/Alert';

// Hooks & Services
import { useVendorRequest, useApproveVendorRequest, useRejectVendorRequest } from '@/queries/vendor.query';
import { useForm } from 'react-hook-form';

// ============================================
// Constants
// ============================================

const STATUS_CONFIG = {
    pending: {
        label: 'Pending Review',
        bgClass: 'bg-amber-50 dark:bg-amber-950/30',
        textClass: 'text-amber-700 dark:text-amber-400',
        borderClass: 'border-amber-300 dark:border-amber-700',
        dotClass: 'bg-amber-500',
    },
    approved: {
        label: 'Approved',
        bgClass: 'bg-green-50 dark:bg-green-950/30',
        textClass: 'text-green-700 dark:text-green-400',
        borderClass: 'border-green-300 dark:border-green-700',
        dotClass: 'bg-green-500',
    },
    rejected: {
        label: 'Rejected',
        bgClass: 'bg-red-50 dark:bg-red-950/30',
        textClass: 'text-red-700 dark:text-red-400',
        borderClass: 'border-red-300 dark:border-red-700',
        dotClass: 'bg-red-500',
    },
};

// ============================================
// Main Component
// ============================================

export default function VendorRequestDetails({ id }) {
    const router = useRouter();
    const [actionMode, setActionMode] = useState(null);

    const { data, isLoading, isError, error } = useVendorRequest(id);

    const {
        mutate: approveRequest,
        isPending: isApproving,
        isError: isApproveError,
        error: approveError,
    } = useApproveVendorRequest({
        onSuccess: () => {
            setActionMode(null);
            router.push('/dashboard/vendor-requests');
        },
    });

    const {
        mutate: rejectRequest,
        isPending: isRejecting,
        isError: isRejectError,
        error: rejectError,
    } = useRejectVendorRequest({
        onSuccess: () => {
            setActionMode(null);
            router.push('/dashboard/vendor-requests');
        },
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { rejection_reason: '' },
    });

    const handleApprove = () => approveRequest(id);
    const handleReject = (formData) => rejectRequest({ id, rejection_reason: formData.rejection_reason });
    const handleCancelAction = () => {
        setActionMode(null);
        reset();
    };
    const handleBack = () => router.back();

    // ✅ REFACTORED: Better loading/error/empty state handling
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError) {
        return <ErrorState error={error} onBack={handleBack} />;
    }

    // ✅ REFACTORED: Check both data structure and vendorRequest existence
    const vendorRequest = data?.data;

    if (!vendorRequest || Object.keys(vendorRequest).length === 0) {
        return <NotFoundState onBack={handleBack} />;
    }

    const canReview = vendorRequest.is_pending || vendorRequest.is_rejected;
    const isProcessing = isApproving || isRejecting;
    const hasActionError = isApproveError || isRejectError;
    const actionError = approveError || rejectError;
    const isReReview = vendorRequest.is_rejected;

    return (
        <div className="space-y-6 max-w-full overflow-hidden">
            {/* Header Info Bar */}
            <HeaderInfoBar vendorRequest={vendorRequest} onBack={handleBack} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="xl:col-span-2 space-y-6">
                    <ApplicantCard vendorRequest={vendorRequest} />
                    <CompanyDetailsCard vendorRequest={vendorRequest} />
                    {vendorRequest.reviewed_at && (
                        <ReviewDetailsCard vendorRequest={vendorRequest} />
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {canReview ? (
                        <ActionPanel
                            vendorRequest={vendorRequest}
                            actionMode={actionMode}
                            setActionMode={setActionMode}
                            onApprove={handleApprove}
                            onReject={handleSubmit(handleReject)}
                            onCancel={handleCancelAction}
                            isProcessing={isProcessing}
                            hasError={hasActionError}
                            error={actionError}
                            register={register}
                            errors={errors}
                            isReReview={isReReview}
                        />
                    ) : (
                        <ReviewStatusCard vendorRequest={vendorRequest} />
                    )}
                    <MetadataCard vendorRequest={vendorRequest} />
                </div>
            </div>
        </div>
    );
}

// ============================================
// Header Info Bar
// ============================================

function HeaderInfoBar({ vendorRequest, onBack }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 mt-0.5"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                            {vendorRequest.first_name} {vendorRequest.last_name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Application #{vendorRequest.id}
                            </p>
                            {vendorRequest.company_name && (
                                <>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {vendorRequest.company_name}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section - Status Badge */}
                <div className="flex justify-start lg:justify-end">
                    <StatusBadge status={vendorRequest.status} />
                </div>
            </div>
        </div>
    );
}

// ============================================
// Status Badge
// ============================================

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${config.borderClass} ${config.bgClass} shadow-sm`}>
            <span className={`w-2 h-2 rounded-full ${config.dotClass} animate-pulse`} />
            <span className={`font-semibold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap ${config.textClass}`}>
                {config.label}
            </span>
        </div>
    );
}

// ============================================
// Applicant Card
// ============================================

function ApplicantCard({ vendorRequest }) {
    // ✅ REFACTORED: Safe initials with multiple fallbacks
    const initials = vendorRequest.first_name && vendorRequest.last_name
        ? `${vendorRequest.first_name[0]}${vendorRequest.last_name[0]}`
        : vendorRequest.first_name?.[0] || 'V';

    return (
        <Card title="Applicant Information">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                    <Avatar initials={initials} size="2xl" shape="circle" />
                </div>
                <div className="flex-1 min-w-0 w-full space-y-4">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                            {vendorRequest.first_name || 'N/A'} {vendorRequest.last_name || ''}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vendor Applicant</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vendorRequest.email && (
                            <ContactInfo
                                icon={Mail}
                                label="Email"
                                value={vendorRequest.email}
                                href={`mailto:${vendorRequest.email}`}
                            />
                        )}
                        {vendorRequest.phone_number && (
                            <ContactInfo
                                icon={Phone}
                                label="Phone"
                                value={vendorRequest.phone_number}
                                href={`tel:${vendorRequest.phone_number}`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ============================================
// Company Details Card
// ============================================

function CompanyDetailsCard({ vendorRequest }) {
    // ✅ REFACTORED: Check if any company details exist
    const hasCompanyDetails = vendorRequest.company_name ||
        vendorRequest.company_email ||
        vendorRequest.company_phone ||
        vendorRequest.company_address ||
        vendorRequest.company_website;

    if (!hasCompanyDetails) {
        return (
            <Card title="Company Details" icon={Building2}>
                <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No company details provided
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Company Details" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {vendorRequest.company_name && (
                    <DetailRow
                        label="Company Name"
                        value={vendorRequest.company_name}
                        highlight
                        className="md:col-span-2"
                    />
                )}
                {vendorRequest.company_email && (
                    <DetailRow
                        label="Company Email"
                        value={vendorRequest.company_email}
                        href={`mailto:${vendorRequest.company_email}`}
                        icon={Mail}
                    />
                )}
                {vendorRequest.company_phone && (
                    <DetailRow
                        label="Company Phone"
                        value={vendorRequest.company_phone}
                        href={`tel:${vendorRequest.company_phone}`}
                        icon={Phone}
                    />
                )}
                {vendorRequest.company_address && (
                    <DetailRow
                        label="Address"
                        value={vendorRequest.company_address}
                        icon={MapPin}
                        className="md:col-span-2"
                    />
                )}
                {vendorRequest.company_website && (
                    <DetailRow
                        label="Website"
                        value={vendorRequest.company_website}
                        href={vendorRequest.company_website}
                        icon={Globe}
                        external
                        className="md:col-span-2"
                    />
                )}
            </div>
        </Card>
    );
}

// ============================================
// Review Details Card
// ============================================

function ReviewDetailsCard({ vendorRequest }) {
    const isApproved = vendorRequest.is_approved;
    const colorClasses = isApproved
        ? {
            border: 'border-green-200 dark:border-green-800',
            headerBg: 'bg-green-50 dark:bg-green-950/50',
            headerBorder: 'border-green-200 dark:border-green-800',
            iconColor: 'text-green-600 dark:text-green-400',
            textColor: 'text-green-700 dark:text-green-400',
            reasonBg: 'bg-red-50 dark:bg-red-950/30',
            reasonText: 'text-red-700 dark:text-red-400',
            reasonBorder: 'border-red-200 dark:border-red-800',
        }
        : {
            border: 'border-red-200 dark:border-red-800',
            headerBg: 'bg-red-50 dark:bg-red-950/50',
            headerBorder: 'border-red-200 dark:border-red-800',
            iconColor: 'text-red-600 dark:text-red-400',
            textColor: 'text-red-700 dark:text-red-400',
            reasonBg: 'bg-red-50 dark:bg-red-950/30',
            reasonText: 'text-red-700 dark:text-red-400',
            reasonBorder: 'border-red-200 dark:border-red-800',
        };

    return (
        <div className={`bg-white dark:bg-gray-800 border-2 ${colorClasses.border} rounded-xl overflow-hidden shadow-sm`}>
            <div className={`px-4 sm:px-6 py-5 border-b-2 ${colorClasses.headerBorder} ${colorClasses.headerBg}`}>
                <div className="flex items-center gap-3">
                    {isApproved ? (
                        <CheckCircle className={`w-5 h-5 ${colorClasses.iconColor} flex-shrink-0`} />
                    ) : (
                        <XCircle className={`w-5 h-5 ${colorClasses.iconColor} flex-shrink-0`} />
                    )}
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                        Review Details
                    </h2>
                </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
                {/* Decision */}
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Decision</p>
                    <p className={`text-base font-semibold mt-1 ${colorClasses.textColor}`}>
                        {isApproved ? 'Application Approved' : 'Application Rejected'}
                    </p>
                </div>

                {/* Reviewed By */}
                {vendorRequest.reviewed_by && (
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviewed By</p>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                                {vendorRequest.reviewed_by.name?.[0] || 'A'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {vendorRequest.reviewed_by.name || 'Admin'}
                                </p>
                                {vendorRequest.reviewed_by.email && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {vendorRequest.reviewed_by.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviewed At */}
                {vendorRequest.reviewed_at && (
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviewed At</p>
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mt-1 break-words">
                            {new Date(vendorRequest.reviewed_at).toLocaleString()}
                            {vendorRequest.reviewed_at_human && (
                                <span className="text-gray-500 dark:text-gray-400"> ({vendorRequest.reviewed_at_human})</span>
                            )}
                        </p>
                    </div>
                )}

                {/* Rejection Reason */}
                {vendorRequest.rejection_reason && (
                    <div className={`pt-4 border-t ${colorClasses.reasonBorder}`}>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Rejection Reason
                        </p>
                        <div className={`${colorClasses.reasonBg} border ${colorClasses.reasonBorder} p-4 rounded-lg`}>
                            <p className={`text-sm ${colorClasses.reasonText} leading-relaxed break-words`}>
                                {vendorRequest.rejection_reason}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// Action Panel
// ============================================

function ActionPanel({
    vendorRequest,
    actionMode,
    setActionMode,
    onApprove,
    onReject,
    onCancel,
    isProcessing,
    hasError,
    error,
    register,
    errors,
    isReReview,
}) {
    // Approval Confirmation Mode
    if (actionMode === 'approve') {
        return (
            <div className="bg-white dark:bg-gray-800 border-2 border-green-300 dark:border-green-700 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-green-50 dark:bg-green-950/50 px-4 sm:px-6 py-5 border-b-2 border-green-300 dark:border-green-700">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                            {isReReview ? 'Confirm Re-Approval' : 'Confirm Approval'}
                        </h3>
                    </div>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    {hasError && <Alert error={error} />}

                    {isReReview && (
                        <Alert
                            type="info"
                            message="This request was previously rejected. Approving will override the previous decision."
                        />
                    )}

                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-sm text-green-900 dark:text-green-100 font-semibold mb-2">
                            This action will:
                        </p>
                        <ul className="space-y-1.5 text-sm text-green-800 dark:text-green-200">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Create vendor account for {vendorRequest.first_name || 'applicant'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Send login credentials via email</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Grant vendor dashboard access</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={onApprove}
                            loading={isProcessing}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                            startIcon={<Send className="w-4 h-4" />}
                        >
                            {isReReview ? 'Confirm & Re-Approve' : 'Confirm & Approve'}
                        </Button>
                        <Button
                            onClick={onCancel}
                            disabled={isProcessing}
                            variant="outline"
                            className="w-full"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Rejection Mode
    if (actionMode === 'reject') {
        return (
            <div className="bg-white dark:bg-gray-800 border-2 border-red-300 dark:border-red-700 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-red-50 dark:bg-red-950/50 px-4 sm:px-6 py-5 border-b-2 border-red-300 dark:border-red-700">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                            {isReReview ? 'Update Rejection' : 'Reject Application'}
                        </h3>
                    </div>
                </div>
                <form onSubmit={onReject} className="p-4 sm:p-6 space-y-4">
                    {hasError && <Alert error={error} />}

                    <TextareaForm
                        label="Rejection Reason"
                        name="rejection_reason"
                        register={register}
                        error={errors.rejection_reason?.message}
                        placeholder="Provide a clear explanation for rejecting this application..."
                        rows={5}
                        required
                        disabled={isProcessing}
                    />

                    <div className="space-y-2">
                        <Button
                            type="submit"
                            loading={isProcessing}
                            disabled={isProcessing}
                            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                            startIcon={<Ban className="w-4 h-4" />}
                        >
                            {isReReview ? 'Update Rejection' : 'Confirm Rejection'}
                        </Button>
                        <Button
                            type="button"
                            onClick={onCancel}
                            disabled={isProcessing}
                            variant="outline"
                            className="w-full"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    // Default Action Panel
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                        {isReReview ? 'Re-Review Actions' : 'Review Actions'}
                    </h3>
                </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
                {isReReview && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                        <div className="flex gap-2">
                            <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 dark:text-amber-200">
                                This application was previously rejected. You can re-approve or update the rejection reason.
                            </p>
                        </div>
                    </div>
                )}

                <Button
                    onClick={() => setActionMode('approve')}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    startIcon={isReReview ? <RefreshCw className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                >
                    {isReReview ? 'Re-Approve Application' : 'Approve Application'}
                </Button>
                <Button
                    onClick={() => setActionMode('reject')}
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                    startIcon={<XCircle className="w-5 h-5" />}
                >
                    {isReReview ? 'Update Rejection' : 'Reject Application'}
                </Button>
            </div>
        </div>
    );
}

// ============================================
// Review Status Card
// ============================================

function ReviewStatusCard({ vendorRequest }) {
    const isApproved = vendorRequest.is_approved;
    const colorClasses = isApproved
        ? {
            border: 'border-green-300 dark:border-green-700',
            bg: 'bg-green-50 dark:bg-green-950/50',
            iconColor: 'text-green-600 dark:text-green-400',
        }
        : {
            border: 'border-red-300 dark:border-red-700',
            bg: 'bg-red-50 dark:bg-red-950/50',
            iconColor: 'text-red-600 dark:text-red-400',
        };

    return (
        <div className={`bg-white dark:bg-gray-800 border-2 ${colorClasses.border} rounded-xl overflow-hidden shadow-sm`}>
            <div className={`px-4 sm:px-6 py-5 ${colorClasses.bg}`}>
                <div className="flex items-center gap-3">
                    {isApproved ? (
                        <CheckCircle className={`w-6 h-6 ${colorClasses.iconColor} flex-shrink-0`} />
                    ) : (
                        <XCircle className={`w-6 h-6 ${colorClasses.iconColor} flex-shrink-0`} />
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                            {isApproved ? 'Approved' : 'Rejected'}
                        </h3>
                        {vendorRequest.reviewed_at_human && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                                {vendorRequest.reviewed_at_human}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// Metadata Card
// ============================================

function MetadataCard({ vendorRequest }) {
    return (
        <Card title="Timeline" icon={Calendar}>
            <div className="space-y-4">
                {/* Submitted */}
                {vendorRequest.created_at && (
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitted</p>
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mt-1 break-words">
                            {new Date(vendorRequest.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                        {vendorRequest.created_at_human && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {vendorRequest.created_at_human}
                            </p>
                        )}
                    </div>
                )}

                {/* Reviewed */}
                {vendorRequest.reviewed_at && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviewed</p>
                        <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mt-1 break-words">
                            {new Date(vendorRequest.reviewed_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                        {vendorRequest.reviewed_at_human && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {vendorRequest.reviewed_at_human}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}

// ============================================
// Reusable Card Component
// ============================================

function Card({ title, icon: Icon, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />}
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                </div>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}

// ============================================
// Helper Components
// ============================================

function ContactInfo({ icon: Icon, label, value, href }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {label}
                </p>
                {href ? (
                    <a
                        href={href}
                        className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline mt-1 block truncate"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 truncate">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}

function DetailRow({ label, value, href, icon: Icon, external, highlight, className = '' }) {
    const content = (
        <div className={`flex items-start gap-3 ${className}`}>
            {Icon && (
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-0.5 flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {label}
                </p>
                <p
                    className={`mt-1 ${highlight
                        ? 'text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100'
                        : href
                            ? 'text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium'
                            : 'text-sm text-gray-900 dark:text-gray-100'
                        } break-words`}
                >
                    {value}
                    {external && <ExternalLink className="inline-block w-3 h-3 ml-1" />}
                </p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
            >
                {content}
            </a>
        );
    }

    return <div>{content}</div>;
}

// ============================================
// Loading & Error States
// ============================================

function SkeletonLoader() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="space-y-2 flex-1">
                            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                            <div className="p-6 space-y-4">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                            <div className="p-6">
                                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ErrorState({ error, onBack }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 sm:p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Failed to Load</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 break-words">
                    {error?.message || error?.response?.data?.message || 'Something went wrong while loading this vendor request'}
                </p>
                <Button onClick={onBack} variant="outline" startIcon={<ArrowLeft className="w-4 h-4" />}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}

function NotFoundState({ onBack }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 sm:p-8 text-center shadow-lg">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Request Not Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The vendor request you're looking for doesn't exist or may have been deleted.
                </p>
                <Button onClick={onBack} variant="outline" startIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to List
                </Button>
            </div>
        </div>
    );
}