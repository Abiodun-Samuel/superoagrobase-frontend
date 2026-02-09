import { getVerifyEmailMetadata } from "@/utils/seo/seo.meta";
import { getVerifyEmailPageJsonLd, } from "@/utils/seo/seo.jsonld";
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import EmailVerification from "@/components/auth/EmailVerification";

export const metadata = getVerifyEmailMetadata();

const EmailVerificationPage = () => {
    const jsonLdGenerators = [getVerifyEmailPageJsonLd];
    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <EmailVerification />
        </>
    )
}

export default EmailVerificationPage