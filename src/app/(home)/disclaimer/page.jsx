import { Disclaimer } from '@/components/legal/Disclaimer'
import LegalPageLayout from '@/components/legal/LegalPageLayout'
import PageHero from '@/components/page/PageLayout';
import { getDisclaimerMetadata } from '@/utils/seo/seo.meta';
import { FileText } from 'lucide-react'

export const metadata = getDisclaimerMetadata();
const DisclaimerPage = () => {
    return (
        <>
            <PageHero
                title="Disclaimer"
                description="Important disclaimer about product information, pricing, agricultural advice, and limitations of liability for SuperoAgrobase. Please read carefully before making purchases."
                badge="Legal"
                breadcrumbs={[
                    { label: 'Disclaimer', href: '/disclaimer' }
                ]}
            />
            <LegalPageLayout icon={FileText} title="Disclaimer">
                <Disclaimer />
            </LegalPageLayout>
        </>
    )
}

export default DisclaimerPage