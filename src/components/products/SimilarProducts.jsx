import { ProductService } from '@/services/products.service';
import ProductCard from '@/components/products/ProductCard';
import { Sparkles } from 'lucide-react';

/**
 * Similar Products Section
 */
export default async function SimilarProducts({ categorySlug, currentProductId }) {
    // Fetch similar products from the same category
    let similarProducts = [];

    // try {
    //     if (categorySlug) {
    //         const { data } = await ProductService.getProductsByCategory(categorySlug, {
    //             per_page: 5,
    //             exclude: currentProductId
    //         });
    //         similarProducts = data?.products || [];
    //     }
    // } catch (error) {
    //     console.error('Error fetching similar products:', error);
    // }

    if (!similarProducts || similarProducts.length === 0) {
        return null;
    }

    return (
        <section className="bg-white rounded-2xl shadow p-5 lg:p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
                    <p className="text-sm text-gray-600 mt-1">Similar products from this category</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {similarProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}