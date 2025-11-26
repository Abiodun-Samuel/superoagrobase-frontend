import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy'
import { getPrivacyPolicyMetadata } from '@/utils/seo/seo.meta';
import { Shield } from 'lucide-react'

export const metadata = getPrivacyPolicyMetadata();
const PrivacyPolicyPage = () => {
    return (
        <LegalPageLayout icon={Shield} title="Privacy Policy">
            <PrivacyPolicy />
        </LegalPageLayout>
    )
}

export default PrivacyPolicyPage