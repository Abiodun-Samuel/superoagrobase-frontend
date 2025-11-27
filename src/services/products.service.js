import $api from "@/lib/axios";

const BASE_URL = "/products";

export const ProductService = {
    async getProducts(options = {}) {
        const { category, subcategory, search, brand, minPrice, maxPrice, inStock, sort = 'newest', per_page = 50, page } = options;

        const params = new URLSearchParams();

        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
        if (search) params.append('search', search);
        if (brand) params.append('brand', brand.trim());
        if (minPrice && !isNaN(minPrice)) params.append('minPrice', parseFloat(minPrice));
        if (maxPrice && !isNaN(maxPrice)) params.append('maxPrice', parseFloat(maxPrice));
        if (inStock === true || inStock === 'true') params.append('inStock', 'true');

        params.append('sort', sort);
        params.append('page', page);
        params.append('per_page', per_page);
        const { data } = await $api.get(`${BASE_URL}?${params.toString()}`);
        return data;
    },
    async getFeaturedProducts() {
        const { data } = await $api.get(`${BASE_URL}/featured`);
        return data;
    },
    async getTrendingProducts() {
        const { data } = await $api.get(`${BASE_URL}/trending`);
        return data;
    },
    async getProductBySlug(slug, options = {}) {
        const { incrementView = false } = options;
        const params = new URLSearchParams();
        if (incrementView) params.append('increment_view', 'true');
        const url = `${BASE_URL}/${slug}${params.toString() ? `?${params}` : ''}`;
        const { data } = await $api.get(url);
        return data;
    },
};
