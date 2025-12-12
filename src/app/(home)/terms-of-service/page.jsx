import LegalPageLayout from '@/components/legal/LegalPageLayout'
import { TermsOfService } from '@/components/legal/TermsOfService'
import PageHero from '@/components/page/PageLayout';
import { getTermsOfServiceMetadata } from '@/utils/seo/seo.meta';
import { Scale } from 'lucide-react'

export const metadata = getTermsOfServiceMetadata();
const TermsOfServicePage = () => {
    return (
        <>
            <PageHero
                title="Terms of Service"
                description="Read our terms and conditions governing the use of SuperoAgrobase. Understand your rights, responsibilities, purchase terms, delivery policies, and dispute resolution procedures."
                badge="Legal"
                breadcrumbs={[
                    { label: 'Terms of Service', href: '/terms-of-service' }
                ]}
            />
            <LegalPageLayout icon={Scale} title="Terms of Service">
                <TermsOfService />
            </LegalPageLayout>
        </>
    )
}

export default TermsOfServicePage