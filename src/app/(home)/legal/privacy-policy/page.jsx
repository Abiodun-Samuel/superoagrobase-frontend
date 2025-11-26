import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy'
import { Shield } from 'lucide-react'

const PrivacyPolicyPage = () => {
    return (
        <LegalPageLayout icon={Shield} title="Privacy Policy">
            <PrivacyPolicy />
        </LegalPageLayout>
    )
}

export default PrivacyPolicyPage