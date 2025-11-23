import { QUERY_KEYS } from "@/utils/queries.keys";
import { SSRWrapper } from "../provider/SSRWrapper";
import { ProductService } from "@/services/products.service";
import HeroWithFeaturedProducts from "./HeroWithFeaturedProducts";

const HeroWithFeaturedProductsSSR = () => {
    return (
        <SSRWrapper
            queryKey={QUERY_KEYS.products.featured()}
            service={ProductService.getFeaturedProducts}
        >
            <HeroWithFeaturedProducts />
        </SSRWrapper>
    );
}

export default HeroWithFeaturedProductsSSR