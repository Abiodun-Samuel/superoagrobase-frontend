import { PackageOpen, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const EmptyState = ({ hasFilters, onClearFilters }) => {
    if (hasFilters) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <Filter className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No orders found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    We couldn't find any orders matching your filters. Try adjusting your search criteria.
                </p>
                <Button
                    color="green"
                    variant="outline"
                    onClick={onClearFilters}
                    type="button"
                >
                    Clear Filters
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full mb-4">
                <PackageOpen className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                No orders yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link href="/products">
                <Button
                    color="green"
                    type="button"
                >
                    Start Shopping
                </Button>
            </Link>
        </div>
    );
};

export default EmptyState;