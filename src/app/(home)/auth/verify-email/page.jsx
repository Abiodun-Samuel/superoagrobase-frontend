import { getVerifyEmailMetadata } from "@/utils/seo/seo.meta";
import { getVerifyEmailPageJsonLd, } from "@/utils/seo/seo.jsonld";
import JsonLdScripts from "@/components/provider/JsonLdScripts";

export const metadata = getVerifyEmailMetadata();
const VerifyEmailPage = () => {
    const jsonLdGenerators = [getVerifyEmailPageJsonLd];
    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            'VerifyEmailPage'
        </>
    )
}

export default VerifyEmailPage