import CategoriesList from '../category/CategoriesList';
import { CategoryService } from '@/services/category.service';
import { ssrQuery } from '@/lib/ssrQuery';
import { QUERY_KEYS } from '@/utils/queryKeys';
import { Suspense } from 'react';
import ContentPlaceholder from '../common/ContentPlaceholder';
import { Package, Sparkles } from 'lucide-react';
import CategoriesSkeleton from '../category/CategoriesSkeleton';
import TextBadge from '../ui/TextBadge';
import FeaturedCategoriesSkeleton from '../category/FeaturedCategoriesSkeleton';

export default function FeaturedCategories({ categories }) {

    if (!categories || categories.length === 0) {
        return (
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <ContentPlaceholder
                        icon={Package}
                        title="No Featured Categories"
                        description="We're updating our featured categories. Check back soon for amazing deals!"
                        color="blue"
                        variant="light"
                    />
                </div>
            </section>
        );
    }

    return (
        <>
            {/* <Suspense fallback={<FeaturedCategoriesSkeleton />}> */}
            <section className="my-24">
                <div className="text-center mb-12">
                    <TextBadge className='mb-4' color='green' variant='light' size='lg' startIcon={<Sparkles />} endIcon={<Package />}>
                        Shop by Category
                    </TextBadge>

                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Featured <span className="text-green-600">Categories</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our comprehensive range of agricultural products tailored for modern farming
                    </p>
                </div>
                <CategoriesList categories={categories} />
            </section>
            {/* </Suspense> */}
        </>
    );
}