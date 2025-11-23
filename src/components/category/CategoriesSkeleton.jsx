const CategoriesSkeleton = () => {
    return (
        <div className="relative max-w-sm">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow animate-pulse">

                {/* IMAGE + OVERLAY AREA */}
                <div className="relative h-72 bg-gray-200">

                    {/* Floating Badge */}
                    <div className="absolute top-3 right-3 w-16 h-6 bg-gray-300 rounded-full" />

                    {/* Subcategories */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-20 h-5 bg-gray-300 rounded-full"
                                />
                            ))}
                        </div>

                        {/* Show more button */}
                        <div className="w-24 h-5 bg-gray-300 rounded-lg" />
                    </div>
                </div>

                {/* BELOW IMAGE CONTENT */}
                <div className="p-5 space-y-3">
                    {/* Product Count Badge */}
                    <div className="w-28 h-6 bg-gray-300 rounded-full" />

                    {/* Category Title */}
                    <div className="w-40 h-7 bg-gray-300 rounded-md" />

                    {/* Button */}
                    <div className="w-full h-11 bg-gray-300 rounded-xl" />
                </div>

            </div>
        </div>
    )
}

export default CategoriesSkeleton