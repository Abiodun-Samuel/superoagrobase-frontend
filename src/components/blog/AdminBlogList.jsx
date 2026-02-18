'use client';

import { useState, useMemo, useEffect, useCallback, useReducer, memo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
    FileText,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Star,
    TrendingUp,
    Calendar,
    Clock,
    Tag,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    StarOff,
    Plus,
    Share2,
    Check,
} from 'lucide-react';
import { useBlogs, useUpdateBlog, useDeleteBlog } from '@/queries/blogs.query';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import Avatar from '@/components/ui/Avatar';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import InputForm from '@/components/form/InputForm';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import Paginator from '@/components/common/Paginator';
import BlogListSkeleton from './BlogListSkeleton';
import DeleteBlogModal from './DeleteBlogModal';
import { truncateText, formatDate, formatCount } from '@/utils/helper';
import { useModal } from '@/hooks/useModal';

// ==================== CONSTANTS ====================
const PER_PAGE = 20;

const STATUS_OPTIONS = [
    { value: '', text: 'All Status' },
    { value: 'draft', text: 'Draft' },
    { value: 'published', text: 'Published' },
];

const FEATURED_OPTIONS = [
    { value: '', text: 'All Posts' },
    { value: 'true', text: 'Featured Only' },
    { value: 'false', text: 'Non-Featured' },
];

const STATUS_COLOR_MAP = {
    draft: 'gray',
    published: 'green',
};

// ==================== REDUCER ====================
const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, search: action.payload };
        case 'SET_CATEGORY':
            return { ...state, category: action.payload };
        case 'SET_STATUS':
            return { ...state, status: action.payload };
        case 'SET_FEATURED':
            return { ...state, is_featured: action.payload };
        case 'SET_SORT':
            return { ...state, sort_by: action.payload.column, sort_direction: action.payload.direction };
        case 'RESET':
            return action.payload;
        case 'SYNC_FROM_URL':
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

// ==================== UTILITY FUNCTIONS ====================
const getInitialFilters = (searchParams) => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    is_featured: searchParams.get('is_featured') || '',
    sort_by: searchParams.get('sort_by') || 'created_at',
    sort_direction: searchParams.get('sort_direction') || 'desc',
});

const getStatusColor = (status) => STATUS_COLOR_MAP[status?.toLowerCase()] || 'gray';

const buildURLFromFilters = (filters, page) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
    });
    if (page > 1) params.set('page', page.toString());
    return params.toString();
};

