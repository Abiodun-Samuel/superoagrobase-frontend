import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardMessagesMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardMessagesMetadata();

const MessagesPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Messages Center"
                description="Manage platform communications. View and respond to customer inquiries, vendor messages, and support tickets."
            />
            <DashboardSection>
                MessagesInbox
            </DashboardSection>
        </>
    );
};

export default MessagesPage;