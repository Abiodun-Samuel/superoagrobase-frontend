'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
    Calendar,
    Clock,
    Eye,
    Tag,
    Share2,
    Link2,
    ArrowUp,
    Check,
    Star,
    FolderOpen,
    RefreshCw,
    Mail,
    MessageSquare,
    Send,
    MoreHorizontal,
} from 'lucide-react';
import { formatCount } from '@/utils/helper';

// ─── Utilities ───────────────────────────────────────────────────────────────

function formatDate(dateStr, options) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    });
}

function estimateReadTime(html = '') {
    const text = html.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function extractHeadings(html = '') {
    const matches = [...html.matchAll(/<h([2-3])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi)];
    return matches.map((m, i) => ({
        level: parseInt(m[1]),
        id: m[2] || `heading-${i}`,
        text: m[3].replace(/<[^>]*>/g, '').trim(),
    }));
}

function injectHeadingIds(html = '') {
    let index = 0;
    return html.replace(/<h([2-3])([^>]*)>/gi, (match, level, attrs) => {
        if (/id="/i.test(attrs)) return match;
        const id = `heading-${index++}`;
        return `<h${level}${attrs} id="${id}">`;
    });
}

// ─── Reading Progress ─────────────────────────────────────────────────────────

function ReadingProgressBar({ progress }) {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none">
            <div
                className="h-full transition-all duration-150 ease-out"
                style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #10b981, #0d9488, #0891b2)',
                }}
            />
        </div>
    );
}

// ─── Author Avatar ────────────────────────────────────────────────────────────

function Avatar({ author, size = 'md' }) {
    const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-xl' };
    const cls = sizes[size] ?? sizes.md;
    return author?.avatar ? (
        <img
            src={author.avatar}
            alt={author.full_name}
            className={`${cls} rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm flex-shrink-0`}
        />
    ) : (
        <div className={`${cls} rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-800 shadow-sm flex-shrink-0`}>
            {author?.initials ?? author?.full_name?.[0] ?? 'A'}
        </div>
    );
}

// ─── Table of Contents ────────────────────────────────────────────────────────