const getCategoryOptions = (blogs) => {
    const categories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
    return [
        { value: '', text: 'All Categories' },
        ...categories.map(cat => ({ value: cat, text: cat }))
    ];
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// ==================== MEMOIZED SUB-COMPONENTS ====================

// Page Header Component
const PageHeader = memo(({ onShareFilters, isShared }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Blog Posts
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your blog content and articles
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                color={isShared ? 'green' : 'gray'}
                size="sm"
                onClick={onShareFilters}
                startIcon={isShared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                title="Copy shareable URL with current filters"
            >
                {isShared ? 'Link Copied!' : 'Share Filters'}
            </Button>
            <Button
                color="purple"
                href="/dashboard/blogs/create"
                startIcon={<Plus className="w-5 h-5" />}
            >
                Create Blog Post
            </Button>
        </div>
    </div>
));
PageHeader.displayName = 'PageHeader';

// Bulk Actions Bar Component
const BulkActionsBar = memo(({
    selectedCount,
    onMarkFeatured,
    onRemoveFeatured,
    onClear,
    isUpdating
}) => (
    <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                        {selectedCount} Blog Post{selectedCount !== 1 ? 's' : ''} Selected
                    </h3>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                        Choose an action to apply to selected posts
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <Button
                    variant="outline"
                    color="yellow"
                    size="sm"
                    onClick={onMarkFeatured}
                    startIcon={<Star className="w-4 h-4" />}
                    disabled={isUpdating}
                    loading={isUpdating}
                >
                    Mark Featured
                </Button>
                <Button
                    variant="outline"
                    color="gray"
                    size="sm"
                    onClick={onRemoveFeatured}
                    startIcon={<StarOff className="w-4 h-4" />}
                    disabled={isUpdating}
                    loading={isUpdating}
                >
                    Remove Featured
                </Button>
                <Button
                    variant="outline"
                    color="gray"
                    size="sm"
                    onClick={onClear}
                    startIcon={<X className="w-4 h-4" />}
                >
                    Clear
                </Button>
            </div>
        </div>
    </div>
));
BulkActionsBar.displayName = 'BulkActionsBar';

// Active Filters Summary Component
const ActiveFiltersSummary = memo(({ filters }) => {
    const hasActiveFilters = filters.search || filters.category || filters.status || filters.is_featured;

    if (!hasActiveFilters) return null;

    return (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {filters.search && (
                <TextBadge variant="light" color="blue" size="sm">
                    Search: {truncateText(filters.search, 20)}
                </TextBadge>
            )}
            {filters.category && (
                <TextBadge variant="light" color="purple" size="sm">
                    Category: {filters.category}
                </TextBadge>
            )}
            {filters.status && (
                <TextBadge variant="light" color={getStatusColor(filters.status)} size="sm">
                    Status: {STATUS_OPTIONS.find(s => s.value === filters.status)?.text}
                </TextBadge>
            )}
            {filters.is_featured && (
                <TextBadge variant="light" color="yellow" size="sm">
                    Featured: {FEATURED_OPTIONS.find(f => f.value === filters.is_featured)?.text}
                </TextBadge>
            )}
        </div>
    );
});
ActiveFiltersSummary.displayName = 'ActiveFiltersSummary';

// Sort Button Component
const SortButton = memo(({ column, currentColumn, direction, onClick, children }) => {
    const isActive = currentColumn === column;
    const Icon = !isActive ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown;
    const iconColor = isActive ? 'text-purple-600' : 'text-gray-400';

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
            {children}
            <Icon className={`w-4 h-4 ${iconColor}`} />
        </button>
    );
});
SortButton.displayName = 'SortButton';

// Blog Row Component
const BlogRow = memo(({
    blog,
    isSelected,
    onSelect,
    onToggleFeatured,
    onDelete,
    isUpdating,
    isDeleting
}) => {
    const publishedDate = blog.published_at
        ? formatDate(blog.published_at)
        : <span className="text-gray-400 italic">Not published</span>;

    const lastModified = blog.updated_at || blog.created_at;

    return (
        <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <TableCell className="px-6 py-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(blog.id)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
            </TableCell>
            <TableCell className="px-6 py-4">
                <div className="flex items-start gap-3">
                    {blog.featured_image ? (
                        <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-20 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <Link
                            target='_blank'
                            href={`/blogs/${blog.slug}`}
                            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2 mb-1"
                        >
                            {blog.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <TrendingUp className="w-3 h-3" />

                                {formatCount(blog.views_count) || 0} views
                            </div>
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                {blog.author ? (
                    <div className="flex items-center gap-2">
                        <Avatar
                            src={blog.author.avatar}
                            alt={blog.author.full_name}
                            initials={blog.author.initials}
                            size="sm"
                            shape="circle"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {blog.author.full_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {blog.author.email}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                {blog.category ? (
                    <TextBadge variant="light" color="purple" size="sm">
                        {truncateText(blog.category, 15)}
                    </TextBadge>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </TableCell>
            <TableCell className="px-6 py-4">
                {blog.tags && blog.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                            <TextBadge
                                key={index}
                                variant="light"
                                color="blue"
                                size="xs"
                                startIcon={<Tag className="w-3 h-3" />}
                            >
                                {tag}
                            </TextBadge>
                        ))}
                        {blog.tags.length > 3 && (
                            <TextBadge variant="light" color="gray" size="xs">
                                +{blog.tags.length - 3}
                            </TextBadge>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                )}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{publishedDate}</span>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{formatDateTime(lastModified)}</span>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={() => onToggleFeatured(blog)}
                    disabled={isUpdating}
                    className="group relative"
                    aria-label={blog.is_featured ? 'Remove from featured' : 'Mark as featured'}
                >
                    {blog.is_featured ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 hover:text-yellow-600 transition-colors" />
                    ) : (
                        <Star className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-yellow-500 transition-colors" />
                    )}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {blog.is_featured ? 'Remove from featured' : 'Mark as featured'}
                    </span>
                </button>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <TextBadge
                        variant="light"
                        color={getStatusColor(blog.status)}
                        size="sm"
                        className="capitalize"
                        startIcon={blog.status === 'published' ?
                            <Check className="w-3 h-3" /> :
                            <Clock className="w-3 h-3" />
                        }
                    >
                        {blog.status}
                    </TextBadge>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                    <IconBadge
                        variant="light"
                        color="blue"
                        size="sm"
                        external
                        shape="circle"
                        icon={<Eye className="w-4 h-4" />}
                        href={`/blogs/${blog.slug}`}
                        ariaLabel="View blog post"
                    />
                    <IconBadge
                        variant="light"
                        color="purple"
                        size="sm"
                        shape="circle"
                        icon={<Edit className="w-4 h-4" />}
                        href={`/dashboard/blogs/${blog.slug}/edit`}
                        ariaLabel="Edit blog post"
                    />
                    <IconBadge
                        variant="light"
                        color="red"
                        size="sm"
                        shape="circle"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => onDelete(blog)}
                        disabled={isDeleting}
                        ariaLabel="Delete blog post"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
});
BlogRow.displayName = 'BlogRow';

// ==================== MAIN COMPONENT ====================
const AdminBlogList = () => {
    const searchParams = useSearchParams();

    // Initialize filters from URL only once on mount
    const initialFiltersRef = useRef(getInitialFilters(searchParams));
    const initialPageRef = useRef(parseInt(searchParams.get('page') || '1'));

    // State management - DECOUPLED from router
    const [filters, dispatchFilters] = useReducer(filterReducer, initialFiltersRef.current);
    const [page, setPage] = useState(initialPageRef.current);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isShared, setIsShared] = useState(false);

    // Modal states
    const deleteModal = useModal(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Form
    const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: filters,
    });

    // Watch form values
    const categoryValue = watch('category');
    const statusValue = watch('status');
    const featuredValue = watch('is_featured');

    // Active filters for API - This is what triggers data fetching
    const activeFilters = useMemo(() => ({
        search: filters.search,
        category: filters.category,
        status: filters.status,
        is_featured: filters.is_featured,
        sort_by: filters.sort_by,
        sort_direction: filters.sort_direction,
        page,
        per_page: PER_PAGE,
    }), [filters, page]);

    const hasActiveFilters = useMemo(() =>
        filters.search || filters.category || filters.status || filters.is_featured,
        [filters]
    );

    // Fetch blogs - NO router dependency
    const { data, isLoading, isError, error } = useBlogs(activeFilters);
    const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
    const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();

    const blogs = useMemo(() => data || [], [data]);
    const meta = useMemo(() => data?.meta || {}, [data?.meta]);
    const links = useMemo(() => data?.links || [], [data?.links]);

    // Generate category options from blog data
    const categoryOptions = useMemo(() => getCategoryOptions(blogs), [blogs]);

    // Handle form changes - NO router updates
    useEffect(() => {
        if (categoryValue !== filters.category) {
            dispatchFilters({ type: 'SET_CATEGORY', payload: categoryValue });
            setPage(1);
        }
    }, [categoryValue, filters.category]);

    useEffect(() => {
        if (statusValue !== filters.status) {
            dispatchFilters({ type: 'SET_STATUS', payload: statusValue });
            setPage(1);
        }
    }, [statusValue, filters.status]);

    useEffect(() => {
        if (featuredValue !== filters.is_featured) {
            dispatchFilters({ type: 'SET_FEATURED', payload: featuredValue });
            setPage(1);
        }
    }, [featuredValue, filters.is_featured]);

    useEffect(() => {
        setSelectAll(selectedBlogs.length === blogs.length && blogs.length > 0);
    }, [selectedBlogs.length, blogs.length]);

    // ==================== HANDLERS ====================

    const handleSearchSubmit = useCallback((data) => {
        dispatchFilters({ type: 'SET_SEARCH', payload: data.search });
        setPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        const defaultFilters = {
            search: '', category: '', status: '', is_featured: '',
            sort_by: 'created_at', sort_direction: 'desc',
        };
        setValue('search', '');
        setValue('category', '');
        setValue('status', '');
        setValue('is_featured', '');
        dispatchFilters({ type: 'RESET', payload: defaultFilters });
        setPage(1);
    }, [setValue]);

    const handleSort = useCallback((column) => {
        const newDirection = filters.sort_by === column && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        dispatchFilters({ type: 'SET_SORT', payload: { column, direction: newDirection } });
        setPage(1);
    }, [filters.sort_by, filters.sort_direction]);

    const handleSelectAll = useCallback(() => {
        setSelectedBlogs(selectAll ? [] : blogs.map(b => b.id));
        setSelectAll(!selectAll);
    }, [selectAll, blogs]);

    const handleSelectBlog = useCallback((blogId) => {
        setSelectedBlogs(prev =>
            prev.includes(blogId) ? prev.filter(id => id !== blogId) : [...prev, blogId]
        );
    }, []);

    const handleToggleFeatured = useCallback((blog) => {
        updateBlog({
            slug: blog.slug,
            payload: { is_featured: !blog.is_featured }
        });
    }, [updateBlog]);

    const handleBulkFeatured = useCallback(async (isFeatured) => {
        try {
            const updatePromises = selectedBlogs.map(blogId => {
                const blog = blogs.find(b => b.id === blogId);
                if (blog) {
                    return updateBlog({
                        slug: blog.slug,
                        payload: { is_featured: isFeatured }
                    });
                }
            });

            await Promise.all(updatePromises.filter(Boolean));
            setSelectedBlogs([]);
            setSelectAll(false);
        } catch (error) {
            console.error('Bulk update error:', error);
        }
    }, [selectedBlogs, blogs, updateBlog]);

    const handleDeleteBlog = useCallback((blog) => {
        setSelectedBlog(blog);
        deleteModal.openModal();
    }, [deleteModal]);

    const confirmDelete = useCallback((blogSlug) => {
        deleteBlog(blogSlug, {
            onSuccess: () => {
                deleteModal.closeModal();
                setSelectedBlog(null);
            },
        });
    }, [deleteBlog, deleteModal]);

    const handlePageChange = useCallback((newPage) => {
        setPage(parseInt(newPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedBlogs([]);
        setSelectAll(false);
    }, []);

    const handleShareFilters = useCallback(() => {
        const urlParams = buildURLFromFilters(filters, page);
        const shareableUrl = `${window.location.origin}${window.location.pathname}?${urlParams}`;

        window.history.replaceState({}, '', `?${urlParams}`);

        navigator.clipboard.writeText(shareableUrl).then(() => {
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        });
    }, [filters, page]);

    // ==================== RENDER ====================

    return (
        <div className="space-y-6 my-10">
            <PageHeader onShareFilters={handleShareFilters} isShared={isShared} />

            {selectedBlogs.length > 0 && (
                <BulkActionsBar
                    selectedCount={selectedBlogs.length}
                    onMarkFeatured={() => handleBulkFeatured(true)}
                    onRemoveFeatured={() => handleBulkFeatured(false)}
                    onClear={handleClearSelection}
                    isUpdating={isUpdating}
                />
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            color="gray"
                            size="sm"
                            onClick={handleClearFilters}
                            className="ml-auto"
                        >
                            Clear All
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit(handleSearchSubmit)} className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <InputForm
                                name="search"
                                type="text"
                                register={register}
                                error={errors.search?.message}
                                placeholder="Search by title, excerpt, or content..."
                            />
                        </div>
                        <Button
                            type="submit"
                            color="purple"
                            size="md"
                            startIcon={<Search className="w-4 h-4" />}
                        >
                            Search
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SingleSelectForm
                            name="category"
                            placeholder="Filter by category"
                            options={categoryOptions}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={categoryValue}
                        />
                        <SingleSelectForm
                            name="status"
                            placeholder="Filter by status"
                            options={STATUS_OPTIONS}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={statusValue}
                        />
                        <SingleSelectForm
                            name="is_featured"
                            placeholder="Filter by featured"
                            options={FEATURED_OPTIONS}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={featuredValue}
                        />
                    </div>
                </form>

                <ActiveFiltersSummary filters={filters} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoading && <BlogListSkeleton />}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Failed to Load Blog Posts
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                            {error?.response?.data?.message || 'An error occurred while fetching blog posts'}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && blogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Blog Posts Found
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                            {hasActiveFilters
                                ? 'No blog posts match your current filters. Try adjusting your search criteria.'
                                : 'Get started by creating your first blog post to share insights with your audience.'}
                        </p>
                        {hasActiveFilters ? (
                            <Button
                                variant="outline"
                                color="gray"
                                onClick={handleClearFilters}
                            >
                                Clear Filters
                            </Button>
                        ) : (
                            <Button
                                color="purple"
                                href="/dashboard/blogs/create"
                                startIcon={<Plus className="w-4 h-4" />}
                            >
                                Create Blog Post
                            </Button>
                        )}
                    </div>
                )}

                {!isLoading && !isError && blogs.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <TableHeader className="bg-gray-50 dark:bg-gray-900">
                                    <TableRow>
                                        <TableCell isHeader className="px-6 py-3 w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left min-w-[300px]">
                                            <SortButton
                                                column="title"
                                                currentColumn={filters.sort_by}
                                                direction={filters.sort_direction}
                                                onClick={() => handleSort('title')}
                                            >
                                                Blog Post
                                            </SortButton>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Author
                                            </span>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Category
                                            </span>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Tags
                                            </span>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Published
                                            </span>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <SortButton
                                                column="updated_at"
                                                currentColumn={filters.sort_by}
                                                direction={filters.sort_direction}
                                                onClick={() => handleSort('updated_at')}
                                            >
                                                Last Modified
                                            </SortButton>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Featured
                                            </span>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </span>
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-right">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {blogs.map((blog) => (
                                        <BlogRow
                                            key={blog.id}
                                            blog={blog}
                                            isSelected={selectedBlogs.includes(blog.id)}
                                            onSelect={handleSelectBlog}
                                            onToggleFeatured={handleToggleFeatured}
                                            onDelete={handleDeleteBlog}
                                            isUpdating={isUpdating}
                                            isDeleting={isDeleting}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {meta.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <Paginator
                                    paginationData={meta}
                                    links={links}
                                    setPage={handlePageChange}
                                    limit={3}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <DeleteBlogModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                blog={selectedBlog}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default memo(AdminBlogList);