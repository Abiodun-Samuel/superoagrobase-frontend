const BlogListSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Table Header */}
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
            </div>

            {/* Table Rows */}
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-start gap-4">
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="w-32 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogListSkeleton;