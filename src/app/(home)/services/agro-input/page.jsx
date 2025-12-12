import PageLayout from "@/components/page/PageLayout"
import JsonLdScripts from "@/components/provider/JsonLdScripts"
import AgroInput from "@/components/services/AgroInput"
import { getAgroInputBreadcrumbJsonLd, getAgroInputJsonLd } from "@/utils/seo/seo.jsonld";
import { getAgroInputMetadata } from "@/utils/seo/seo.meta";

export const metadata = getAgroInputMetadata();
const AgroInputPage = () => {
    const jsonLdGenerators = [getAgroInputJsonLd, getAgroInputBreadcrumbJsonLd];
    return (
        <>
            <JsonLdScripts generators={jsonLdGenerators} />
            <PageLayout
                subtitle='Sales of Agro-Input Products'
                title={<>
                    Agro-Input <span className="text-green-200">Products</span>
                </>}
                description="Protecting farmers from adulterated and low-quality agricultural inputs through
                        rigorous research, quality authentication, and verified product promotion. We bridge
                        the gap between manufacturers and farmers with transparency and trust."
                badge="Trusted Agricultural Solutions"
                breadcrumbs={[
                    { label: 'Services', href: '/about#services' },
                    { label: 'Agro-Input', href: '/services/agro-input' }
                ]}>
                <AgroInput />
            </PageLayout>
        </>
    )
}

export default AgroInputPage
