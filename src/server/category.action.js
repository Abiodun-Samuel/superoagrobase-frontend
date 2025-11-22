import { cache } from 'react';
import { CategoryService } from '@/services/category.service';

export const getAllCategories = cache(async () => {
    try {
        const { data } = await CategoryService.list();
        return data || [];
    } catch (error) {
        return [];
    }
});