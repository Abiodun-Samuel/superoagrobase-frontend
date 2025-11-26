import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { TermsOfService } from '@/components/legal/TermsOfService'
import { getTermsOfServiceMetadata } from '@/utils/seo/seo.meta';
import { Scale } from 'lucide-react'

export const metadata = getTermsOfServiceMetadata();
const TermsOfServicePage = () => {
    return (
        <LegalPageLayout icon={Scale} title="Terms of Service">
            <TermsOfService />
        </LegalPageLayout>
    )
}

export default TermsOfServicePage