import { cache } from 'react';
import { notFound } from 'next/navigation';
import { API_URL } from "@/utils/env";
const viewIncrementTracker = new Map();


export const ProductServerService = {
    // ✅ Cached product fetcher with view count control
    getProductWithView: async (slug) => {
        // return await incrementProductView(slug);
    },

    getProductBySlug: cache(async (slug, options = {}) => {
        try {
            const { incrementView = false, throwOnNotFound = false } = options;
            const params = new URLSearchParams();
            if (incrementView) params.append('increment_view', 'true');
            const url = `${API_URL}/products/${slug}${params.toString() ? `?${params}` : ''}`;
            const res = await fetch(url, {
                next: { revalidate: 3600 }
            });
            if (!res.ok) {
                if (throwOnNotFound) notFound();
                return null;
            }
            const { data } = await res.json();
            if (!data && throwOnNotFound) notFound();
            return data;
        } catch (error) {
            if (error?.message === 'NEXT_NOT_FOUND') {
                throw error;
            }
            return null;
        }
    }),

    // ✅ Get all product slugs for static generation
    async getAllProductSlugs() {
        try {
            const res = await fetch(`${API_URL}/products`, {
                next: { revalidate: 3600 } // Cache for 1 hour instead of no-store
            });

            if (!res.ok) return [];

            const { data } = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching product slugs:', error);
            return [];
        }
    }
};