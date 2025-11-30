// app/products/page.js
import { ProductService } from '@/services/products.service';
import { getProductsMetadata } from '@/utils/seo/seo.meta';
import {
    getProductCollectionJsonLd,
    getProductsListBreadcrumbJsonLd,
    getSearchResultsJsonLd,
    getOrganizationJsonLd
} from '@/utils/seo/seo.jsonld';
import ProductsPageDetails from '@/components/products/ProductsPageDetails';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const parseSearchParams = async (searchParams) => {
    const params = await searchParams;
    const page = params?.page ? parseInt(params.page) : 1;
    const perPage = params?.per_page ? parseInt(params.per_page) : 50;

    if (page < 1 || isNaN(page)) return null;
    if (perPage < 1 || perPage > 200 || isNaN(perPage)) return null;

    return {
        category: params?.category || null,
        subcategory: params?.subcategory || null,
        search: params?.search || null,
        sort: params?.sort || 'newest',
        brand: params?.brand || null,
        minPrice: params?.minPrice || null,
        maxPrice: params?.maxPrice || null,
        inStock: params?.inStock === 'true',
        page,
        per_page: perPage
    };
};


const fetchProducts = async (filters) => {
    try {
        const response = await ProductService.getProducts(filters);
        if (!response?.data) {
            return { products: [], meta: {}, links: [], success: false };
        }
        return {
            products: response.data || [],
            meta: response.meta || {},
            links: response.links || {},
            success: true
        };
    } catch (error) {
        return { products: [], meta: {}, links: [], success: false };
    }
};


const validatePagination = (page, totalPages) => {
    if (totalPages === 0) return true;
    return page <= totalPages;
};

const generateJsonLdScripts = ({ category, subcategory, search, products, totalProducts, page, totalPages, perPage }) => {
    return [
        getOrganizationJsonLd(),
        getProductsListBreadcrumbJsonLd({ category, subcategory }),
        getProductCollectionJsonLd({ category, subcategory, search, products, totalProducts, page, totalPages, perPage }),
        search && getSearchResultsJsonLd({ search, totalProducts, products, page })
    ].filter(Boolean);
};

const JsonLdScripts = ({ scripts }) => (
    <>
        {scripts.map((jsonLd, idx) => (
            <script
                key={`jsonld-${idx}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        ))}
    </>
);

export async function generateMetadata({ searchParams }) {
    const filters = await parseSearchParams(searchParams);

    if (!filters) {
        return getProductsMetadata({});
    }

    const { meta } = await fetchProducts(filters);

    return getProductsMetadata({
        category: filters.category,
        subcategory: filters.subcategory,
        search: filters.search,
        brand: filters.brand,
        page: filters.page,
        totalProducts: meta.total || 0,
        totalPages: meta.last_page || 1,
        perPage: filters.per_page
    });
}

const ProductsPage = async ({ searchParams }) => {
    const filters = await parseSearchParams(searchParams);

    if (!filters) {
        notFound();
    }

    const { products, meta, links, success } = await fetchProducts(filters);
    if (!success) {
        notFound();
    }

    const currentPage = meta.current_page || filters.page;
    const totalPages = meta.last_page || 1;

    if (!validatePagination(currentPage, totalPages)) {
        notFound();
    }

    const jsonLdScripts = generateJsonLdScripts({
        category: filters.category,
        subcategory: filters.subcategory,
        search: filters.search,
        products,
        totalProducts: meta.total || 0,
        page: currentPage,
        totalPages,
        perPage: filters.per_page
    });

    return (
        <>
            <JsonLdScripts scripts={jsonLdScripts} />

            <ProductsPageDetails
                products={products}
                meta={meta}
                links={links}
                filters={{
                    category: filters.category,
                    subcategory: filters.subcategory,
                    search: filters.search,
                    brand: filters.brand,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    inStock: filters.inStock,
                    sort: filters.sort,
                    page: currentPage,
                    per_page: filters.per_page
                }}
            />
        </>
    );
};

export default ProductsPage;