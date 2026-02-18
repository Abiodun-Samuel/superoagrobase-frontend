import { notFound } from 'next/navigation';
import JsonLdScripts from '@/components/provider/JsonLdScripts';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';
import { BlogService } from '@/services/blogs.service';
import { buildBreadcrumb } from '@/utils/helper';
import { getBlogJsonLd, getBlogPageJsonLd, getBreadcrumbJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
import { getBlogMetadata } from '@/utils/seo/seo.meta';
import BlogDetails from '@/components/blog/BlogDetails';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
    try {
        const { slug } = await params;
        if (!slug) return getBlogMetadata(null);
        const { data: blog } = await BlogService.getBlog(slug);
        return getBlogMetadata(blog);
    } catch {
        return getBlogMetadata(null);
    }
}

export default async function BlogPage({ params }) {
    try {
        const { slug } = await params;
        if (!slug) notFound();

        const { data: blog } = await BlogService.getBlog(slug);
        if (!blog) notFound();

        const breadcrumbItems = buildBreadcrumb({ page: 'blogDetail', data: blog });

        return (
            <>
                <JsonLdScripts
                    generators={[
                        getOrganizationJsonLd,
                        { fn: getBlogJsonLd, params: blog },
                        { fn: getBlogPageJsonLd, params: blog },
                        { fn: getBreadcrumbJsonLd, params: [...breadcrumbItems] },
                    ]}
                />
                <PageHeader
                    title={blog.title}
                    description={blog.excerpt}
                    badge={blog.category || 'Blog'}
                    breadcrumbs={breadcrumbItems}
                    isBackButton={true}
                    backLabel="Back to Blog"
                />
                <PageLayout>
                    <BlogDetails blog={blog} />
                </PageLayout>
            </>
        );
    } catch {
        notFound();
    }
}