import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardUsersMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardUsersMetadata();

const UsersPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Users Management"
                description="Manage all platform users including customers, vendors, and administrators. Monitor activity and manage permissions."
            />
            <DashboardSection>
                UsersTable
            </DashboardSection>
        </>
    );
};

export default UsersPage;