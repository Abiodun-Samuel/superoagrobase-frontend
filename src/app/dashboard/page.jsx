import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardHomeMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardHomeMetadata();

const DashboardPage = () => {
  return (
    <>
      <PageBreadcrumb
        pageTitle="Dashboard Overview"
        description="Comprehensive dashboard overview with analytics, recent activities, and quick stats for managing SuperoAgroBase platform."
      />
      <DashboardSection>
        Your dashboard stats, charts, and overview content
      </DashboardSection>
    </>
  );
};
export default DashboardPage;