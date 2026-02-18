import AdminCreateBlog from '@/components/blog/AdminCreateBlog';
import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardCreateBlogMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardCreateBlogMetadata();

const CreateBlogPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Create New Blog Post"
                description="Write and publish engaging agricultural content. Share insights, tips, and knowledge with your audience through well-crafted blog posts."
                backLink="/dashboard/blogs"
                backLinkText="Back to Blogs"
            />
            <DashboardSection>
                <AdminCreateBlog />
            </DashboardSection>
        </>
    );
};

export default CreateBlogPage;