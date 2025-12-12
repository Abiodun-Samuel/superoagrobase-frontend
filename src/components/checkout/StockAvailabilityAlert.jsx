import { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Package, X, ShoppingCart, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';

const StockAvailabilityAlert = ({ availability, onDismiss, productUrlPrefix = '/products' }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [height, setHeight] = useState('auto');
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            if (isCollapsed) {
                const currentHeight = contentRef.current.scrollHeight;
                setHeight(`${currentHeight}px`);

                requestAnimationFrame(() => {
                    setHeight('0px');
                });
            } else {
                const fullHeight = contentRef.current.scrollHeight;
                setHeight(`${fullHeight}px`);

                const timer = setTimeout(() => {
                    setHeight('auto');
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isCollapsed]);

    if (!availability?.has_issues || !availability?.issues?.length) {
        return null;
    }

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={toggleCollapse}
                        className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity flex-1 text-left"
                        aria-expanded={!isCollapsed}
                        aria-controls="stock-alert-content"
                    >
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <h3 className="font-semibold text-sm">
                            Stock Availability Issues ({availability.issues.length})
                        </h3>
                        <div className="ml-auto transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </button>
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors ml-2"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Collapsible Content with Smooth Animation */}
                <div
                    id="stock-alert-content"
                    ref={contentRef}
                    style={{
                        height: height,
                        overflow: 'hidden',
                        transition: 'height 300ms ease-in-out'
                    }}
                >
                    <div className="p-4 space-y-3">
                        <p className="text-sm text-amber-900">
                            The following {availability.issues.length === 1 ? 'item' : 'items'} in your cart {availability.issues.length === 1 ? 'has' : 'have'} availability issues:
                        </p>

                        {/* Issues List */}
                        <div className="space-y-3">
                            {availability.issues.map((issue, index) => (
                                <Link
                                    key={index}
                                    href={`${productUrlPrefix}/${issue.product_slug}`}
                                    className="block bg-white rounded-xl p-3 border border-amber-100 hover:border-amber-400 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex gap-3">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                                {issue.product_image ? (
                                                    <img
                                                        src={issue.product_image}
                                                        alt={issue.product_title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 text-sm mb-1 truncate hover:text-amber-600 transition-colors">
                                                {issue.product_title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mb-2 font-mono truncate">
                                                {issue.product_slug}
                                            </p>
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5">
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                                </div>
                                                <p className="text-xs text-amber-800 leading-relaxed">
                                                    {issue.product_issue}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Action Message */}
                        <div className="mt-4 p-3 bg-amber-100 rounded-xl">
                            <p className="text-xs text-amber-900">
                                <strong>What you can do:</strong> Please reduce the quantity for the affected {availability.issues.length === 1 ? 'item' : 'items'} or remove {availability.issues.length === 1 ? 'it' : 'them'} from your cart to proceed with your order.
                            </p>
                        </div>

                        {/* Back to Cart Button */}
                        <div className="mt-4 flex justify-center">
                            <Button
                                href={'/cart'}
                                color='orange'
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Cart</span>
                                <ShoppingCart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockAvailabilityAlert;