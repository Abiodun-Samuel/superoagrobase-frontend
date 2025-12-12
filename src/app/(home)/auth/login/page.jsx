import Login from "@/components/auth/Login";
import JsonLdScripts from "@/components/provider/JsonLdScripts";
import { getAuthFAQJsonLd, getLoginBreadcrumbJsonLd, getLoginPageJsonLd } from "@/utils/seo/seo.jsonld";
import { getLoginMetadata } from "@/utils/seo/seo.meta";

export const metadata = getLoginMetadata();
export default async function LoginPage({ searchParams }) {
  const { redirectTo } = await searchParams;
  const jsonLdGenerators = [getLoginBreadcrumbJsonLd, getLoginPageJsonLd, getAuthFAQJsonLd];

  return (<>
    <JsonLdScripts generators={jsonLdGenerators} />
    <Login redirectTo={redirectTo} />
  </>
  );
}
