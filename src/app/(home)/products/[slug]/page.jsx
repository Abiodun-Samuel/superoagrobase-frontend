import ProductDetails from '@/components/products/ProductDetails';
import { ProductService } from '@/services/products.service';
import { buildBreadcrumb } from '@/utils/helper';
import { getProductJsonLd, getProductFAQJsonLd, getBreadcrumbJsonLd, getOrganizationJsonLd } from '@/utils/seo/seo.jsonld';
import { getProductMetadata } from '@/utils/seo/seo.meta';
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

/**
 * Product detail page component
 */
export default async function ProductPage({ params }) {
    try {
        const { slug } = await params;
        if (!slug) notFound();

        const { data: product } = await ProductService.getProductBySlug(slug, {
            incrementView: true
        });

        if (!product) notFound()

        const breadcrumbItems = buildBreadcrumb({
            page: 'product',
            data: product,
        });

        const jsonLdScripts = [
            getProductJsonLd(product),
            getBreadcrumbJsonLd([...breadcrumbItems]),
            getOrganizationJsonLd(),
            getProductFAQJsonLd(product)
        ];

        return (
            <>
                {jsonLdScripts.map((jsonLd, idx) => (
                    <script
                        key={idx}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                ))}

                <ProductDetails product={product} breadcrumbItems={breadcrumbItems} />
            </>
        );
    } catch (error) {
        notFound();
    }
}