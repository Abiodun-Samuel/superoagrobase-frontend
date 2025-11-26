import { Disclaimer } from '@/components/legal/Disclaimer'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { FileText } from 'lucide-react'

const DisclaimerPage = () => {
    return (
        <LegalPageLayout icon={FileText} title="Disclaimer">
            <Disclaimer />
        </LegalPageLayout>
    )
}

export default DisclaimerPage