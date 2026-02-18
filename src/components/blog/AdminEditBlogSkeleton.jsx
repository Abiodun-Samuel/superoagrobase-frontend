'use client';

const Shimmer = ({ className = '' }) => (
    <div
        className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
    </div>
);

const AdminEditBlogSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .skeleton-enter {
                    animation: fade-in 0.35s ease both;
                }
                .skeleton-enter-1  { animation-delay: 0.04s; }
                .skeleton-enter-2  { animation-delay: 0.08s; }
                .skeleton-enter-3  { animation-delay: 0.12s; }
                .skeleton-enter-4  { animation-delay: 0.16s; }
                .skeleton-enter-5  { animation-delay: 0.20s; }
                .skeleton-enter-6  { animation-delay: 0.24s; }
                .skeleton-enter-7  { animation-delay: 0.28s; }
            `}</style>

            <div className="mx-auto">
                {/* ── Header ── */}
                <div className="mb-8 skeleton-enter skeleton-enter-1">
                    {/* Back button */}
                    <Shimmer className="h-9 w-36 rounded-lg mb-4" />

                    <div className="flex items-center gap-3">
                        {/* Icon badge */}
                        <Shimmer className="w-12 h-12 rounded-xl flex-shrink-0" />
                        <div className="space-y-2">
                            <Shimmer className="h-5 w-40 rounded-md" />
                            <Shimmer className="h-3.5 w-56 rounded-md" />
                        </div>
                    </div>
                </div>

                {/* ── Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ════════════════════════════════
                        LEFT SIDEBAR
                    ════════════════════════════════ */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Featured Image Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6 skeleton-enter skeleton-enter-2">
                            {/* Section heading */}
                            <Shimmer className="h-5 w-36 rounded-md mb-4" />

                            {/* Image placeholder area */}
                            <Shimmer className="w-full aspect-video rounded-lg mb-3" />

                            {/* Helper text */}
                            <Shimmer className="h-3 w-full rounded-md" />
                            <Shimmer className="h-3 w-4/5 rounded-md mt-1.5" />
                        </div>

                        {/* Publishing Settings Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 skeleton-enter skeleton-enter-3">
                            {/* Section heading */}
                            <Shimmer className="h-5 w-44 rounded-md mb-4" />

                            <div className="space-y-4">
                                {/* Status select */}
                                <div>
                                    <Shimmer className="h-3.5 w-14 rounded mb-2" />
                                    <Shimmer className="h-10 w-full rounded-lg" />
                                </div>

                                {/* Featured post toggle row */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="space-y-1.5">
                                        <Shimmer className="h-3.5 w-28 rounded" />
                                        <Shimmer className="h-3 w-40 rounded" />
                                    </div>
                                    {/* Toggle pill */}
                                    <Shimmer className="h-6 w-11 rounded-full flex-shrink-0" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════════
                        MAIN CONTENT
                    ════════════════════════════════ */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Information Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 skeleton-enter skeleton-enter-2">
                            <Shimmer className="h-5 w-44 rounded-md mb-4" />

                            <div className="space-y-4">
                                {/* Title field */}
                                <div>
                                    <Shimmer className="h-3.5 w-20 rounded mb-2" />
                                    <Shimmer className="h-10 w-full rounded-lg" />
                                </div>

                                {/* Slug field */}
                                <div>
                                    <Shimmer className="h-3.5 w-16 rounded mb-2" />
                                    <Shimmer className="h-10 w-full rounded-lg" />
                                    <Shimmer className="h-3 w-56 rounded mt-1.5" />
                                </div>

                                {/* Excerpt textarea */}
                                <div>
                                    <Shimmer className="h-3.5 w-16 rounded mb-2" />
                                    <Shimmer className="h-24 w-full rounded-lg" />
                                    <Shimmer className="h-3 w-24 rounded mt-1.5" />
                                </div>

                                {/* Category + Tags row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Shimmer className="h-3.5 w-20 rounded mb-2" />
                                        <Shimmer className="h-10 w-full rounded-lg" />
                                    </div>
                                    <div>
                                        <Shimmer className="h-3.5 w-10 rounded mb-2" />
                                        <Shimmer className="h-10 w-full rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blog Content Card (Editor) */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 skeleton-enter skeleton-enter-4">
                            <Shimmer className="h-5 w-32 rounded-md mb-4" />

                            {/* Tiptap toolbar simulation */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                {/* Toolbar row */}
                                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 flex-wrap">
                                    {[40, 36, 44, 36, 40, 36, 36, 44, 40, 36, 44, 36].map((w, i) => (
                                        <Shimmer
                                            key={i}
                                            className={`h-7 rounded`}
                                            style={{ width: `${w}px` }}
                                        />
                                    ))}
                                </div>

                                {/* Editor body — staggered content lines */}
                                <div className="p-4 space-y-3 min-h-[240px]">
                                    <Shimmer className="h-4 w-3/4 rounded" />
                                    <Shimmer className="h-4 w-full rounded" />
                                    <Shimmer className="h-4 w-5/6 rounded" />
                                    <Shimmer className="h-4 w-full rounded" />
                                    <Shimmer className="h-4 w-2/3 rounded" />
                                    <div className="pt-2">
                                        <Shimmer className="h-4 w-full rounded" />
                                        <Shimmer className="h-4 w-11/12 rounded mt-3" />
                                        <Shimmer className="h-4 w-4/5 rounded mt-3" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEO Settings Card (collapsed state) */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden skeleton-enter skeleton-enter-5">
                            <div className="flex items-center justify-between p-6">
                                <Shimmer className="h-5 w-48 rounded-md" />
                                <Shimmer className="h-5 w-5 rounded" />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 skeleton-enter skeleton-enter-6">
                            <Shimmer className="h-10 w-24 rounded-lg" />
                            <Shimmer className="h-10 w-40 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEditBlogSkeleton;