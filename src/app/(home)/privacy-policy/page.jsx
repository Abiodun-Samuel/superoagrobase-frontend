import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy'
import PageHero from '@/components/page/PageHero';
import { getPrivacyPolicyMetadata } from '@/utils/seo/seo.meta';
import { Shield } from 'lucide-react'

export const metadata = getPrivacyPolicyMetadata();
const PrivacyPolicyPage = () => {
    return (
        <>
            <PageHero
                title="Privacy Policy"
                description="Learn how we collect, use, and protect your personal information. Our privacy policy complies with Nigeria Data Protection Regulation (NDPR) and ensures your data security."
                badge="Legal"
                breadcrumbs={[
                    { label: 'Privacy Policy', href: '/privacy-policy' }
                ]}
            />
            <LegalPageLayout icon={Shield} title="Privacy Policy">
                <PrivacyPolicy />
            </LegalPageLayout>
        </>
    )
}

export default PrivacyPolicyPage