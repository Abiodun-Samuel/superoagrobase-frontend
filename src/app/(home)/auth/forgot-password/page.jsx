import { getForgotPasswordMetadata } from "@/utils/seo/seo.meta";
import { getForgotPasswordBreadcrumbJsonLd, getForgotPasswordPageJsonLd, } from "@/utils/seo/seo.jsonld";
import JsonLdScripts from "@/components/provider/JsonLdScripts";

export const metadata = getForgotPasswordMetadata();
const ForgotPasswordPage = () => {
    const jsonLdGenerators = [getForgotPasswordBreadcrumbJsonLd, getForgotPasswordPageJsonLd];
    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            'forgot ForgotPasswordPage'
        </>
    )
}

export default ForgotPasswordPage