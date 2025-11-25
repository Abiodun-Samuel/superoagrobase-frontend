'use client'

import React from 'react';
import { Calendar, User, ArrowRight, Tag, Book, ChevronRight } from 'lucide-react';
import TextBadge from '../ui/TextBadge';
import Button from '../ui/Button';

const SectionHeader = () => (
    <header className="text-center mb-12 space-y-4">
        <TextBadge
            color="green"
            variant="light"
            size="lg"
            startIcon={<Tag className="w-5 h-5" />}
            endIcon={<Book className="w-5 h-5" />}
        >
            Latest Insights
        </TextBadge>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            From Our{" "} <span className="text-green-600"> Blogs</span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert advice, farming tips, and industry insights to help you grow better

        </p>
    </header>
);

const ViewAllButton = () => (
    <div className="text-center mt-12">
        <Button
            startIcon={<Book />}
            href="/blogs"
            className="max-w-xs"
            variant="outline"
            endIcon={<ChevronRight />}
        >
            <span>View All Articles</span>
        </Button>
    </div>
)

export default function BlogSection() {
    const blogs = [
        {
            id: 1,
            title: "10 Essential Tips for Successful Crop Rotation",
            excerpt: "Discover how proper crop rotation can improve soil health, reduce pests, and increase your farm's productivity significantly.",
            image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
            category: "Farming Tips",
            author: "John Okafor",
            date: "Nov 10, 2024",
            tags: ["Crop Management", "Soil Health", "Productivity"]
        },
        {
            id: 2,
            title: "Understanding NPK Fertilizers: A Complete Guide",
            excerpt: "Learn everything about NPK ratios, application methods, and how to choose the right fertilizer for different crops.",
            image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
            category: "Fertilizers",
            author: "Amina Ibrahim",
            date: "Nov 8, 2024",
            tags: ["Fertilizers", "NPK", "Guide"]
        },
        {
            id: 3,
            title: "Organic Pest Control Methods That Actually Work",
            excerpt: "Protect your crops naturally with these proven organic pest control techniques that are safe and effective.",
            image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
            category: "Pest Control",
            author: "David Eze",
            date: "Nov 5, 2024",
            tags: ["Organic", "Pest Control", "Natural"]
        },
        {
            id: 4,
            title: "Maximizing Yields with Modern Irrigation Systems",
            excerpt: "Explore the latest irrigation technologies and techniques to optimize water usage and boost your harvest.",
            image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
            category: "Technology",
            author: "Grace Adeyemi",
            date: "Nov 3, 2024",
            tags: ["Irrigation", "Technology", "Water Management"]
        }
    ];

    return (
        <section className="my-24">
            <SectionHeader />

            {/* Blog Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 relative">
                {blogs.map((blog) => (
                    <article
                        key={blog.id}
                        className="group bg-white rounded-2xl overflow-hidden shadow cursor-pointer"
                    >
                        {/* Image Container */}
                        <div className="relative overflow-hidden h-48">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    {blog.category}
                                </span>
                            </div>
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{blog.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{blog.author}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                                {blog.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {blog.excerpt}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Read More */}
                            <div className="pt-4 border-t border-gray-100">
                                <button className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1 group/btn">
                                    Read More
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
                <ViewAllButton />
            </div>
        </section>
    );
}