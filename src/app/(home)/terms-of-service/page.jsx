import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { TermsOfService } from '@/components/legal/TermsOfService'
import { Scale } from 'lucide-react'

const TermsOfServicePage = () => {
    return (
        <LegalPageLayout icon={Scale} title="Terms of Service">
            <TermsOfService />
        </LegalPageLayout>
    )
}

export default TermsOfServicePage