'use client';

import React, { memo, useMemo, useState } from 'react';
import { useDashboardStats } from '@/queries/admin.query';
import { useModal } from '@/hooks/useModal';
import { useForm } from 'react-hook-form';
import {
    Users,
    Store,
    Package,
    FolderOpen,
    ShoppingCart,
    Clock,
    Star,
    AlertCircle,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Award,
    Eye,
    MessageSquare,
    UserCheck,
    PackageCheck,
    BarChart3,
    PieChart,
    Activity,
    ArrowUpRight,
    Edit,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import Avatar from '@/components/ui/Avatar';
import Modal from '@/components/modal/Modal';
import TextareaForm from '@/components/form/TextareaForm';
import SwitchForm from '@/components/form/SwitchForm';
import { formatCount, formatCurrency, getStatusColor } from '@/utils/helper';
import Link from 'next/link';
import DashboardSkeleton from './DashboardSkeleton';
import { useUpdateReview } from '@/queries/reviews.query';

// ============================================
// CONSTANTS
// ============================================
const CHART_COLORS = {
    primary: ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'],
    revenue: '#10b981',
    orders: '#3b82f6',
    customers: '#8b5cf6',
};

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = memo(({
    label,
    value,
    icon: Icon,
    iconColor = 'green',
    trend,
    trendLabel,
    href,
    subtitle
}) => {
    const content = (
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow group">
            <div className="flex items-start justify-between mb-4">
                <IconBadge
                    icon={<Icon className="w-full h-full" />}
                    variant="solid"
                    color={iconColor}
                    size="lg"
                    shape="square"
                />
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${trend >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {trend >= 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        )}
                        <span className={`text-xs font-bold ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Math.abs(trend)}%
                        </span>
                    </div>
                )}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                {(subtitle || trendLabel) && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {trendLabel || subtitle}
                    </p>
                )}
            </div>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
});

StatCard.displayName = 'StatCard';

// ============================================
// REVENUE CARD COMPONENT
// ============================================
const RevenueCard = memo(({ title, amount, period, growthRate, icon: Icon }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow group">
            <div className="flex items-start justify-between mb-4">
                <IconBadge
                    icon={<Icon className="w-full h-full" />}
                    variant="solid"
                    color="green"
                    size="lg"
                    shape="square"
                />
                {growthRate !== undefined && growthRate !== 0 && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${growthRate > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {growthRate > 0 ? (
                            <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        )}
                        <span className={`text-xs font-bold ${growthRate > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {Math.abs(growthRate)}%
                        </span>
                    </div>
                )}
            </div>

            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {title}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {formatCurrency(amount)}
                </p>
                {period && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {period}
                    </p>
                )}
            </div>
        </div>
    );
});

RevenueCard.displayName = 'RevenueCard';

// ============================================
// CHART CARD WRAPPER
// ============================================
const ChartCard = memo(({ title, children, action }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
            </h3>
            {action}
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
));

ChartCard.displayName = 'ChartCard';

// ============================================
// CUSTOM TOOLTIP
// ============================================
const CustomTooltip = memo(({ active, payload, label, formatter = (value) => value }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {label}
            </p>
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                        {entry.name}:
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatter(entry.value)}
                    </span>
                </div>
            ))}
        </div>
    );
});

CustomTooltip.displayName = 'CustomTooltip';

// ============================================
// REVIEW MODAL COMPONENT
// ============================================
const ReviewModal = memo(({ isOpen, onClose, review }) => {
    const { mutate: updateReview, isPending } = useUpdateReview();
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            comment: review?.comment || '',
            is_published: review?.is_published || false,
        }
    });

    const onSubmit = (data) => {
        updateReview({
            reviewId: review.id,
            reviewData: data
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Review Details"
            description="Moderate and manage customer review"
            maxWidth="max-w-2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Review Info */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={review?.user?.avatar}
                                initials={review?.user?.name}
                                size="md"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {review?.user?.name || 'Anonymous'}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review?.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <TextBadge
                            variant="light"
                            color={review?.is_published ? 'green' : 'orange'}
                            size="sm"
                        >
                            {review?.is_published ? 'Published' : 'Pending'}
                        </TextBadge>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Product</p>
                        <Link
                            href={`/dashboard/products/${review?.product?.slug}`}
                            className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
                        >
                            {review?.product?.title}
                        </Link>
                    </div>
                </div>

                {/* Comment Field */}
                <TextareaForm
                    label="Review Comment"
                    name="comment"
                    register={register}
                    error={errors.comment?.message}
                    placeholder="Customer review..."
                    rows={5}
                    required
                />

                {/* Publish Toggle */}
                <SwitchForm
                    label="Publish Review"
                    name="is_published"
                    control={control}
                    description="Toggle to publish or unpublish this review"
                    color="green"
                />

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
});

ReviewModal.displayName = 'ReviewModal';

// ============================================
// CHART COMPONENTS
// ============================================
const RevenueTrendsChart = memo(({ data }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: item.revenue,
            orders: item.orders_count,
        }));
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.revenue} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={CHART_COLORS.revenue}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
});

