import { CookiePolicy } from "@/components/legal/CookiePolicy"
import LegalPageLayout from "@/components/legal/LegalPageLayout"
import { getCookiePolicyMetadata } from "@/utils/seo/seo.meta";
import { Shield } from "lucide-react"

export const metadata = getCookiePolicyMetadata();
const CookiePolicyPage = () => {
    return (
        <LegalPageLayout icon={Shield} title="Cookie Policy">
            <CookiePolicy />
        </LegalPageLayout>
    )
}

export default CookiePolicyPage