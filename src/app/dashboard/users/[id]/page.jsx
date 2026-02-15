// import DashboardSection from '@/components/dashboard/common/DashboardSection';
// import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
// import UserDetails from '@/components/users/UserDetails';
// import { getDashboardUsersMetadata } from '@/utils/seo/dashboard-seo.meta';

// export const metadata = getDashboardUsersMetadata();

// const UserDetailsPage = async ({ params }) => {
//     const { id } = await params
//     return (
//         <>
//             <PageBreadcrumb
//                 pageTitle="Users Management"
//                 description="Manage all platform users including customers, vendors, and administrators. Monitor activity and manage permissions."
//             />
//             <DashboardSection>
//                 <UserDetails id={id} />
//             </DashboardSection>
//         </>
//     );
// };

// export default UserDetailsPage;
import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import UserDetails from '@/components/users/UserDetails';
import { getDashboardUserDetailsMetadata } from '@/utils/seo/dashboard-seo.meta';

export async function generateMetadata({ params }) {
    const { id } = await params;
    return getDashboardUserDetailsMetadata(id);
}

const UserDetailsPage = async ({ params }) => {
    const { id } = await params;

    return (
        <>
            <PageBreadcrumb
                pageTitle="User Details"
                description="View detailed user information, activity history, and manage account settings and permissions."
            />
            <DashboardSection>
                <UserDetails id={id} />
            </DashboardSection>
        </>
    );
};

export default UserDetailsPage;