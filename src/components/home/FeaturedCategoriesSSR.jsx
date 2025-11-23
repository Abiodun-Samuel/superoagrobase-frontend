import { CategoryService } from '@/services/categories.service';
import { QUERY_KEYS } from '@/utils/queries.keys';
import { SSRWrapper } from '../provider/SSRWrapper';
import FeaturedCategories from './FeaturedCategories';

export default async function FeaturedCategoriesSSR() {
    return (
        <SSRWrapper
            queryKey={QUERY_KEYS.categories.lists()}
            service={CategoryService.getCategories}
        >
            <FeaturedCategories />
        </SSRWrapper>
    );
}
