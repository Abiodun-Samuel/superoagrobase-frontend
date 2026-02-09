import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardBlogsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardBlogsMetadata();

const BlogsPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Blogs Management"
                description="Manage agricultural blog content. Create new blog posts, edit articles, publish content, and monitor blog performance."
            />
            <DashboardSection>
                BlogsTable
            </DashboardSection>
        </>
    );
};

export default BlogsPage;