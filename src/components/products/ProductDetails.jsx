import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductReviews from '@/components/products/ProductReviews';
import ProductSpecifications from '@/components/products/ProductSpecifications';
import SimilarProducts from '@/components/products/SimilarProducts';
import React from 'react'
import Breadcrumb from '../common/Breadcrumb';


const ProductDetails = ({ product, breadcrumbItems }) => {

    return (
        <main className="min-h-screen">
            {/* Breadcrumb Navigation */}
            <Breadcrumb breadcrumbItems={breadcrumbItems} />

            {/* Product Detail Section */}
            <div className="bg-white rounded-2xl shadow overflow-hidden mb-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-5 lg:p-8">
                    {/* Product Images */}
                    <ProductImageGallery product={product} />

                    {/* Product Info & Add to Cart */}
                    <ProductInfo product={product} />
                </div>
            </div>

            {/* Product Specifications */}
            <ProductSpecifications product={product} />

            {/* Reviews Section */}
            <ProductReviews product={product} />

            {/* Similar Products */}
            <SimilarProducts
                categorySlug={product.category?.slug}
                currentProductId={product.id}
            />
        </main>
    )
}

export default ProductDetails