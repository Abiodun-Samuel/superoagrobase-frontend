import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardSettingsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardSettingsMetadata();

const SettingsPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="System Settings"
                description="Configure platform settings including payment gateways, shipping options, email configurations, and SEO settings."
            />
            <DashboardSection>
                SettingsForm
            </DashboardSection>
        </>
    );
};

export default SettingsPage;