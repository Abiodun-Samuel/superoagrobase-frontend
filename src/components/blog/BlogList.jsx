'use client';

import {
    useState, useCallback, useEffect, useTransition,
    useReducer, useMemo, useRef, memo,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Search, X, Calendar, Clock, Eye,
    Star, BookOpen, Loader2, TrendingUp,
    Filter, ArrowRight, FolderOpen,
    LayoutGrid, Rows3, FileText,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import TextBadge from '@/components/ui/TextBadge';
import InputForm from '@/components/form/InputForm';
import Paginator from '@/components/common/Paginator';

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

function estimateReadTime(html = '') {
    const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function stripHtml(html = '') {
    return html.replace(/<[^>]*>/g, '').trim();
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH': return { ...state, search: action.payload };
        case 'SET_CATEGORY': return { ...state, category: action.payload };
        case 'RESET': return { search: '', category: null };
        case 'SYNC': return { ...state, ...action.payload };
        default: return state;
    }
};

// ─── Avatar ────────────────────────────────────────────────────────────────────

const Avatar = memo(({ author, size = 'sm' }) => {
    const cls = size === 'md' ? 'w-10 h-10 text-sm' : 'w-7 h-7 text-xs';
    return author?.avatar
        ? <img src={author.avatar} alt={author.full_name ?? ''} loading="lazy"
            className={`${cls} rounded-full object-cover ring-2 ring-white dark:ring-gray-800 flex-shrink-0`} />
        : <div className={`${cls} rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-gray-800 flex-shrink-0`}>
            {author?.initials ?? author?.full_name?.[0] ?? 'A'}
        </div>;
});
Avatar.displayName = 'Avatar';

// ─── Featured Card ─────────────────────────────────────────────────────────────

const FeaturedCard = memo(({ blog }) => {
    const readTime = estimateReadTime(blog.content);
    return (
        <Link
            href={`/blogs/${blog.slug}`}
            className="group grid grid-cols-1 sm:grid-cols-[2fr_3fr] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1"
        >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ minHeight: '240px' }}>
                {blog.featured_image
                    ? <img src={blog.featured_image} alt={blog.title} loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20">
                        <BookOpen className="w-14 h-14 text-teal-200 dark:text-teal-800" />
                    </div>
                }
            </div>

            {/* Body */}
            <div className="flex flex-col justify-between p-7 sm:p-8">
                <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <TextBadge variant="solid" color="amber" size="sm"
                            startIcon={<Star className="w-3 h-3 fill-current" />}>Featured</TextBadge>
                        {blog.category && (
                            <TextBadge variant="light" color="teal" size="sm"
                                startIcon={<FolderOpen className="w-3 h-3" />}>{blog.category}</TextBadge>
                        )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-3 group-hover:text-[#66BB6A] dark:group-hover:text-[#66BB6A] transition-colors duration-200 line-clamp-2">
                        {blog.title}
                    </h2>

                    {blog.excerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                            {stripHtml(blog.excerpt)}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4 pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar author={blog.author} size="sm" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate leading-none">
                                {blog.author?.full_name ?? 'Author'}
                            </p>
                            {blog.published_at && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-none">
                                    {formatDate(blog.published_at)}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <Clock className="w-3 h-3" />{readTime}m read
                        </span>
                        {(blog.views_count ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                <Eye className="w-3 h-3" />
                                {blog.views_count >= 1000 ? `${(blog.views_count / 1000).toFixed(1)}k` : blog.views_count}
                            </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-[#66BB6A] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                </div>
            </div>
        </Link>
    );
});
FeaturedCard.displayName = 'FeaturedCard';

// ─── Blog Card ─────────────────────────────────────────────────────────────────

const BlogCard = memo(({ blog }) => {
    const readTime = estimateReadTime(blog.content);
    return (
        <Link
            href={`/blogs/${blog.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg dark:hover:shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 h-full"
        >
            {/* Image */}
            <div className="overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0" style={{ height: '196px' }}>
                {blog.featured_image
                    ? <img src={blog.featured_image} alt={blog.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                        <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                }
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {blog.is_featured && (
                        <TextBadge variant="light" color="amber" size="xs"
                            startIcon={<Star className="w-2.5 h-2.5 fill-current" />}>Featured</TextBadge>
                    )}
                    {blog.category && (
                        <TextBadge variant="light" color="teal" size="xs">{blog.category}</TextBadge>
                    )}
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2 line-clamp-2 group-hover:text-[#66BB6A] dark:group-hover:text-[#66BB6A] transition-colors duration-200">
                    {blog.title}
                </h3>

                {blog.excerpt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-auto">
                        {stripHtml(blog.excerpt)}
                    </p>
                )}

                {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {blog.tags.slice(0, 2).map(t => (
                            <TextBadge key={t} variant="light" color="slate" size="xs">#{t}</TextBadge>
                        ))}
                        {blog.tags.length > 2 && (
                            <TextBadge variant="light" color="slate" size="xs">+{blog.tags.length - 2}</TextBadge>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 min-w-0">
                        <Avatar author={blog.author} size="sm" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {blog.author?.full_name ?? 'Author'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime}m</span>
                        {(blog.views_count ?? 0) > 0 && (
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {blog.views_count >= 1000 ? `${(blog.views_count / 1000).toFixed(1)}k` : blog.views_count}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
});
BlogCard.displayName = 'BlogCard';

// ─── List Row ──────────────────────────────────────────────────────────────────

const BlogListRow = memo(({ blog }) => {
    const readTime = estimateReadTime(blog.content);
    return (
        <Link
            href={`/blogs/${blog.slug}`}
            className="group flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200"
        >
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                {blog.featured_image
                    ? <img src={blog.featured_image} alt={blog.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                    </div>
                }
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {blog.is_featured && (
                        <TextBadge variant="light" color="amber" size="xs"
                            startIcon={<Star className="w-2.5 h-2.5 fill-current" />}>Featured</TextBadge>
                    )}
                    {blog.category && (
                        <TextBadge variant="light" color="teal" size="xs">{blog.category}</TextBadge>
                    )}
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-[#66BB6A] transition-colors duration-200 mb-1">
                    {blog.title}
                </h3>
                {blog.excerpt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                        {stripHtml(blog.excerpt)}
                    </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <span>{blog.author?.full_name ?? 'Author'}</span>
                    {blog.published_at && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{formatDate(blog.published_at)}
                        </span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime}m</span>
                </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#66BB6A] group-hover:translate-x-0.5 transition-all duration-200 mt-1 flex-shrink-0" />
        </Link>
    );
});
BlogListRow.displayName = 'BlogListRow';

// ─── Active Filters Summary ────────────────────────────────────────────────────

const ActiveFiltersSummary = memo(({ filters, onRemoveSearch, onRemoveCategory }) => {
    const hasActive = !!(filters.search || filters.category);
    if (!hasActive) return null;
    return (
        <div className="flex items-center flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Active filters:</span>
            {filters.search && (
                <TextBadge variant="light" color="blue" size="sm"
                    onClick={onRemoveSearch}
                    endIcon={<X className="w-3 h-3" />}>
                    Search: {filters.search.length > 24 ? filters.search.slice(0, 24) + '…' : filters.search}
                </TextBadge>
            )}
            {filters.category && (
                <TextBadge variant="light" color="teal" size="sm"
                    onClick={onRemoveCategory}
                    endIcon={<X className="w-3 h-3" />}>
                    {filters.category}
                </TextBadge>
            )}
        </div>
    );
});
ActiveFiltersSummary.displayName = 'ActiveFiltersSummary';

// ─── Section Label ─────────────────────────────────────────────────────────────

const SectionLabel = memo(({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 mb-5">
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 select-none">
            {children}
        </h2>
    </div>
));
SectionLabel.displayName = 'SectionLabel';

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = memo(({ search, category, onClear }) => (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5 shadow-inner">
            <FileText className="w-9 h-9 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {search ? 'No results found' : 'No articles yet'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
            {search
                ? `We couldn't find any articles matching "${search}"${category ? ` in "${category}"` : ''}.`
                : category
                    ? `No articles in the "${category}" category yet.`
                    : 'Check back soon for fresh content.'}
        </p>
        {(search || category) && (
            <Button color="gray" variant="outline" onClick={onClear}
                startIcon={<X className="w-4 h-4" />}>
                Clear all filters
            </Button>
        )}
    </div>
));
EmptyState.displayName = 'EmptyState';

// ─── Main BlogList ─────────────────────────────────────────────────────────────

const BlogList = ({ blogs: initialBlogs, meta: initialMeta, links: initialLinks, filters: initialFilters }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [layout, setLayout] = useState('grid');

    // Filter state — decoupled from URL (only syncs on explicit submit or category click)
    const [filters, dispatchFilters] = useReducer(filterReducer, {
        search: initialFilters.search ?? '',
        category: initialFilters.category ?? null,
    });

    // Form — drives the InputForm for search
    const { register, setValue: setFormValue, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { search: initialFilters.search ?? '' },
    });

    // Sync form + reducer when URL changes via back/forward navigation
    useEffect(() => {
        const urlSearch = searchParams.get('search') ?? '';
        const urlCategory = searchParams.get('category') ?? null;
        setFormValue('search', urlSearch);
        dispatchFilters({ type: 'SYNC', payload: { search: urlSearch, category: urlCategory } });
    }, [searchParams, setFormValue]);

    // Derived data
    const categories = useMemo(() =>
        Array.from(new Set(initialBlogs.map(b => b.category).filter(Boolean))).sort(),
        [initialBlogs]
    );

    const featuredBlogs = useMemo(() => initialBlogs.filter(b => b.is_featured), [initialBlogs]);
    const regularBlogs = useMemo(() =>
        featuredBlogs.length > 0 ? initialBlogs.filter(b => !b.is_featured) : initialBlogs,
        [initialBlogs, featuredBlogs]
    );

    const hasActiveFilters = !!(initialFilters.search || initialFilters.category);
    const currentPage = initialMeta.current_page ?? 1;
    const totalPages = initialMeta.last_page ?? 1;

    // ── Navigation ────────────────────────────────────────────────────────────

    const navigate = useCallback((updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v == null || v === '') params.delete(k);
            else params.set(k, String(v));
        });
        params.delete('page');
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }, [router, pathname, searchParams]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    // Explicit submit — button click only, no debounce
    const handleApply = useCallback((formData) => {
        navigate({ search: formData.search || null, category: filters.category });
    }, [navigate, filters.category]);

    const handleCategoryClick = useCallback((cat) => {
        const next = cat === filters.category ? null : cat;
        dispatchFilters({ type: 'SET_CATEGORY', payload: next });
        navigate({ search: initialFilters.search, category: next });
    }, [filters.category, initialFilters.search, navigate]);

    const handleRemoveSearch = useCallback(() => {
        setFormValue('search', '');
        dispatchFilters({ type: 'SET_SEARCH', payload: '' });
        navigate({ search: null, category: initialFilters.category });
    }, [navigate, initialFilters.category, setFormValue]);

    const handleRemoveCategory = useCallback(() => {
        dispatchFilters({ type: 'SET_CATEGORY', payload: null });
        navigate({ search: initialFilters.search, category: null });
    }, [navigate, initialFilters.search]);

    const handleClearAll = useCallback(() => {
        setFormValue('search', '');
        dispatchFilters({ type: 'RESET' });
        navigate({ search: null, category: null });
    }, [navigate, setFormValue]);

    const handlePageChange = useCallback((page) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page && parseInt(page) > 1) params.set('page', String(page));
        else params.delete('page');
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: true });
        });
    }, [router, pathname, searchParams]);

    return (
        <div className={`space-y-6 my-10 transition-opacity duration-300 ${isPending ? 'opacity-60 pointer-events-none select-none' : 'opacity-100'}`}>

            {/* ── Filter Card ───────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filter Articles</h2>
                    {hasActiveFilters && (
                        <div className="ml-auto">
                            <Button variant="outline" color="gray" onClick={handleClearAll}
                                startIcon={<X className="w-3.5 h-3.5" />}>
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(handleApply)}>
                    <div className="flex gap-3">
                        <div className="flex-1 min-w-0">
                            <InputForm
                                name="search"
                                type="text"
                                register={register}
                                error={errors.search?.message}
                                placeholder="Search by title, author, or topic..."
                            />
                        </div>
                        <Button
                            type="submit"
                            color="green"
                            disabled={isPending}
                            startIcon={isPending
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Search className="w-4 h-4" />
                            }
                        >
                            Search
                        </Button>
                    </div>

                    <ActiveFiltersSummary
                        filters={initialFilters}
                        onRemoveSearch={handleRemoveSearch}
                        onRemoveCategory={handleRemoveCategory}
                    />
                </form>
            </div>

            {/* ── Category Pills + Layout Toggle ────────────────────────────── */}
            {categories.length > 0 && (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            color={!filters.category ? 'green' : 'gray'}
                            variant={!filters.category ? 'solid' : 'outline'}
                            disabled={isPending}
                            onClick={() => {
                                dispatchFilters({ type: 'SET_CATEGORY', payload: null });
                                navigate({ search: initialFilters.search, category: null });
                            }}
                        >
                            All Articles
                        </Button>
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                type="button"
                                color={filters.category === cat ? 'green' : 'gray'}
                                variant={filters.category === cat ? 'solid' : 'outline'}
                                disabled={isPending}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>

                    {/* Layout toggle */}
                    <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        {[
                            { key: 'grid', Icon: LayoutGrid, label: 'Grid' },
                            { key: 'list', Icon: Rows3, label: 'List' },
                        ].map(({ key, Icon, label }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setLayout(key)}
                                aria-label={`${label} view`}
                                className={`p-1.5 rounded-md transition-all duration-150 ${layout === key
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Results count ─────────────────────────────────────────────── */}
            {initialMeta.total > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isPending
                        ? <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading…</span>
                        : `Showing ${initialMeta.from ?? 1}–${initialMeta.to ?? initialBlogs.length} of ${initialMeta.total?.toLocaleString()} article${initialMeta.total !== 1 ? 's' : ''}`
                    }
                </p>
            )}

            {/* ── Empty State ───────────────────────────────────────────────── */}
            {initialBlogs.length === 0 && !isPending && (
                <EmptyState
                    search={initialFilters.search}
                    category={initialFilters.category}
                    onClear={handleClearAll}
                />
            )}

            {/* ── Featured Section ──────────────────────────────────────────── */}
            {featuredBlogs.length > 0 && (
                <section aria-label="Featured articles">
                    <SectionLabel icon={TrendingUp}>Featured</SectionLabel>
                    <div className="space-y-4">
                        {featuredBlogs.map(blog => (
                            <FeaturedCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Articles ──────────────────────────────────────────────────── */}
            {regularBlogs.length > 0 && (
                <section aria-label="All articles">
                    {featuredBlogs.length > 0 && (
                        <SectionLabel icon={BookOpen}>All Articles</SectionLabel>
                    )}

                    {layout === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {regularBlogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {regularBlogs.map(blog => <BlogListRow key={blog.id} blog={blog} />)}
                        </div>
                    )}
                </section>
            )}

            {/* ── Pagination ────────────────────────────────────────────────── */}
            {totalPages > 1 && initialLinks?.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Paginator
                        paginationData={initialMeta}
                        links={initialLinks}
                        setPage={handlePageChange}
                        limit={3}
                    />
                </div>
            )}
        </div>
    );
};

export default memo(BlogList);