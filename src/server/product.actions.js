import { cache } from 'react';
import { ProductService } from '@/services/product.service';


export const getFeaturedProducts = cache(async () => {
    try {
        const { data } = await ProductService.featuredProducts();
        return data || [];
    } catch (error) {
        return [];
    }
});