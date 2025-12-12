import Register from "@/components/auth/Register"
import { getRegisterMetadata } from "@/utils/seo/seo.meta";
import { getAuthFAQJsonLd, getRegisterBreadcrumbJsonLd, getRegisterPageJsonLd } from "@/utils/seo/seo.jsonld";
import JsonLdScripts from "@/components/provider/JsonLdScripts";

export const metadata = getRegisterMetadata();
const RegisterPage = () => {
  const jsonLdGenerators = [getRegisterBreadcrumbJsonLd, getRegisterPageJsonLd, getAuthFAQJsonLd];
  return (
    <>
      <JsonLdScripts generators={jsonLdGenerators} />
      <Register />
    </>
  )
}

export default RegisterPage