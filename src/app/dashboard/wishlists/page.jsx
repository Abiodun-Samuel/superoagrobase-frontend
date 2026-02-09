import DashboardSection from '@/components/dashboard/common/DashboardSection';
import PageBreadcrumb from '@/components/dashboard/common/PageBreadcrumb';
import { getDashboardWishlistsMetadata } from '@/utils/seo/dashboard-seo.meta';

export const metadata = getDashboardWishlistsMetadata();

const WishlistsPage = () => {
    return (
        <>
            <PageBreadcrumb
                pageTitle="Wishlists Management"
                description="Monitor user wishlists across the platform. View popular wishlist items, track trends, and analyze customer preferences."
            />
            <DashboardSection>
                WishlistsTable
            </DashboardSection>
        </>
    );
};

export default WishlistsPage;