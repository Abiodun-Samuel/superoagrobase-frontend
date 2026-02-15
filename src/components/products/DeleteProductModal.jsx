'use client';

import { memo } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Modal from '@/components/modal/Modal';
import Button from '@/components/ui/Button';

const DeleteProductModal = memo(({ isOpen, onClose, product, onConfirm, isDeleting }) => {
    if (!product) return null;

    const handleConfirm = () => {
        onConfirm(product.slug);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Product"
            description="This action cannot be undone"
            maxWidth="max-w-md"
            closeOnOutsideClick={!isDeleting}
        >
            <div className="space-y-6">
                {/* Warning Banner */}
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                            Warning: Permanent Action
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            This product will be permanently deleted from the system. All associated data including
                            images, descriptions, pricing, and vendor information will be lost. This action cannot be reversed.
                        </p>
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <img
                        src={product.image || '/placeholder.png'}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {product.brands || 'No brand'} • {product.pack_size || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                            Category: {product.category?.title || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={handleConfirm}
                        loading={isDeleting}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Product
                    </Button>
                </div>
            </div>
        </Modal>
    );
});

DeleteProductModal.displayName = 'DeleteProductModal';

export default DeleteProductModal;