RevenueTrendsChart.displayName = 'RevenueTrendsChart';

const OrderValueDistributionChart = memo(({ data }) => {
    const chartData = useMemo(() => {
        if (!data) return [];
        return Object.entries(data).map(([range, count]) => ({
            range,
            count,
        }));
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="range"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                    dataKey="count"
                    fill={CHART_COLORS.orders}
                    radius={[8, 8, 0, 0]}
                    name="Orders"
                />
            </BarChart>
        </ResponsiveContainer>
    );
});

OrderValueDistributionChart.displayName = 'OrderValueDistributionChart';

const RatingDistributionChart = memo(({ data }) => {
    const chartData = useMemo(() => {
        if (!data) return [];
        return Object.entries(data)
            .map(([rating, count]) => ({
                name: `${rating} Stars`,
                value: count,
                rating: parseInt(rating),
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.rating - a.rating);
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-400">
                No reviews yet
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={320}>
            <RechartsPieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
});

RatingDistributionChart.displayName = 'RatingDistributionChart';

const CategoryPerformanceChart = memo(({ data }) => {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data
            .filter(cat => cat.total_revenue > 0)
            .slice(0, 6)
            .map(cat => ({
                name: cat.title.length > 15 ? `${cat.title.substring(0, 15)}...` : cat.title,
                revenue: cat.total_revenue,
                sales: cat.total_sales,
            }));
    }, [data]);

    if (chartData.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-400">
                No sales data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                <Bar dataKey="revenue" fill={CHART_COLORS.revenue} radius={[8, 8, 0, 0]} name="Revenue" />
                <Bar dataKey="sales" fill={CHART_COLORS.customers} radius={[8, 8, 0, 0]} name="Units Sold" />
            </BarChart>
        </ResponsiveContainer>
    );
});

CategoryPerformanceChart.displayName = 'CategoryPerformanceChart';

// ============================================
// TABLE COMPONENTS
// ============================================
const TableWrapper = memo(({ children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {children}
        </table>
    </div>
));

TableWrapper.displayName = 'TableWrapper';

const TableHeader = memo(({ columns }) => (
    <thead className="bg-gray-50 dark:bg-gray-900/50">
        <tr>
            {columns.map((col, idx) => (
                <th
                    key={idx}
                    className={`px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                    {col.label}
                </th>
            ))}
        </tr>
    </thead>
));

TableHeader.displayName = 'TableHeader';

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const AdminDashboard = () => {
    const { data, isLoading, isError } = useDashboardStats();
    const { isOpen: isReviewModalOpen, openModal: openReviewModal, closeModal: closeReviewModal } = useModal(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const stats = useMemo(() => {
        if (!data?.data) return null;

        const {
            overview,
            revenue,
            orders,
            products,
            customers,
            reviews,
            trends,
            categories,
            recent_activities,
        } = data.data;

        return {
            overview,
            revenue,
            orders,
            products,
            customers,
            reviews,
            trends,
            categories,
            recent_activities,
        };
    }, [data]);

    const handleReviewClick = (review) => {
        setSelectedReview(review);
        openReviewModal();
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (isError || !stats) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-700 p-16">
                <div className="flex flex-col items-center justify-center">
                    <IconBadge
                        icon={<AlertCircle className="w-full h-full" />}
                        variant="light"
                        color="red"
                        size="2xl"
                        shape="circle"
                    />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 mt-4">
                        Failed to Load Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                        Unable to fetch dashboard statistics. Please refresh the page or try again later.
                    </p>
                </div>
            </div>
        );
    }

    const { overview, revenue, orders, products, customers, reviews, trends, categories, recent_activities } = stats;

    return (
        <>
            <div className="space-y-8 pb-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Welcome back! Here's what's happening with your store today.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                {/* Overview Stats Grid */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Quick Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Customers"
                            value={overview.users.total_customers}
                            icon={Users}
                            iconColor="blue"
                            subtitle={`${overview.users.active_users} active users`}
                            href="/dashboard/users"
                        />
                        <StatCard
                            label="Total Vendors"
                            value={overview.users.total_vendors}
                            icon={Store}
                            iconColor="purple"
                            subtitle={`vendors`}
                            href="/dashboard/vendors"
                        />
                        <StatCard
                            label="Total Products"
                            value={overview.products.total}
                            icon={Package}
                            iconColor="green"
                            subtitle={`${overview.products.in_stock} in stock`}
                            href="/dashboard/products"
                        />
                        <StatCard
                            label="Categories"
                            value={overview.categories.total}
                            icon={FolderOpen}
                            iconColor="orange"
                            subtitle={`${overview.categories.with_products} with products`}
                            href="/dashboard/categories"
                        />
                    </div>
                </div>

                {/* Revenue Section */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Revenue Metrics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <RevenueCard
                            title="Today's Revenue"
                            amount={revenue.today.revenue}
                            period={revenue.today.comparison_label}
                            growthRate={revenue.today.growth_rate}
                            icon={DollarSign}
                        />
                        <RevenueCard
                            title="This Week"
                            amount={revenue.this_week.revenue}
                            period={revenue.this_week.comparison_label}
                            growthRate={revenue.this_week.growth_rate}
                            icon={TrendingUp}
                        />
                        <RevenueCard
                            title="This Month"
                            amount={revenue.this_month.revenue}
                            period={revenue.this_month.comparison_label}
                            growthRate={revenue.this_month.growth_rate}
                            icon={Calendar}
                        />
                        <RevenueCard
                            title="Total Revenue"
                            amount={revenue.total_revenue}
                            period={`Avg: ${formatCurrency(revenue.average_order_value)}/order`}
                            icon={Award}
                        />
                    </div>
                </div>

                {/* Orders & Products Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <StatCard
                        label="Order Completion Rate"
                        value={`${orders.completion_rate}%`}
                        icon={PackageCheck}
                        iconColor="green"
                        subtitle={`Avg ${orders.average_processing_time_hours}hrs processing`}
                    />
                    <StatCard
                        label="View to Sale Conversion"
                        value={`${products.metrics.conversion_rate}%`}
                        icon={Activity}
                        iconColor="blue"
                        subtitle={`${formatCount(products.metrics.total_views)} total views`}
                    />
                    <StatCard
                        label="Customer Satisfaction"
                        value={`${reviews.average_rating}/5`}
                        icon={Star}
                        iconColor="orange"
                        subtitle={`${reviews.review_rate}% review rate`}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard
                        title="Revenue Trends (30 Days)"
                        action={
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <BarChart3 className="w-4 h-4" />
                                <span>Daily Sales</span>
                            </div>
                        }
                    >
                        <RevenueTrendsChart data={trends.daily_sales_30_days} />
                    </ChartCard>

                    <ChartCard
                        title="Order Value Distribution"
                        action={
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <PieChart className="w-4 h-4" />
                                <span>Price Ranges</span>
                            </div>
                        }
                    >
                        <OrderValueDistributionChart data={orders.value_distribution} />
                    </ChartCard>

                    <ChartCard title="Top Categories by Revenue">
                        <CategoryPerformanceChart data={categories.performance} />
                    </ChartCard>

                    <ChartCard title="Review Rating Distribution">
                        <RatingDistributionChart data={reviews.rating_distribution} />
                    </ChartCard>
                </div>

                {/* Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <IconBadge
                                    icon={<ShoppingCart className="w-full h-full" />}
                                    variant="light"
                                    color="blue"
                                    size="sm"
                                />
                                Recent Orders
                            </h3>
                            <Link
                                href="/dashboard/orders"
                                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center gap-1"
                            >
                                View All
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <TableWrapper>
                            <TableHeader
                                columns={[
                                    { label: 'Order ID', align: 'left' },
                                    { label: 'Customer', align: 'left' },
                                    { label: 'Status', align: 'center' },
                                    { label: 'Total', align: 'right' },
                                ]}
                            />
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent_activities.orders.slice(0, 6).map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Link
                                                href={`/dashboard/orders/${order.reference}`}
                                                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                                            >
                                                #{order.reference.split('-')[1]?.substring(0, 8)}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">
                                                {order.user_name}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <TextBadge
                                                variant="light"
                                                color={getStatusColor(order.status)}
                                                size="sm"
                                            >
                                                {order.status}
                                            </TextBadge>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {formatCurrency(order.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>

                    {/* Low Stock Products Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <IconBadge
                                    icon={<AlertCircle className="w-full h-full" />}
                                    variant="light"
                                    color="red"
                                    size="sm"
                                />
                                Low Stock Alert
                            </h3>
                            <Link
                                href="/dashboard/products"
                                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                            >
                                View All
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <TableWrapper>
                            <TableHeader
                                columns={[
                                    { label: 'Product', align: 'left' },
                                    { label: 'Category', align: 'left' },
                                    { label: 'Stock', align: 'center' },
                                    { label: 'Price', align: 'right' },
                                ]}
                            />
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.low_stock.slice(0, 6).map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Link
                                                href={`/dashboard/products/${product.slug}`}
                                                className="flex items-center gap-3 group"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                                                />
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate max-w-[140px]">
                                                    {product.title}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                                                {product.category}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <TextBadge
                                                variant="light"
                                                color={product.stock <= 3 ? 'red' : 'orange'}
                                                size="sm"
                                            >
                                                {product.stock}
                                            </TextBadge>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(product.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <IconBadge
                                    icon={<Award className="w-full h-full" />}
                                    variant="light"
                                    color="green"
                                    size="sm"
                                />
                                Top Sellers
                            </h3>
                            <Link
                                href="/dashboard/products"
                                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center gap-1"
                            >
                                All Products
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <TableWrapper>
                            <TableHeader
                                columns={[
                                    { label: 'Product', align: 'left' },
                                    { label: 'Sold', align: 'center' },
                                    { label: 'Revenue', align: 'right' },
                                ]}
                            />
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.top_selling.slice(0, 6).map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Link
                                                href={`/dashboard/products/${product.slug}`}
                                                className="flex items-center gap-3 group"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                                                    />
                                                    <TextBadge
                                                        variant="solid"
                                                        color={index === 0 ? 'green' : index === 1 ? 'blue' : 'gray'}
                                                        size="xs"
                                                        className="absolute -top-1 -right-1"
                                                    >
                                                        {index + 1}
                                                    </TextBadge>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate max-w-[160px]">
                                                    {product.title}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {product.total_sold}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-semibold text-green-600 dark:text-green-400">
                                            {formatCurrency(product.total_revenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>

                    {/* Pending Reviews */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <IconBadge
                                    icon={<MessageSquare className="w-full h-full" />}
                                    variant="light"
                                    color="orange"
                                    size="sm"
                                />
                                Pending Reviews
                            </h3>
                            <TextBadge variant="solid" color="orange" size="sm">
                                {reviews.pending_moderation.length}
                            </TextBadge>
                        </div>
                        <TableWrapper>
                            <TableHeader
                                columns={[
                                    { label: 'Customer', align: 'left' },
                                    { label: 'Product', align: 'left' },
                                    { label: 'Rating', align: 'center' },
                                    { label: 'Action', align: 'center' },
                                ]}
                            />
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {reviews.pending_moderation.slice(0, 6).map((review) => (
                                    <tr
                                        key={review.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    src={review.user?.avatar}
                                                    initials={review.user?.name}
                                                    size="sm"
                                                />
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[100px]">
                                                    {review.user?.name || 'Anonymous'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <Link
                                                href={`/dashboard/products/${review.product?.slug}`}
                                                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 truncate max-w-[140px] block"
                                            >
                                                {review.product?.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {review.rating}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <IconBadge
                                                icon={<Edit className="w-full h-full" />}
                                                variant="light"
                                                color="blue"
                                                size="sm"
                                                onClick={() => handleReviewClick(review)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                </div>

                {/* Customer Segments */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <IconBadge
                            icon={<UserCheck className="w-full h-full" />}
                            variant="light"
                            color="purple"
                            size="sm"
                        />
                        Customer Segments
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/30">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                                No Orders
                            </p>
                            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                {customers.segments.no_orders}
                            </p>
                            <p className="text-xs text-blue-600/80 dark:text-blue-500/80 mt-1">
                                Potential customers
                            </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700/30">
                            <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                                New Customers
                            </p>
                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                                {customers.segments.new_customers}
                            </p>
                            <p className="text-xs text-green-600/80 dark:text-green-500/80 mt-1">
                                First-time buyers
                            </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/30">
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                                Returning Customers
                            </p>
                            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                {customers.segments.returning_customers}
                            </p>
                            <p className="text-xs text-purple-600/80 dark:text-purple-500/80 mt-1">
                                Loyal buyers
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {selectedReview && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={closeReviewModal}
                    review={selectedReview}
                />
            )}
        </>
    );
};

export default AdminDashboard;