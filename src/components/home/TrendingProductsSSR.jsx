import { ProductService } from "@/services/products.service";
import { SSRWrapper } from "../provider/SSRWrapper";
import { QUERY_KEYS } from "@/utils/queries.keys";
import TrendingProducts from "./TrendingProducts";

const TrendingProductsSSR = () => {
    return (
        <SSRWrapper
            queryKey={QUERY_KEYS.products.trending()}
            service={ProductService.getTrendingProducts}
        >
            <TrendingProducts />
        </SSRWrapper>
    );
}

export default TrendingProductsSSR