function TableOfContents({ headings, activeId }) {
    if (!headings.length) return null;

    const scrollTo = useCallback((e, id) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <nav aria-label="Table of contents">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-3">
                On this page
            </p>
            <ul className="space-y-0.5">
                {headings.map((h) => {
                    const isActive = activeId === h.id;
                    return (
                        <li key={h.id}>
                            <a
                                href={`#${h.id}`}
                                onClick={(e) => scrollTo(e, h.id)}
                                style={{ paddingLeft: h.level === 3 ? '0.875rem' : '0' }}
                                className={`
                                    group flex items-start gap-2.5 py-1.5 pr-2 text-[13px] leading-snug
                                    rounded-md transition-all duration-200
                                    ${isActive
                                        ? 'text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/80 dark:bg-teal-900/20 pl-2'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                    }
                                `}
                            >
                                <span className={`
                                    mt-[5px] flex-shrink-0 rounded-full transition-all duration-300
                                    ${isActive
                                        ? 'w-1.5 h-1.5 bg-teal-500'
                                        : 'w-1 h-1 bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-500 mt-[6px]'
                                    }
                                `} />
                                <span className="line-clamp-2">{h.text}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

// ─── Share Panel ──────────────────────────────────────────────────────────────

function SharePanel({ title, excerpt, url }) {
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);
    // Must be false on first render so SSR and client initial render match.
    // The real value is set in useEffect (client-only), preventing hydration mismatch.
    const [canNativeShare, setCanNativeShare] = useState(false);

    useEffect(() => {
        setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }, []);

    // Native Web Share API — most comprehensive, OS handles destination choice
    const handleNativeShare = useCallback(async () => {
        try {
            await navigator.share({ title, text: excerpt || title, url });
            setShared(true);
            setTimeout(() => setShared(false), 2500);
        } catch (err) {
            // User cancelled or not supported — no-op
            if (err?.name !== 'AbortError') console.warn('Share failed:', err);
        }
    }, [title, excerpt, url]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = url;
            document?.body?.appendChild(el);
            el.select();
            document.execCommand('copy');
            document?.body?.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [url]);

    const handleEmail = useCallback(() => {
        window.open(
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`I thought you'd enjoy this article:\n\n${title}\n\n${url}`)}`,
            '_self'
        );
    }, [title, url]);

    const handleWhatsApp = useCallback(() => {
        window.open(
            `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
            '_blank',
            'noopener,noreferrer'
        );
    }, [title, url]);

    const handleTelegram = useCallback(() => {
        window.open(
            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            '_blank',
            'noopener,noreferrer'
        );
    }, [title, url]);

    const shareActions = [
        {
            label: copied ? 'Copied!' : 'Copy link',
            icon: copied ? Check : Link2,
            onClick: handleCopy,
            highlight: copied,
            title: 'Copy article link',
        },
        {
            label: 'Email',
            icon: Mail,
            onClick: handleEmail,
            title: 'Share via email',
        },
        {
            label: 'WhatsApp',
            icon: MessageSquare,
            onClick: handleWhatsApp,
            title: 'Share on WhatsApp',
        },
        {
            label: 'Telegram',
            icon: Send,
            onClick: handleTelegram,
            title: 'Share on Telegram',
        },
    ];

    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-3">
                Share
            </p>
            <div className="space-y-2">
                {/* Primary: Native share (most platforms, most comprehensive) */}
                {canNativeShare && (
                    <button
                        onClick={handleNativeShare}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all duration-200 active:scale-95"
                    >
                        {shared
                            ? <><Check className="w-4 h-4" /> Shared!</>
                            : <><Share2 className="w-4 h-4" /> Share article</>
                        }
                    </button>
                )}

                {/* Secondary: individual platform buttons */}
                <div className="grid grid-cols-2 gap-1.5">
                    {shareActions.map(({ label, icon: Icon, onClick, highlight, title: tip }) => (
                        <button
                            key={label}
                            onClick={onClick}
                            title={tip}
                            className={`
                                flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium
                                transition-all duration-200 active:scale-95
                                ${highlight
                                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }
                            `}
                        >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Sidebar Section Label ─────────────────────────────────────────────────────

function SidebarLabel({ children }) {
    return (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-3">
            {children}
        </p>
    );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function SidebarDivider() {
    return <div className="h-px bg-slate-200 dark:bg-slate-700/80" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const BlogDetails = ({ blog }) => {
    const [readProgress, setReadProgress] = useState(0);
    const [activeHeadingId, setActiveHeadingId] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const articleRef = useRef(null);

    const processedContent = injectHeadingIds(blog?.content ?? '');
    const headings = extractHeadings(processedContent);
    const readTime = estimateReadTime(blog?.content ?? '');
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const hasBeenUpdated =
        blog?.updated_at &&
        blog?.created_at &&
        new Date(blog.updated_at) - new Date(blog.created_at) > 60_000;

    // Staggered entrance
    useEffect(() => {
        const t = setTimeout(() => setIsVisible(true), 60);
        return () => clearTimeout(t);
    }, []);

    // Scroll: reading progress + back-to-top
    useEffect(() => {
        const onScroll = () => {
            const el = articleRef.current;
            if (!el) return;
            const { top, height } = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrolled = Math.max(0, vh - top);
            setReadProgress(Math.min(100, (scrolled / (height + vh)) * 100));
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Active heading via IntersectionObserver
    useEffect(() => {
        if (!headings.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length) setActiveHeadingId(visible[0].target.id);
            },
            { rootMargin: '-8% 0px -72% 0px', threshold: 0 }
        );
        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [headings]);

    if (!blog) return null;

    return (
        <>
            <ReadingProgressBar progress={readProgress} />

            <article
                ref={articleRef}
                className={`transition-all space-y-10 my-10 duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            >
                {/* ── Article Header (all in natural flow) ─────────────────── */}
                <header className="mb-8">

                    {/* Category + Featured badges — in flow, above image */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                        {blog.category && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50">
                                <FolderOpen className="w-3 h-3" />
                                {blog.category}
                            </span>
                        )}
                        {blog.is_featured && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/40">
                                <Star className="w-3 h-3 fill-current" />
                                Featured
                            </span>
                        )}
                        {blog.status === 'draft' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                Draft
                            </span>
                        )}
                    </div>

                    {/* Excerpt — displayed as a styled lead paragraph */}
                    {blog.excerpt && (
                        <p className="text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-light mb-6 max-w-3xl border-l-4 border-teal-500 pl-5 italic">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Author + meta row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-200 dark:border-slate-700/80">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <Avatar author={blog.author} size="md" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                    {blog.author?.full_name ?? 'Unknown Author'}
                                </p>
                                {blog.author?.email && (
                                    <a
                                        href={`mailto:${blog.author.email}`}
                                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline leading-tight"
                                    >
                                        {blog.author.email}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Article meta */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            {blog.published_at && (
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {formatDate(blog.published_at)}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                {readTime} min read
                            </span>
                            {blog.views_count > 0 && (
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <Eye className="w-3.5 h-3.5" />
                                    {formatCount(blog.views_count)} views
                                </span>
                            )}
                            {hasBeenUpdated && (
                                <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                    <RefreshCw className="w-3 h-3" />
                                    Updated {formatDate(blog.updated_at, { month: 'short' })}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Hero Image — clean, no overlays ──────────────────────── */}
                {blog.featured_image && (
                    <figure className="mb-10">
                        <div className="w-full overflow-hidden rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-slate-900/50"
                            style={{ aspectRatio: '16/7' }}>
                            <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                    </figure>
                )}

                {/* ── Main Grid: Content + Sidebar ─────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12 items-start">

                    {/* Content */}
                    <div className="min-w-0">
                        <div
                            className="blog-prose"
                            dangerouslySetInnerHTML={{ __html: processedContent }}
                        />

                        {/* ── Tags ─────────────────────────────────────────── */}
                        {blog.tags?.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    {blog.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-200 cursor-default border border-transparent hover:border-teal-200 dark:hover:border-teal-800"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Author bio (bottom) ───────────────────────────── */}
                        {blog.author && (
                            <div className="mt-10">
                                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-4">
                                        Written by
                                    </p>
                                    <div className="flex items-start gap-4">
                                        <Avatar author={blog.author} size="lg" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-base leading-tight">
                                                {blog.author.full_name}
                                            </p>
                                            {blog.author.email && (
                                                <a
                                                    href={`mailto:${blog.author.email}`}
                                                    className="text-sm text-teal-600 dark:text-teal-400 hover:underline mt-0.5 inline-block"
                                                >
                                                    {blog.author.email}
                                                </a>
                                            )}
                                            {/* Article dates */}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                                                {blog.created_at && (
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                                        <Calendar className="w-3 h-3" />
                                                        Published {formatDate(blog.created_at, { month: 'short' })}
                                                    </span>
                                                )}
                                                {hasBeenUpdated && (
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                                        <RefreshCw className="w-3 h-3" />
                                                        Edited {formatDate(blog.updated_at, { month: 'short' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Mobile share (below author) ───────────────────── */}
                        <div className="lg:hidden mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <SharePanel title={blog.title} excerpt={blog.excerpt} url={currentUrl} />
                        </div>
                    </div>

                    {/* ── Sticky Sidebar ───────────────────────────────────── */}
                    <aside className="hidden lg:block" aria-label="Article sidebar">
                        <div className="sticky top-8 space-y-6">

                            {/* Author compact */}
                            <div>
                                <SidebarLabel>Author</SidebarLabel>
                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                    <Avatar author={blog.author} size="sm" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                                            {blog.author?.full_name ?? 'Unknown'}
                                        </p>
                                        {blog.published_at && (
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                                                {formatDate(blog.published_at, { month: 'short', year: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div>
                                <SidebarLabel>Article stats</SidebarLabel>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { icon: Clock, label: 'Read time', value: `${readTime} min` },
                                        { icon: Eye, label: 'Views', value: (blog.views_count ?? 0).toLocaleString() },
                                    ].map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                                            <Icon className="w-4 h-4 text-teal-500 mx-auto mb-1" />
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <SidebarDivider />

                            {/* TOC */}
                            {headings.length > 0 && (
                                <>
                                    <TableOfContents headings={headings} activeId={activeHeadingId} />
                                    <SidebarDivider />
                                </>
                            )}

                            {/* Share */}
                            <SharePanel title={blog.title} excerpt={blog.excerpt} url={currentUrl} />

                            <SidebarDivider />

                            {/* Reading progress */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <SidebarLabel>Progress</SidebarLabel>
                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                                        {Math.round(readProgress)}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300 ease-out"
                                        style={{
                                            width: `${readProgress}%`,
                                            background: 'linear-gradient(90deg, #10b981, #0d9488)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </article>

            {/* ── Prose Styles ──────────────────────────────────────────────── */}
            <style jsx global>{`
                .blog-prose {
                    color: #334155;
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: 1.0625rem;
                    line-height: 1.85;
                }
                .dark .blog-prose { color: #94a3b8; }

                /* Headings */
                .blog-prose h2,
                .blog-prose h3,
                .blog-prose h4,
                .blog-prose h5,
                .blog-prose h6 {
                    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                    font-weight: 700;
                    color: #0f172a;
                    line-height: 1.3;
                    scroll-margin-top: 5.5rem;
                }
                .dark .blog-prose h2,
                .dark .blog-prose h3,
                .dark .blog-prose h4,
                .dark .blog-prose h5,
                .dark .blog-prose h6 { color: #f1f5f9; }

                .blog-prose h2 {
                    font-size: 1.5rem;
                    margin-top: 2.75rem;
                    margin-bottom: 1rem;
                    padding-bottom: 0.6rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .dark .blog-prose h2 { border-bottom-color: #1e293b; }
                .blog-prose h3 {
                    font-size: 1.2rem;
                    margin-top: 2rem;
                    margin-bottom: 0.75rem;
                }
                .blog-prose h4 {
                    font-size: 1.05rem;
                    margin-top: 1.75rem;
                    margin-bottom: 0.5rem;
                }

                /* Paragraph */
                .blog-prose p { margin-bottom: 1.5rem; }
                .blog-prose p:last-child { margin-bottom: 0; }

                /* Lead paragraph */
                .blog-prose > p:first-of-type {
                    font-size: 1.125rem;
                    color: #475569;
                    line-height: 1.8;
                }
                .dark .blog-prose > p:first-of-type { color: #94a3b8; }

                /* Links */
                .blog-prose a {
                    color: #0d9488;
                    text-decoration: underline;
                    text-decoration-color: #99f6e4;
                    text-underline-offset: 3px;
                    transition: color 0.15s, text-decoration-color 0.15s;
                    font-style: normal;
                }
                .blog-prose a:hover {
                    color: #0f766e;
                    text-decoration-color: #0d9488;
                }
                .dark .blog-prose a { color: #2dd4bf; }
                .dark .blog-prose a:hover { color: #5eead4; }

                /* Lists */
                .blog-prose ul,
                .blog-prose ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .blog-prose ul { list-style-type: disc; }
                .blog-prose ol { list-style-type: decimal; }
                .blog-prose li {
                    margin-bottom: 0.45rem;
                    padding-left: 0.25rem;
                }
                .blog-prose li::marker { color: #0d9488; }

                /* Blockquote */
                .blog-prose blockquote {
                    margin: 2rem 0;
                    padding: 1.25rem 1.5rem 1.25rem 1.75rem;
                    border-left: 4px solid #0d9488;
                    background: #f0fdfa;
                    border-radius: 0 12px 12px 0;
                    font-style: italic;
                    color: #475569;
                }
                .dark .blog-prose blockquote {
                    background: rgba(13, 148, 136, 0.06);
                    color: #94a3b8;
                }
                .blog-prose blockquote p { margin-bottom: 0; font-size: 1.05em; }

                /* Code inline */
                .blog-prose :not(pre) > code {
                    font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
                    font-size: 0.85em;
                    padding: 0.15em 0.45em;
                    border-radius: 5px;
                    background: #f1f5f9;
                    color: #0d9488;
                    border: 1px solid #e2e8f0;
                    white-space: nowrap;
                }
                .dark .blog-prose :not(pre) > code {
                    background: #1e293b;
                    color: #2dd4bf;
                    border-color: #334155;
                }

                /* Code block */
                .blog-prose pre {
                    margin: 1.75rem 0;
                    padding: 1.5rem 1.75rem;
                    border-radius: 14px;
                    overflow-x: auto;
                    background: #0f172a !important;
                    border: 1px solid #1e293b;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
                }
                .blog-prose pre code {
                    background: transparent !important;
                    border: none !important;
                    color: #e2e8f0 !important;
                    padding: 0 !important;
                    font-size: 0.875rem;
                    line-height: 1.75;
                    white-space: pre;
                }

                /* Table */
                .blog-prose table {
                    width: 100%;
                    margin: 2rem 0;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                    overflow: hidden;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }
                .dark .blog-prose table { border-color: #1e293b; }
                .blog-prose thead { background: #f8fafc; }
                .dark .blog-prose thead { background: #1e293b; }
                .blog-prose th {
                    padding: 0.8rem 1rem;
                    text-align: left;
                    font-weight: 600;
                    font-family: ui-sans-serif, system-ui, sans-serif;
                    color: #0f172a;
                    border-bottom: 1px solid #e2e8f0;
                }
                .dark .blog-prose th { color: #f1f5f9; border-bottom-color: #334155; }
                .blog-prose td {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: top;
                }
                .dark .blog-prose td { border-bottom-color: #1e293b; }
                .blog-prose tbody tr:last-child td { border-bottom: none; }
                .blog-prose tbody tr:hover td { background: #f8fafc; }
                .dark .blog-prose tbody tr:hover td { background: rgba(255,255,255,0.02); }

                /* Images */
                .blog-prose img {
                    width: 100%;
                    border-radius: 12px;
                    margin: 2rem 0;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                /* HR */
                .blog-prose hr {
                    margin: 2.5rem 0;
                    border: none;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #cbd5e1, transparent);
                }
                .dark .blog-prose hr {
                    background: linear-gradient(to right, transparent, #334155, transparent);
                }

                /* Strong / Em */
                .blog-prose strong {
                    color: #0f172a;
                    font-weight: 700;
                }
                .dark .blog-prose strong { color: #f1f5f9; }
                .blog-prose em { font-style: italic; }

                /* Figure captions */
                .blog-prose figcaption {
                    text-align: center;
                    font-size: 0.85rem;
                    color: #94a3b8;
                    margin-top: -1rem;
                    font-style: italic;
                }
            `}</style>
        </>
    );
};

export default BlogDetails;