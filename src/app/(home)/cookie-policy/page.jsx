import { CookiePolicy } from "@/components/legal/CookiePolicy"
import LegalPageLayout from "@/components/legal/LegalPageLayout"
import { Shield } from "lucide-react"

const CookiePolicyPage = () => {
    return (
        <LegalPageLayout icon={Shield} title="Cookie Policy">
            <CookiePolicy />
        </LegalPageLayout>
    )
}

export default CookiePolicyPage