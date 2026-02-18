'use client';

import { memo } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/modal/Modal';

const DeleteBlogModal = ({ isOpen, onClose, blog, onConfirm, isDeleting }) => {
    if (!blog) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Blog Post"
            description="This action cannot be undone and will permanently delete this blog post."
            maxWidth="max-w-md"
            closeOnOutsideClick={!isDeleting}
        >
            <div className="space-y-6">
                {/* Warning Icon */}
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                {/* Blog Info */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                        {blog.featured_image ? (
                            <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                            />
                        ) : (
                            <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                                {blog.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                {blog.excerpt}
                            </p>
                            {blog.author && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    By {blog.author.full_name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Warning Message */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>Warning:</strong> Deleting this blog post will remove all associated data including comments, views, and analytics. This action is irreversible.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={() => onConfirm(blog.slug)}
                        loading={isDeleting}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Blog'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default memo(DeleteBlogModal);