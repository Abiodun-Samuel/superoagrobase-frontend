import { CookiePolicy } from "@/components/legal/CookiePolicy"
import LegalPageLayout from "@/components/legal/LegalPageLayout"
import PageHero from "@/components/page/PageLayout";
import { getCookiePolicyMetadata } from "@/utils/seo/seo.meta";
import { Shield } from "lucide-react"

export const metadata = getCookiePolicyMetadata();
const CookiePolicyPage = () => {
    return (
        <>
            <PageHero
                title="Cookie Policy"
                description="Understand how SuperoAgrobase uses cookies and tracking technologies to improve your browsing experience. Learn about cookie types, third-party cookies, and how to manage your preferences."
                badge="Legal"
                breadcrumbs={[
                    { label: 'Cookie Policy', href: '/cookie-policy' }
                ]}
            />
            <LegalPageLayout icon={Shield} title="Cookie Policy">
                <CookiePolicy />
            </LegalPageLayout>
        </>
    )
}

export default CookiePolicyPage