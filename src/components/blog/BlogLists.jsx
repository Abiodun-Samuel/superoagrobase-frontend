'use client'

import React, { useState, useMemo } from 'react';
import { Search, Calendar, Clock, ArrowUpRight, Leaf, Sprout, TrendingUp, Sparkles, Filter, X, ChevronRight, Eye } from 'lucide-react';

const CATEGORIES = ['All Stories', 'Regenerative Farming', 'AgTech Innovation', 'Climate Action', 'Community', 'Market Intelligence'];

const BLOG_POSTS = [
    {
        id: 1,
        title: 'The Carbon Revolution: How Regenerative Agriculture is Healing Our Planet',
        excerpt: 'Farmers worldwide are reversing climate change, one field at a time. Discover the science and stories behind soil carbon sequestration.',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=1200&fit=crop',
        category: 'Regenerative Farming',
        author: 'Dr. Elena Martinez',
        authorRole: 'Soil Scientist',
        date: '2024-12-08',
        readTime: '12 min',
        views: '24.5K',
        featured: true,
        color: 'emerald'
    },
    {
        id: 2,
        title: 'Vertical Futures: Inside the World\'s Most Advanced Urban Farm',
        excerpt: 'A deep dive into how AI-powered vertical farms are producing 400x more food per square meter than traditional agriculture.',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1600&h=1200&fit=crop',
        category: 'AgTech Innovation',
        author: 'Marcus Chen',
        authorRole: 'Tech Journalist',
        date: '2024-12-05',
        readTime: '10 min',
        views: '18.2K',
        featured: true,
        color: 'blue'
    },
    {
        id: 3,
        title: 'From Barren to Bountiful: A Decade-Long Transformation',
        excerpt: 'How one family transformed 50 acres of degraded land into a thriving food forest using permaculture principles.',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&h=1200&fit=crop',
        category: 'Community',
        author: 'Sarah Williams',
        authorRole: 'Permaculture Designer',
        date: '2024-12-01',
        readTime: '15 min',
        views: '31.7K',
        featured: false,
        color: 'amber'
    },
    {
        id: 4,
        title: 'The New Water Warriors: IoT Sensors Saving Billions of Gallons',
        excerpt: 'Smart irrigation technology is revolutionizing water management in agriculture, reducing usage by up to 60%.',
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&h=1200&fit=crop',
        category: 'AgTech Innovation',
        author: 'Dr. Priya Patel',
        authorRole: 'Agricultural Engineer',
        date: '2024-11-28',
        readTime: '8 min',
        views: '15.9K',
        featured: false,
        color: 'cyan'
    },
    {
        id: 5,
        title: 'Market Decoded: Why Organic Prices Are Finally Dropping',
        excerpt: 'An economist\'s perspective on the supply chain innovations making organic food accessible to everyone.',
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1600&h=1200&fit=crop',
        category: 'Market Intelligence',
        author: 'James Okonkwo',
        authorRole: 'Agricultural Economist',
        date: '2024-11-25',
        readTime: '11 min',
        views: '22.3K',
        featured: false,
        color: 'violet'
    },
    {
        id: 6,
        title: 'Climate Adaptation: The Crops That Will Feed 2050',
        excerpt: 'Scientists are engineering climate-resilient varieties that can withstand extreme weather while maintaining nutrition.',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=1200&fit=crop',
        category: 'Climate Action',
        author: 'Dr. Amara Osei',
        authorRole: 'Plant Geneticist',
        date: '2024-11-20',
        readTime: '13 min',
        views: '28.1K',
        featured: false,
        color: 'rose'
    }
];

const FeaturedCard = ({ post }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <article
            className="group relative h-[600px] rounded-3xl overflow-hidden cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out"
                    style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
                <div className="mb-6 flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium rounded-full">
                        {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                    </div>
                </div>

                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {post.title}
                </h2>

                <p className="text-lg text-white/90 mb-6 max-w-2xl">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
                            {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="text-white font-semibold">{post.author}</div>
                            <div className="text-white/70 text-sm">{post.authorRole}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-white/80 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>

                <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
            </div>
        </article>
    );
};

const StoryCard = ({ post }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <article
            className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                        {post.category}
                    </span>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white/90 text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{post.views}</span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                            {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">{post.author}</div>
                            <div className="text-xs text-gray-500">{post.readTime} read</div>
                        </div>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                        <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                </div>
            </div>
        </article>
    );
};

const CategoryPill = ({ category, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap ${isActive
            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/30'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
    >
        {category}
        {count > 0 && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                {count}
            </span>
        )}
    </button>
);

const BlogPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Stories');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const filteredPosts = useMemo(() => {
        return BLOG_POSTS.filter(post => {
            const matchesCategory = selectedCategory === 'All Stories' || post.category === selectedCategory;
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.author.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const getCategoryCount = (category) => {
        if (category === 'All Stories') return BLOG_POSTS.length;
        return BLOG_POSTS.filter(post => post.category === category).length;
    };

    const featuredPosts = filteredPosts.filter(post => post.featured);
    const regularPosts = filteredPosts.filter(post => !post.featured);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Magnetic Hero */}
            <section className="relative bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-semibold mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>Stories that inspire action</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                            The Future of Food
                            <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Starts Here
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                            In-depth stories exploring innovation, sustainability, and the people reshaping agriculture for a better tomorrow.
                        </p>

                        <div className="relative max-w-xl">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search stories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors duration-300 bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Navigation */}
                <div className="border-t border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="hidden lg:flex items-center gap-3 py-6 overflow-x-auto">
                            {CATEGORIES.map(category => (
                                <CategoryPill
                                    key={category}
                                    category={category}
                                    isActive={selectedCategory === category}
                                    onClick={() => setSelectedCategory(category)}
                                    count={getCategoryCount(category)}
                                />
                            ))}
                        </div>

                        <div className="lg:hidden py-4">
                            <button
                                onClick={() => setShowMobileFilter(!showMobileFilter)}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full w-full justify-center font-medium"
                            >
                                <Filter className="w-5 h-5" />
                                <span>{selectedCategory}</span>
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {getCategoryCount(selectedCategory)}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Filter */}
            {showMobileFilter && (
                <div className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)}>
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Categories</h3>
                            <button onClick={() => setShowMobileFilter(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setShowMobileFilter(false);
                                    }}
                                    className={`w-full px-6 py-4 rounded-xl text-left font-medium transition-all duration-300 flex items-center justify-between ${selectedCategory === category
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span>{category}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-white/20' : 'bg-white'
                                        }`}>
                                        {getCategoryCount(category)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Stories */}
            {featuredPosts.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full" />
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Featured Stories</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {featuredPosts.map(post => (
                            <FeaturedCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>
            )}

            {/* All Stories Grid */}
            {regularPosts.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-1 h-8 bg-gradient-to-b from-gray-900 to-gray-600 rounded-full" />
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Latest Stories</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularPosts.map(post => (
                            <StoryCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>
            )}

            {filteredPosts.length === 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">No stories found</h3>
                    <p className="text-gray-600 text-lg">Try adjusting your search or explore different categories.</p>
                </div>
            )}

            {/* Newsletter CTA */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
                    <Leaf className="w-16 h-16 text-emerald-400 mx-auto mb-8" />
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                        Join 50,000+ Forward-Thinking Farmers
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Get exclusive insights, breakthrough innovations, and inspiring stories delivered every week. No spam, just substance.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-6">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                        <button className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors duration-300 whitespace-nowrap shadow-lg shadow-emerald-600/30">
                            Subscribe Free
                        </button>
                    </div>

                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Trusted by agricultural innovators worldwide</span>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default BlogPage;