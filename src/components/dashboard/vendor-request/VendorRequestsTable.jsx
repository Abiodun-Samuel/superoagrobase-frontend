'use client';

import { useState, useMemo } from 'react';
import {
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Building2,
    Phone,
    Calendar,
    ChevronDown,
    X,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useVendorRequests } from '@/queries/vendor.query';
import Button from '@/components/ui/Button';
import InputForm from '@/components/form/InputForm';

// ============================================
// Constants
// ============================================

const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        color: 'amber',
        icon: Clock,
        bgClass: 'bg-amber-50 dark:bg-amber-950/30',
        textClass: 'text-amber-700 dark:text-amber-400',
        borderClass: 'border-amber-200 dark:border-amber-800',
        dotClass: 'bg-amber-500',
    },
    approved: {
        label: 'Approved',
        color: 'green',
        icon: CheckCircle,
        bgClass: 'bg-green-50 dark:bg-green-950/30',
        textClass: 'text-green-700 dark:text-green-400',
        borderClass: 'border-green-200 dark:border-green-800',
        dotClass: 'bg-green-500',
    },
    rejected: {
        label: 'Rejected',
        color: 'red',
        icon: XCircle,
        bgClass: 'bg-red-50 dark:bg-red-950/30',
        textClass: 'text-red-700 dark:text-red-400',
        borderClass: 'border-red-200 dark:border-red-800',
        dotClass: 'bg-red-500',
    },
};

