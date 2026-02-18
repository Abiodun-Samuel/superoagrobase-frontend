import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getBlogMetadata } from '@/utils/seo/seo.meta';
import {
    getBlogBreadcrumbJsonLd,
    getBlogCollectionJsonLd,
    getBlogWebsiteJsonLd,
    getOrganizationJsonLd,
} from '@/utils/seo/seo.jsonld';
import BlogList from '@/components/blog/BlogList';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';
import { BlogService } from '@/services/blogs.service';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

// ─── Param parsing ────────────────────────────────────────────────────────────

const parseSearchParams = async (searchParams) => {
    const params = await searchParams;

    const page = params?.page ? parseInt(params.page, 10) : 1;
    const perPage = params?.per_page ? parseInt(params.per_page, 10) : 9;

    if (isNaN(page) || page < 1) return null;
    if (isNaN(perPage) || perPage < 1 || perPage > 100) return null;

    return {
        category: params?.category || null,
        search: params?.search || null,
        page,
        per_page: perPage,
    };
};

// ─── Data fetching ────────────────────────────────────────────────────────────

const fetchBlogs = async (filters) => {
    try {
        const params = {
            page: filters.page,
            per_page: filters.per_page,
            ...(filters.category && { category: filters.category }),
            ...(filters.search && { search: filters.search }),
        };
        const response = await BlogService.getPublishedBlogs(params);
        if (!response?.data) return { blogs: [], meta: {}, links: [], success: false };
        return {
            blogs: response.data || [],
            meta: response.meta || {},
            links: response.links || [],  // Laravel pagination links array
            success: true,
        };
    } catch {
        return { blogs: [], meta: {}, links: [], success: false };
    }
};

// ─── Display helpers ──────────────────────────────────────────────────────────

const getPageTitle = ({ category, search }) => {
    if (search) return `Results for "${search}"`;
    if (category) return category;
    return 'Blog & Insights';
};

const getPageDescription = ({ category, search }, meta) => {
    const count = meta.total?.toLocaleString() ?? '0';
    if (search) return `Found ${count} articles matching your search.`;
    if (category) return `Explore ${count} articles in ${category}.`;
    return `Discover ${count} expert insights, trends, and stories from the world of agriculture and AgTech.`;
};

const getBreadcrumbs = ({ category }) => {
    const crumbs = [{ label: 'Blogs', href: '/blogs' }];
    if (category) crumbs.push({ label: category, href: `/blogs?category=${encodeURIComponent(category)}` });
    return crumbs;
};

const getBadge = ({ search, category }) => {
    if (search) return 'Search Results';
    if (category) return category;
    return 'Knowledge Hub';
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ searchParams }) {
    const filters = await parseSearchParams(searchParams);
    if (!filters) return getBlogMetadata({});
    const { meta } = await fetchBlogs(filters);
    return getBlogMetadata({
        category: filters.category,
        search: filters.search,
        page: filters.page,
        totalPosts: meta.total ?? 0,
        totalPages: meta.last_page ?? 1,
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage({ searchParams }) {
    const filters = await parseSearchParams(searchParams);
    if (!filters) notFound();

    const { blogs, meta, links, success } = await fetchBlogs(filters);
    if (!success) notFound();

    const currentPage = meta.current_page ?? filters.page;
    const totalPages = meta.last_page ?? 1;

    // Guard: if requested page exceeds total, 404
    if (totalPages > 0 && currentPage > totalPages) notFound();

    const jsonLdGenerators = [
        getOrganizationJsonLd,
        { fn: getBlogBreadcrumbJsonLd, params: { category: filters.category, search: filters.search } },
        {
            fn: getBlogCollectionJsonLd,
            params: {
                category: filters.category,
                search: filters.search,
                posts: blogs,
                totalPosts: meta.total ?? 0,
                page: currentPage,
                totalPages,
            },
        },
        getBlogWebsiteJsonLd,
    ].filter(Boolean);

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title={getPageTitle(filters)}
                description={getPageDescription(filters, meta)}
                badge={getBadge(filters)}
                breadcrumbs={getBreadcrumbs(filters)}
                isBackButton={false}
            />
            <PageLayout>
                <BlogList
                    blogs={blogs}
                    meta={meta}
                    links={links}
                    filters={{
                        category: filters.category,
                        search: filters.search,
                        page: currentPage,
                        per_page: filters.per_page,
                    }}
                />
            </PageLayout>
        </>
    );
}