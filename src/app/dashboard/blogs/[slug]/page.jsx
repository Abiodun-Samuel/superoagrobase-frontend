import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardBlogDetailsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardBlogDetailsMetadata();

const BlogDetailsPage = async ({ params }) => {
    const { slug } = await params;
    return (
        <>
            <PageBreadcrumb
                pageTitle="Blog Post Details"
                description="Create or edit blog post content. Manage post title, content, featured images, categories, tags, and SEO settings."
            />
            <DashboardSection>
                ''
            </DashboardSection>
        </>
    );
};

export default BlogDetailsPage;