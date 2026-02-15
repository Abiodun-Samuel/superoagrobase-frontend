import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductReviews from '@/components/products/ProductReviews';
import ProductSpecifications from '@/components/products/ProductSpecifications';
import SimilarProducts from '@/components/products/SimilarProducts';


const ProductDetails = ({ product }) => {

    return (
        <main className="min-h-screen my-10 space-y-10">

            {/* Product Detail Section */}
            <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-5 lg:p-8">
                    {/* Product Images */}
                    <ProductImageGallery product={product} />

                    <ProductInfo product={product} />
                </div>
            </div>

            <ProductSpecifications product={product} />

            {/* Reviews Section */}
            <ProductReviews product={product} />

            {/* Similar Products */}
            <SimilarProducts
                product={product}
                subcategorySlug={product.subcategory?.slug}
                categorySlug={product.category?.slug}
                currentProductId={product.id}
            />
        </main>
    )
}

export default ProductDetails