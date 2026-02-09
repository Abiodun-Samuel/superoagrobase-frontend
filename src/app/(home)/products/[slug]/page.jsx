import JsonLdScripts from '@/components/provider/JsonLdScripts';
import { ProductService } from '@/services/products.service';
import { buildBreadcrumb } from '@/utils/helper';
import { getProductJsonLd, getProductFAQJsonLd, getBreadcrumbJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
import { getProductMetadata } from '@/utils/seo/seo.meta';
import ProductDetails from '@/components/products/ProductDetails';
import PageLayout from '@/components/page/PageLayout';
import PageHeader from '@/components/page/PageHeader';
import { notFound } from 'next/navigation';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
    try {
        const { slug } = await params;
        if (!slug) return getProductMetadata(null);
        const { data: product } = await ProductService.getProductBySlug(slug, {
            incrementView: false
        });
        return getProductMetadata(product);
    } catch (error) {
        return getProductMetadata(null);
    }
}

export default async function ProductPage({ params }) {
    try {
        const { slug } = await params;
        if (!slug) notFound();

        const { data: product } = await ProductService.getProductBySlug(slug, { incrementView: true });

        if (!product) notFound();

        const breadcrumbItems = buildBreadcrumb({ page: 'product', data: product });

        return (
            <>
                <JsonLdScripts
                    generators={[
                        getOrganizationJsonLd,
                        { fn: getProductJsonLd, params: product },
                        { fn: getBreadcrumbJsonLd, params: [...breadcrumbItems] },
                        { fn: getProductFAQJsonLd, params: product }
                    ]}
                />
                <PageHeader
                    title={product.name}
                    description={product.short_description || product.description?.substring(0, 150)}
                    badge={product.category?.name || 'Product'}
                    breadcrumbs={breadcrumbItems}
                    isBackButton={true}
                    backLabel="Back to Products"
                />
                <PageLayout>
                    <ProductDetails product={product} />
                </PageLayout>
            </>
        );
    } catch (error) {
        notFound();
    }
}
// import ProductDetails from '@/components/products/ProductDetails';
// import JsonLdScripts from '@/components/provider/JsonLdScripts';
// import { ProductService } from '@/services/products.service';
// import { buildBreadcrumb } from '@/utils/helper';
// import { getProductJsonLd, getProductFAQJsonLd, getBreadcrumbJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
// import { getProductMetadata } from '@/utils/seo/seo.meta';
// import { notFound } from 'next/navigation';

// export const revalidate = 3600;
// export const dynamicParams = true;

// export async function generateMetadata({ params }) {
//     try {
//         const { slug } = await params;
//         if (!slug) return getProductMetadata(null);
//         const { data: product } = await ProductService.getProductBySlug(slug, {
//             incrementView: false
//         });
//         return getProductMetadata(product);
//     } catch (error) {
//         return getProductMetadata(null);
//     }
// }

// export default async function ProductPage({ params }) {
//     try {
//         const { slug } = await params;
//         if (!slug) notFound();

//         const { data: product } = await ProductService.getProductBySlug(slug, { incrementView: true });

//         if (!product) notFound()
//         const breadcrumbItems = buildBreadcrumb({ page: 'product', data: product });

//         return (
//             <>
//                 <JsonLdScripts
//                     generators={[
//                         getOrganizationJsonLd,
//                         { fn: getProductJsonLd, params: product },
//                         { fn: getBreadcrumbJsonLd, params: [...breadcrumbItems] },
//                         { fn: getProductFAQJsonLd, params: product }
//                     ]}
//                 />
//                 <ProductDetails product={product}  />
//             </>
//         );
//     } catch (error) {
//         notFound();
//     }
// }