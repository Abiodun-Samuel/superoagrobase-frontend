'use client';

import { Calendar, User, ArrowRight, Tag, Book } from 'lucide-react';
import Link from 'next/link';
import TextBadge from '../ui/TextBadge';
import { useFeaturedBlogs } from '@/queries/blogs.query';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

const BlogCardSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
        {/* Image placeholder */}
        <div className="h-48 bg-gray-200" />

        {/* Content */}
        <div className="p-6 space-y-3">
            {/* Meta row */}
            <div className="flex items-center gap-4">
                <div className="h-3.5 w-20 bg-gray-200 rounded-full" />
                <div className="h-3.5 w-24 bg-gray-200 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded-full" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
                <div className="h-3 w-full bg-gray-100 rounded-full" />
                <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 pt-1">
                <div className="h-6 w-16 bg-gray-100 rounded-md" />
                <div className="h-6 w-20 bg-gray-100 rounded-md" />
                <div className="h-6 w-14 bg-gray-100 rounded-md" />
            </div>

            {/* Read more */}
            <div className="pt-4 border-t border-gray-100">
                <div className="h-4 w-24 bg-gray-200 rounded-full" />
            </div>
        </div>
    </div>
);

const BlogSectionSkeleton = () => (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-4 animate-pulse">
            <div className="flex justify-center">
                <div className="h-8 w-36 bg-gray-200 rounded-full" />
            </div>
            <div className="flex justify-center">
                <div className="h-10 w-64 bg-gray-200 rounded-full" />
            </div>
            <div className="flex justify-center">
                <div className="h-5 w-80 bg-gray-100 rounded-full" />
            </div>
            <div className="flex justify-center">
                <div className="h-8 w-36 bg-gray-100 rounded-full" />
            </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
            ))}
        </div>
    </section>
);

// ─── Blog Card ───────────────────────────────────────────────────────────────

const BlogCard = ({ blog }) => {
    const {
        title,
        slug,
        excerpt,
        featured_image,
        category,
        tags,
        author,
        published_at,
        created_at,
    } = blog;

    const displayDate = formatDate(published_at || created_at);
    const authorName = author?.full_name ?? author?.name ?? 'Unknown';
    const displayTags = Array.isArray(tags) ? tags.slice(0, 3) : [];

    return (
        <Link href={`/blogs/${slug}`} className="group block">
            <article className="bg-white rounded-xl overflow-hidden shadow cursor-pointer h-full flex flex-col transition-shadow duration-300 hover:shadow-md">

                {/* Image */}
                <div className="relative overflow-hidden h-48 flex-shrink-0">
                    {featured_image ? (
                        <img
                            src={featured_image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <Book className="w-12 h-12 text-green-400" />
                        </div>
                    )}

                    {/* Category badge */}
                    {category && (
                        <div className="absolute top-4 left-4">
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {category}
                            </span>
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        {displayDate && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>{displayDate}</span>
                            </div>
                        )}
                        {authorName && (
                            <div className="flex items-center gap-1 min-w-0">
                                <User className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{authorName}</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    {excerpt && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                            {excerpt}
                        </p>
                    )}

                    {/* Tags */}
                    {displayTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {displayTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Read more */}
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1 group/btn w-fit">
                            Read More
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
};

// ─── Section Header ──────────────────────────────────────────────────────────

const SectionHeader = () => (
    <header className="text-center mb-8 sm:mb-10 lg:mb-12 space-y-3 sm:space-y-4">
        <TextBadge
            color="green"
            variant="solid"
            startIcon={<Tag className="w-5 h-5" />}
            endIcon={<Book className="w-5 h-5" />}
        >
            Latest Insights
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            From Our{' '}
            <span className="text-green-600">Blogs</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert advice, farming tips, and industry insights to help you grow better
        </p>

        <TextBadge
            color="green"
            startIcon={<Book />}
            href="/blogs"
            variant="outline"
            endIcon={<ArrowRight />}
        >
            <span>View All Articles</span>
        </TextBadge>
    </header>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BlogSection() {
    const { data: blogs, isLoading } = useFeaturedBlogs();

    if (isLoading) return <BlogSectionSkeleton />;

    // Show nothing if no blogs
    if (!blogs?.length) return null;

    return (
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
            <SectionHeader />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </section>
    );
}