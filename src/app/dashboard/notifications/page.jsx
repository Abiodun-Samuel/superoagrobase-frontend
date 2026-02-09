import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardNotificationsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardNotificationsMetadata();

const NotificationsPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Notifications Center"
                description="Manage system notifications, user alerts, and platform announcements. Create, schedule, and send notifications."
            />
            <DashboardSection>
                NotificationsList
            </DashboardSection>
        </>
    );
};

export default NotificationsPage;