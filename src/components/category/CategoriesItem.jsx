
import Image from 'next/image'
import TextBadge from '../ui/TextBadge'
import Button from '../ui/Button'

import React, { useState } from 'react';
import { Briefcase, ChevronRight, Tag, ChevronDown, ChevronUp } from 'lucide-react';


const CategoriesItem = ({ category }) => {
    const [showAllSubcategories, setShowAllSubcategories] = useState(false);

    const displayedSubcategories = showAllSubcategories
        ? category?.subcategory
        : category?.subcategory?.slice(0, 3);

    const hasMoreSubcategories = category?.subcategory?.length > 3;
    const remainingCount = category?.subcategory?.length - 3;

    const toggleSubcategories = () => {
        setShowAllSubcategories(!showAllSubcategories);
    };

    return (
        <div key={category.id} className="relative max-w-sm">
            {/* Main Card */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow">
                <div className="relative h-72 overflow-hidden">
                    <Image
                        src={category?.image}
                        alt={category?.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br mix-blend-multiply transition-opacity duration-500 hover:opacity-80"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                    {/* Floating Badge */}
                    {category?.badges?.length > 0 && (
                        <div className="absolute top-3 right-3">
                            <TextBadge size="sm" startIcon={<Tag className="w-3 h-3" />} color="rose">
                                {category.badges[0]}
                            </TextBadge>
                        </div>
                    )}

                    {/* Category Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="space-y-3">
                            {/* Subcategories Container */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {displayedSubcategories?.map((sub, idx) => (
                                        <TextBadge
                                            href={`/products/categories/${category?.slug}/${sub?.slug}`}
                                            key={idx}
                                            variant="light"
                                            color="blue"
                                            size="xs"
                                        >
                                            {sub.title} {sub.count}
                                        </TextBadge>
                                    ))}
                                </div>

                                {/* Show More/Less Button */}
                                {hasMoreSubcategories && (
                                    <button
                                        onClick={toggleSubcategories}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 border border-white/30"
                                    >
                                        {showAllSubcategories ? (
                                            <>
                                                <ChevronUp className="w-3.5 h-3.5" />
                                                Show Less
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-3.5 h-3.5" />
                                                Show {remainingCount} More
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Below Image */}
                <div className="p-5 space-y-1.5">
                    {/* Product Count Badge */}
                    <TextBadge
                        startIcon={<Briefcase />}
                        color="green"
                        size="sm"
                    >
                        {category?.product_count} Products
                    </TextBadge>

                    {/* Category Title */}
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
                        {category.title}
                    </h3>

                    {/* CTA Button */}
                    <Button
                        href={`/products/categories/${category?.slug}`}
                        color="green"
                    >
                        <span>Explore Collection</span>
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CategoriesItem