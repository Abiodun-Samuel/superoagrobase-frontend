import AdminEditBlog from '@/components/blog/AdminEditBlog';
import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardEditBlogMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardEditBlogMetadata();

const EditBlogPage = async ({ params }) => {
    const { slug } = await params;
    return (
        <>
            <PageBreadcrumb
                pageTitle="Edit Blog Post"
                description="Update and refine your agricultural blog content. Modify articles, enhance SEO, and republish your posts with improvements."
                backLink="/dashboard/blogs"
                backLinkText="Back to Blogs"
            />
            <DashboardSection>
                <AdminEditBlog slug={slug} />
            </DashboardSection>
        </>
    );
};

export default EditBlogPage;