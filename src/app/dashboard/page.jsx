import AdminDashboard from '@/components/admin/AdminDashboard';
import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardHomeMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardHomeMetadata();

const DashboardPage = () => {
  return (
    <>
      <PageBreadcrumb
        pageTitle="Dashboard"
        description="Comprehensive dashboard overview with analytics, recent activities, and quick stats for managing SuperoAgroBase platform."
      />
      <DashboardSection>
        <AdminDashboard />
      </DashboardSection>
    </>
  );
};
export default DashboardPage;