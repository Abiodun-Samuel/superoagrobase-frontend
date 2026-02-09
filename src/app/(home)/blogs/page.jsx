import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getBlogMetadata } from '@/utils/seo/seo.meta';
import {
    getBlogBreadcrumbJsonLd,
    getBlogCollectionJsonLd,
    getBlogWebsiteJsonLd,
    getBlogFAQJsonLd,
    getBlogNewsletterJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
// import BlogList from '@/components/blog/BlogLists';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';

export const revalidate = 3600;

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const category = params?.category;
    const search = params?.search;
    const page = parseInt(params?.page) || 1;
    const totalPosts = 6;
    const totalPages = Math.ceil(totalPosts / 6);
    const featuredCount = 2;

    return getBlogMetadata({ category, search, page, totalPosts, totalPages, featuredCount });
}

/**
 * Blog Page Component
 * Main blog listing page with comprehensive SEO implementation
 */
export default async function BlogPage({ searchParams }) {
    const params = await searchParams;
    const category = params?.category;
    const search = params?.search;
    const page = parseInt(params?.page) || 1;

    // Blog data - in production, this would come from your CMS/database/API
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

    // Filter posts based on search params
    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesCategory = !category || category === 'All Stories' || post.category === category;
        const matchesSearch = !search ||
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
            post.author.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPosts = filteredPosts.filter(post => post.featured);
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / 6);

    const jsonLdGenerators = [
        getOrganizationJsonLd,
        { fn: getBlogBreadcrumbJsonLd, params: { category, search } },
        {
            fn: getBlogCollectionJsonLd,
            params: { category, search, posts: filteredPosts, totalPosts, page, totalPages, featuredPosts }
        },
        getBlogWebsiteJsonLd,
        getBlogFAQJsonLd,
        getBlogNewsletterJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="Agriculture Insights & Stories"
                description="Explore the latest trends, innovations, and expert insights in agriculture, sustainability, and AgTech"
                badge="Knowledge Hub"
                breadcrumbs={[
                    { label: 'Blog', href: '/blog' },
                ]}
                isBackButton={false}
            />
            <PageLayout>
                {/* <BlogList
                    posts={filteredPosts}
                    featuredPosts={featuredPosts}
                    category={category}
                    search={search}
                    page={page}
                    totalPages={totalPages}
                /> */}
            </PageLayout>
        </>
    );
}