'use client';

import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, Shield, Activity } from 'lucide-react';
import Modal from '@/components/modal/Modal';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import SingleSelectForm from '@/components/form/SingleSelectForm';

const EditUserModal = memo(({ isOpen, onClose, user, onSave, isSaving }) => {
    const { register, setValue, watch, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            status: user?.status || 'active',
            role: user?.roles?.[0] || 'user',
        }
    });

    // Reset form when user changes
    useEffect(() => {
        if (user) {
            reset({
                status: user.status || 'active',
                role: user.roles?.[0] || 'user',
            });
        }
    }, [user, reset]);

    const statusValue = watch('status');
    const roleValue = watch('role');

    const statusOptions = [
        { value: 'pending', text: 'Pending' },
        { value: 'active', text: 'Active' },
        { value: 'inactive', text: 'Inactive' },
        { value: 'suspended', text: 'Suspended' },
        { value: 'deactivated', text: 'Deactivated' },
        { value: 'banned', text: 'Banned' },
        { value: 'online', text: 'Online' },
    ];

    const roleOptions = [
        { value: 'user', text: 'User' },
        { value: 'vendor', text: 'Vendor' },
        { value: 'admin', text: 'Admin' },
        { value: 'super_admin', text: 'Super Admin' },
    ];

    const onSubmit = (data) => {
        onSave({
            userId: user.id,
            status: data.status,
            role: data.role,
        });
    };

    if (!user) return null;

    // Get status color for badge
    const getStatusColor = (status) => {
        const colors = {
            active: 'green',
            online: 'green',
            inactive: 'gray',
            suspended: 'orange',
            banned: 'red',
            pending: 'yellow',
            deactivated: 'gray',
        };
        return colors[status?.toLowerCase()] || 'gray';
    };

    const hasChanges = isDirty;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit User"
            description="Update user status and role"
            maxWidth="max-w-lg"
            closeOnOutsideClick={!isSaving}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* User Info Display */}
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

                {/* Current Status Badge */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100">Current Status</p>
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 capitalize">
                            {user.status} • {user.roles?.[0] || 'user'}
                        </p>
                    </div>
                </div>

                {/* Status Selection */}
                <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Activity className="w-4 h-4" />
                        Status
                    </label>
                    <SingleSelectForm
                        name="status"
                        placeholder="Select status"
                        options={statusOptions}
                        register={register}
                        setValue={setValue}
                        searchable={false}
                        defaultValue={statusValue}
                    />
                    {errors.status && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {errors.status.message}
                        </p>
                    )}
                </div>

                {/* Role Selection */}
                <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Shield className="w-4 h-4" />
                        Role
                    </label>
                    <SingleSelectForm
                        name="role"
                        placeholder="Select role"
                        options={roleOptions}
                        register={register}
                        setValue={setValue}
                        searchable={false}
                        defaultValue={roleValue}
                    />
                    {errors.role && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {errors.role.message}
                        </p>
                    )}
                </div>

                {/* Info Note */}
                {hasChanges && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>Note:</strong> Changes will take effect immediately and may affect user access and permissions.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        color="gray"
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="green"
                        loading={isSaving}
                        disabled={!hasChanges || isSaving}
                        className="flex-1"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
});

EditUserModal.displayName = 'EditUserModal';

export default EditUserModal;