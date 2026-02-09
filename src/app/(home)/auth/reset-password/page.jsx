import { getResetPasswordMetadata } from "@/utils/seo/seo.meta";
import {
    getResetPasswordBreadcrumbJsonLd, getResetPasswordPageJsonLd, getResetPasswordFAQJsonLd, getPasswordSecurityTipsJsonLd
} from '@/utils/seo/seo.jsonld';
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import ResetPassword from "@/components/auth/ResetPassword";

export const metadata = getResetPasswordMetadata();

const ResetPasswordPage = () => {

    const jsonLdGenerators = [getResetPasswordBreadcrumbJsonLd,
        getResetPasswordPageJsonLd,
        getResetPasswordFAQJsonLd,
        getPasswordSecurityTipsJsonLd];

    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <ResetPassword />
        </>
    )
}

export default ResetPasswordPage