const FILTER_OPTIONS = [
    { value: '', label: 'All Requests' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

// ============================================
// Main Component
// ============================================

export default function VendorRequestsTable() {
    const [filters, setFilters] = useState({
        status: '',
        search: '',
    });
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Mock register function for InputForm (since we're not using react-hook-form)
    const register = (name) => ({
        name,
        onChange: (e) => handleSearchChange(e.target.value),
        value: filters.search,
    });

    // Fetch data
    const { data, isLoading, isError, error } = useVendorRequests({
        status: filters.status,
        search: debouncedSearch,
    });

    // Debounce search
    const handleSearchChange = useMemo(() => {
        let timeoutId;
        return (value) => {
            setFilters((prev) => ({ ...prev, search: value }));
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setDebouncedSearch(value);
            }, 500);
        };
    }, []);

    const handleStatusChange = (status) => {
        setFilters((prev) => ({ ...prev, status }));
    };

    const clearFilters = () => {
        setFilters({ status: '', search: '' });
        setDebouncedSearch('');
    };

    const vendorRequests = data?.data || [];
    const hasActiveFilters = filters.status || filters.search;

    // Statistics
    const stats = useMemo(() => {
        if (!vendorRequests.length) {
            return {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
            };
        }
        return {
            total: vendorRequests.length,
            pending: vendorRequests.filter((r) => r.status === 'pending').length,
            approved: vendorRequests.filter((r) => r.status === 'approved').length,
            rejected: vendorRequests.filter((r) => r.status === 'rejected').length,
        };
    }, [vendorRequests]);

    return (
        <div className="space-y-6 w-full max-w-full overflow-hidden">
            {/* Header with Stats */}
            <Header stats={stats} />

            {/* Filters */}
            <FilterBar
                filters={filters}
                onSearchChange={handleSearchChange}
                onStatusChange={handleStatusChange}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                register={register}
            />

            {/* Content */}
            <div className="w-full max-w-full overflow-hidden">
                {isLoading ? (
                    <SkeletonLoader />
                ) : isError ? (
                    <ErrorState error={error} />
                ) : vendorRequests.length === 0 ? (
                    <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} />
                ) : (
                    <>
                        {/* Desktop Table - Hidden on mobile */}
                        <div className="hidden lg:block">
                            <DesktopTable requests={vendorRequests} />
                        </div>

                        {/* Mobile Cards - Hidden on desktop */}
                        <div className="lg:hidden">
                            <MobileCardList requests={vendorRequests} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ============================================
// Header Component
// ============================================

function Header({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Requests */}
            <div className="bg-emerald-600 dark:bg-emerald-700 rounded-xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Users className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        <span>Live</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-emerald-50">Total Requests</p>
                    <p className="text-4xl font-bold">{stats.total}</p>
                </div>
            </div>

            {/* Pending Review */}
            <StatCard
                label="Pending Review"
                value={stats.pending}
                icon={Clock}
                color="amber"
            />

            {/* Approved */}
            <StatCard
                label="Approved"
                value={stats.approved}
                icon={CheckCircle}
                color="green"
            />

            {/* Rejected */}
            <StatCard
                label="Rejected"
                value={stats.rejected}
                icon={XCircle}
                color="red"
            />
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }) {
    const colorClasses = {
        amber: {
            bg: 'bg-white dark:bg-gray-800',
            text: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-200 dark:border-amber-800',
            iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        },
        green: {
            bg: 'bg-white dark:bg-gray-800',
            text: 'text-green-600 dark:text-green-400',
            border: 'border-green-200 dark:border-green-800',
            iconBg: 'bg-green-100 dark:bg-green-900/50',
        },
        red: {
            bg: 'bg-white dark:bg-gray-800',
            text: 'text-red-600 dark:text-red-400',
            border: 'border-red-200 dark:border-red-800',
            iconBg: 'bg-red-100 dark:bg-red-900/50',
        },
    };

    const classes = colorClasses[color];

    return (
        <div className={`${classes.bg} border ${classes.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 ${classes.iconBg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${classes.text}`} />
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className={`text-3xl font-bold ${classes.text}`}>{value}</p>
            </div>
        </div>
    );
}

// ============================================
// Filter Bar Component
// ============================================

function FilterBar({ filters, onSearchChange, onClearFilters, hasActiveFilters, onStatusChange, register }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex flex-wrap flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 min-w-0">
                    <div className="relative">
                        <div className="[&>div>input]:pl-10 [&>div>input]:focus:border-emerald-500 [&>div>input]:dark:focus:border-emerald-500">
                            <InputForm
                                name="search"
                                type="text"
                                placeholder="Search by name, email, company..."
                                register={register}
                            />
                        </div>
                    </div>
                </div>

                {/* Status Filter - Desktop */}
                <div className="hidden lg:flex items-center gap-2 flex-wrap">
                    {FILTER_OPTIONS.map((option) => (
                        <Button
                            key={option.value}
                            onClick={() => onStatusChange(option.value)}
                            color={filters.status === option.value ? 'green' : 'gray'}
                            variant={filters.status === option.value ? 'solid' : 'outline'}
                            className="whitespace-nowrap"
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden">
                    <Button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        color="gray"
                        variant="outline"
                        startIcon={<Filter className="w-5 h-5" />}
                        endIcon={
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                            />
                        }
                        className="w-full"
                    >
                        Filters
                    </Button>

                    {isFilterOpen && (
                        <div className="mt-3 space-y-2">
                            {FILTER_OPTIONS.map((option) => (
                                <Button
                                    key={option.value}
                                    onClick={() => {
                                        onStatusChange(option.value);
                                        setIsFilterOpen(false);
                                    }}
                                    color={filters.status === option.value ? 'green' : 'gray'}
                                    variant={filters.status === option.value ? 'solid' : 'outline'}
                                    className="w-full"
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        color="red"
                        variant="outline"
                        onClick={onClearFilters}
                        startIcon={<X className="w-4 h-4" />}
                        className="whitespace-nowrap"
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}

// ============================================
// Desktop Table Component
// ============================================

function DesktopTable({ requests }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Vendor
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Submitted
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {requests.map((request) => (
                            <DesktopTableRow key={request.id} request={request} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DesktopTableRow({ request }) {
    const statusConfig = STATUS_CONFIG[request.status];

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            {/* Vendor Details */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white dark:ring-gray-800 shadow-md">
                            {request.first_name[0]}
                            {request.last_name[0]}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {request.first_name} {request.last_name}
                        </div>
                        <a
                            href={`mailto:${request.email}`}
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline truncate block"
                        >
                            {request.email}
                        </a>
                    </div>
                </div>
            </td>

            {/* Company */}
            <td className="px-6 py-4">
                <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mt-0.5 shrink-0">
                        <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {request.company_name}
                        </div>
                        <a
                            href={`mailto:${request.company_email}`}
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline truncate block"
                        >
                            {request.company_email}
                        </a>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                    <a
                        href={`tel:${request.phone_number}`}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                    >
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium group-hover:underline whitespace-nowrap">{request.phone_number}</span>
                    </a>
                    <a
                        href={`tel:${request.company_phone}`}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                    >
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium group-hover:underline whitespace-nowrap">{request.company_phone}</span>
                    </a>
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass} animate-pulse`} />
                    {statusConfig.label}
                </span>
            </td>

            {/* Submitted */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium">{request.created_at_human}</span>
                </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-center">
                <Button
                    href={`/dashboard/vendor-requests/${request.id}`}
                    color="green"
                >
                    view
                </Button>
            </td>
        </tr>
    );
}

// ============================================
// Mobile Card List Component
// ============================================

function MobileCardList({ requests }) {
    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <MobileCard key={request.id} request={request} />
            ))}
        </div>
    );
}

function MobileCard({ request }) {
    const statusConfig = STATUS_CONFIG[request.status];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-4">
            {/* Header with Avatar and Status */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-gray-800 shadow-md">
                            {request.first_name[0]}
                            {request.last_name[0]}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {request.first_name} {request.last_name}
                        </h3>
                        <a
                            href={`mailto:${request.email}`}
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline truncate block"
                        >
                            {request.email}
                        </a>
                    </div>
                </div>
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 ${statusConfig.bgClass} ${statusConfig.textClass} ${statusConfig.borderClass}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass} animate-pulse`} />
                    {statusConfig.label}
                </span>
            </div>

            {/* Company Info */}
            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg mt-0.5 shrink-0">
                        <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {request.company_name}
                        </div>
                        <a
                            href={`mailto:${request.company_email}`}
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline truncate block"
                        >
                            {request.company_email}
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-3 text-sm">
                <a
                    href={`tel:${request.phone_number}`}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{request.phone_number}</span>
                </a>
                <a
                    href={`tel:${request.company_phone}`}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{request.company_phone}</span>
                </a>
            </div>

            {/* Date and Action */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{request.created_at_human}</span>
                </div>
                <Button
                    href={`/dashboard/vendor-requests/${request.id}`}
                    color="green"
                    startIcon={<Eye className="w-4 h-4" />}
                    className="!text-sm !px-4"
                >
                    View
                </Button>
            </div>
        </div>
    );
}

// ============================================
// Skeleton Loader Component
// ============================================

function SkeletonLoader() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 lg:p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 max-w-[150px]" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 max-w-[200px]" />
                        </div>
                        <div className="hidden sm:block h-8 w-20 lg:w-24 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
                        <div className="h-9 w-20 lg:w-28 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// Empty State Component
// ============================================

function EmptyState({ hasActiveFilters, onClearFilters }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 lg:p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {hasActiveFilters ? 'No requests found' : 'No vendor requests yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {hasActiveFilters
                        ? 'Try adjusting your filters to see more results'
                        : 'Vendor requests will appear here once submitted'}
                </p>
                {hasActiveFilters && (
                    <Button
                        onClick={onClearFilters}
                        color="green"
                        startIcon={<X className="w-4 h-4" />}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}

// ============================================
// Error State Component
// ============================================

function ErrorState({ error }) {
    return (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
            <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Failed to load requests</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error?.message || 'Something went wrong'}</p>
                <Button
                    onClick={() => window.location.reload()}
                    color="red"
                >
                    Reload Page
                </Button>
            </div>
        </div>
    );
}