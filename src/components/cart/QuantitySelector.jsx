'use client'

import { useState, useEffect } from "react";
import Button from "../ui/Button";
import { useUpdateCartItem } from "@/queries/cart.query";

const QuantitySelector = ({ quantity, maxStock, item }) => {
    const { mutate: updateCartItem, isPending: isLoading } = useUpdateCartItem();
    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [error, setError] = useState('');

    useEffect(() => {
        setLocalQuantity(quantity);
        setError('');
    }, [quantity]);

    const hasChanges = localQuantity !== quantity && localQuantity !== '';

    const handleUpdateQuantity = () => {
        updateCartItem({
            cartItemId: item.id,
            product_id: item?.product_id,
            quantity: localQuantity,
        });
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        setError('');

        if (value === '') {
            setLocalQuantity('');
            return;
        }

        const numValue = Number(parseInt(value, 10));

        if (isNaN(numValue)) {
            setError('Invalid number');
            return;
        }

        if (numValue < 1) {
            setError('Min quantity is 1');
            setLocalQuantity(1);
            return;
        }

        if (numValue > maxStock) {
            setError(`Only ${maxStock} in stock`);
            setLocalQuantity(maxStock);
            return;
        }

        setLocalQuantity(numValue);
    };

    const handleBlur = () => {
        if (localQuantity === '') {
            setLocalQuantity(quantity);
            setError('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && hasChanges && !isLoading) {
            handleUpdate();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleUpdate = () => {
        if (localQuantity === '' || localQuantity < 1) {
            setError('Invalid quantity');
            setLocalQuantity(quantity);
            return;
        }

        if (localQuantity > maxStock) {
            setError(`Only ${maxStock} in stock`);
            setLocalQuantity(maxStock);
            return;
        }

        onUpdate(localQuantity);
    };

    const handleCancel = () => {
        setLocalQuantity(quantity);
        setError('');
    };

    return (
        <div className="space-y-1 w-full sm:w-auto">
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                {/* Quantity Input - Responsive Width */}
                <div className="relative flex  gap-5">
                    <input
                        type="number"
                        min="1"
                        max={maxStock}
                        value={localQuantity}
                        onChange={handleQuantityChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className={`
                            xs:w-32 sm:w-32
                            px-5 py-2 h-10 sm:h-10 md:h-11
                            border rounded-xl
                            text-center font-medium text-gray-900 text-sm
                            focus:outline-0 border-gray-300
                            disabled:bg-gray-100 disabled:cursor-not-allowed 
                            transition-all
                            ${error ? 'border-red-500' : 'border-gray-300'}
                        `}
                        aria-label="Quantity"
                        placeholder="Qty"
                    />
                    {hasChanges && (
                        <Button
                            onClick={handleUpdateQuantity}
                            loading={isLoading}
                            disabled={isLoading || !!error}
                            aria-label="Update quantity"
                        >
                            <span>Update</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Error Message - Compact on mobile */}
            {error && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                    <span className="inline-block mt-0.5">⚠</span>
                    <span className="break-words">{error}</span>
                </p>
            )}

            {/* Helper Text - Hidden on small mobile */}
            <p className="hidden sm:block text-xs text-gray-500">
                Press Enter to update or Esc to cancel
            </p>
        </div>
    );
}

export default QuantitySelector;