import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { getUserProfileMetadata } from '@/utils/seo/seo.meta';
import {
    getUserProfileBreadcrumbJsonLd,
    getUserProfilePageJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';
import UserProfile from '@/components/profile/UserProfile';

export const metadata = getUserProfileMetadata();

const UserProfilePage = () => {
    const jsonLdGenerators = [
        getOrganizationJsonLd,
        getUserProfileBreadcrumbJsonLd,
        getUserProfilePageJsonLd
    ];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageHeader
                title="My Profile"
                description="Manage your account information and preferences"
                breadcrumbs={[
                    { label: 'My Profile', href: '/account/profile' },
                ]}
                badge="Account Details"
                isBackButton={false}
            />
            <PageLayout>
                <UserProfile />
            </PageLayout>
        </>
    );
};

export default UserProfilePage;