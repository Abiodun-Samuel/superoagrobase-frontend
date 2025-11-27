import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";
import IconBadge from "@/components/ui/IconBadge";
import { MOCK_PRODUCTS } from "@/utils/data";
import { AlertCircle, ChevronRight, Home, ShoppingBag } from "lucide-react";

const ErrorPage = () => (
  <>
    <div className="container mx-auto px-3 sm:px-5 lg:px-7 my-2 overflow-x-hidden!">
      {/* SEO Meta Tags would go in Next.js Head component */}
      <main className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Error Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <IconBadge color="red" size="2xl" icon={<AlertCircle size={50} className="text-red-500" strokeWidth={1.5} />} />
          </div>

          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-5xl font-black text-gray-900 tracking-tight">
              404
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-rose-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The page may have been moved or deleted.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <div className="max-w-sm flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="/"
                className="flex-1"
                aria-label="Go back to homepage"
              >
                <Home />
                <span>Back to Home</span>
              </Button>
              {/* <Button
                color="white"
                onClick={() => window.location.reload()}
                className="flex-1"
                aria-label="Reload current page"
              >
                <RefreshCw size={20} />
                <span>Try Again</span>
              </Button> */}
            </div>
          </div>
        </div>
      </main>

      {/* Recommended Products Section */}
      <section className="border-t border-gray-100 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Popular Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            While you're here, check out some of our best-selling agricultural products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            startIcon={<ShoppingBag />}
            href="/products"
            className="max-w-xs"
            variant="outline"
            endIcon={<ChevronRight />}
          >
            <span>View All Products</span>
          </Button>
        </div>
      </section>
    </div>
  </>
);

export default ErrorPage