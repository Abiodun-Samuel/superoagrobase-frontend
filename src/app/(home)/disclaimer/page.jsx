import { Disclaimer } from '@/components/legal/Disclaimer'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { getDisclaimerMetadata } from '@/utils/seo/seo.meta';
import { FileText } from 'lucide-react'

export const metadata = getDisclaimerMetadata();
const DisclaimerPage = () => {
    return (
        <LegalPageLayout icon={FileText} title="Disclaimer">
            <Disclaimer />
        </LegalPageLayout>
    )
}

export default DisclaimerPage