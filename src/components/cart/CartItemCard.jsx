'use client'

import { Loader2, Package, Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import Link from "next/link";
import { useRemoveCartItem } from "@/queries/cart.query";

const CartItemCard = ({ item }) => {
    const { product, quantity, itemTotal } = item;

    const { mutate: removeCartItem, isPending } = useRemoveCartItem();

    const handleRemoveItem = () => {
        removeCartItem(item.id);
    };

    return (
        <div className="
            flex flex-col sm:flex-row 
            gap-3 sm:gap-4 
            p-3 sm:p-4 md:p-6
            bg-white border border-gray-200 rounded-xl 
            hover:shadow-md transition-shadow
        ">
            {/* Mobile: Image + Remove Button Row */}
            <div className="flex sm:block gap-3">
                {/* Product Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                    {product.stock <= 5 && (
                        <div className="absolute top-1 right-1 bg-orange-500 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded font-medium">
                            Low
                        </div>
                    )}
                </div>

                {/* Remove Button - Top right on mobile */}
                <button
                    onClick={handleRemoveItem}
                    disabled={isPending}
                    className="
                        sm:hidden
                        ml-auto self-start
                        p-2 text-red-500 hover:bg-red-50 rounded-lg 
                        transition-colors disabled:opacity-50
                    "
                    aria-label="Remove item"
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Trash2 className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                {/* Header Section */}
                <div className="flex justify-between items-start gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                        <Link
                            href={`/products/${product?.slug}`}
                            target="_blank"
                            className="
                                font-semibold text-gray-900 
                                text-base sm:text-lg 
                                hover:text-green-600
                                line-clamp-2 sm:line-clamp-1
                                transition-colors
                            "
                        >
                            {product.title}
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                            {product.brands}
                        </p>

                        {/* Tags - Responsive */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                                <Package className="w-3 h-3" />
                                <span className="hidden xs:inline">{product.pack_size}</span>
                                <span className="xs:hidden">{product.pack_size?.split(' ')[0]}</span>
                            </span>
                            <span className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                                <span className="hidden sm:inline">Stock: </span>
                                <span className="font-medium">{product.stock}</span>
                            </span>
                        </div>
                    </div>

                    {/* Remove Button - Desktop */}
                    <button
                        onClick={handleRemoveItem}
                        disabled={isPending}
                        className="
                            hidden sm:block
                            p-2 text-red-500 hover:bg-red-50 rounded-lg 
                            transition-colors disabled:opacity-50
                            flex-shrink-0
                        "
                        aria-label="Remove item"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Price and Quantity Section - Responsive Layout */}
                <div className="
                    flex flex-col xs:flex-row gap-1 
                    items-stretch xs:items-end
                    pt-2 sm:pt-0
                ">
                    {/* Quantity Selector */}
                    <div className="flex-shrink-0">
                        <QuantitySelector
                            quantity={quantity}
                            maxStock={product.stock}
                            item={item}
                        />
                    </div>

                    {/* Spacer - pushes price to right on desktop */}
                    <div className="hidden sm:block flex-1" />

                    {/* Price Section */}
                    <div className="
                        flex xs:flex-col 
                        justify-between xs:justify-end 
                        items-center xs:items-end 
                        gap-2
                        xs:text-right
                    ">
                        <div className="text-xs sm:text-sm text-gray-500 order-2 xs:order-1">
                            ₦{parseFloat(product.price).toLocaleString()}
                            <span className="inline">/each</span>
                        </div>
                        <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900 order-1 xs:order-2">
                            ₦{itemTotal.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;