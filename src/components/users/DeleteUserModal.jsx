'use client';

import { memo } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Modal from '@/components/modal/Modal';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

const DeleteUserModal = memo(({ isOpen, onClose, user, onConfirm, isDeleting }) => {
    if (!user) return null;

    const handleConfirm = () => {
        onConfirm(user.id);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete User"
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
                            Deleting this user will permanently remove all their data, including profile information,
                            orders, and activity history. This action cannot be reversed.
                        </p>
                    </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Avatar
                        src={user.avatar}
                        initials={user.initials}
                        size="lg"
                        showProfileStatus
                        isProfileCompleted={user.profile_completed}
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user.full_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                        </p>
                        {user.phone_number && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                {user.phone_number}
                            </p>
                        )}
                    </div>
                </div>

                {/* Confirmation Message */}
                <div className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Are you absolutely sure you want to delete <span className="font-semibold">{user.full_name}</span>?
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Type <span className="font-mono font-semibold bg-gray-100 dark:bg-gray-800 px-1 rounded">DELETE</span> to confirm:
                    </p>
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
                        Delete User
                    </Button>
                </div>
            </div>
        </Modal>
    );
});

DeleteUserModal.displayName = 'DeleteUserModal';

export default DeleteUserModal;