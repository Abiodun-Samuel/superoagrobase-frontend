'use client';

import { useEffect } from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import Modal from '@/components/modal/Modal';
import Button from '@/components/ui/Button';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import PermissionDenied from '@/components/users/PermissionDenied';
import useUserPermissions from '@/hooks/useUserPermissions';
import { useForm } from 'react-hook-form';

const STATUS_MAP = {
    active: { icon: '✓', description: 'User has full access to the platform' },
    online: { icon: '●', description: 'User is currently active on the platform' },
    inactive: { icon: '○', description: 'User account is temporarily inactive' },
    suspended: { icon: '⏸', description: 'User access is temporarily suspended' },
    deactivated: { icon: '×', description: 'User account has been deactivated' },
    banned: { icon: '🚫', description: 'User has been permanently banned' },
    pending: { icon: '⏳', description: 'User account is pending verification' },
};

const getStatusInfo = (status) => STATUS_MAP[status] ?? STATUS_MAP.active;

const STATUS_OPTIONS = [
    { value: 'pending', text: 'Pending' },
    { value: 'active', text: 'Active' },
    { value: 'inactive', text: 'Inactive' },
    { value: 'suspended', text: 'Suspended' },
    { value: 'deactivated', text: 'Deactivated' },
    { value: 'banned', text: 'Banned' },
    { value: 'online', text: 'Online' },
];

const ChangeStatusModal = ({ isOpen, onClose, user, onConfirm, isLoading }) => {
    const { canUpdateStatus, isSelf, isSuperAdmin } = useUserPermissions(user);

    const { register, setValue, watch, handleSubmit, reset } = useForm({
        defaultValues: { status: user?.status ?? 'active' },
    });

    const statusValue = watch('status');

    useEffect(() => {
        if (user) reset({ status: user.status });
    }, [user, reset]);

    const newStatusInfo = getStatusInfo(statusValue);
    const isStatusChanged = statusValue !== user?.status;

    const onSubmit = (data) => onConfirm(data.status);

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Change User Status"
            description={`Update status for ${user.full_name}`}
            maxWidth="max-w-lg"
        >
            {/* ── Permission gate ─────────────────────────────── */}
            {!canUpdateStatus ? (
                <>
                    <PermissionDenied isSelf={isSelf} isSuperAdmin={isSuperAdmin} />
                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button type="button" variant="outline" color="gray" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </>
            ) : (
                /* ── Authorised view ──────────────────────────── */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    Status Management
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    Changing the user&apos;s status will immediately affect their access and permissions
                                    on the platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {user.full_name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <SingleSelectForm
                        expandParent
                        label="Select New Status"
                        name="status"
                        options={STATUS_OPTIONS}
                        register={register}
                        setValue={setValue}
                        placeholder="Select status"
                        searchable={false}
                        defaultValue={statusValue}
                        required
                    />

                    {/* Status Preview */}
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                            Status Information
                        </h4>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-xl" aria-hidden="true">{newStatusInfo.icon}</span>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                                    {statusValue}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {newStatusInfo.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Comparison */}
                    {isStatusChanged && (
                        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                    Status Change
                                </h4>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-700 dark:text-amber-300">Current:</span>
                                    <span className="px-3 py-1 bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-900 dark:text-amber-100 font-medium capitalize">
                                        {user.status}
                                    </span>
                                </div>
                                <span className="text-amber-600 dark:text-amber-400">→</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-700 dark:text-amber-300">New:</span>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-700 rounded-lg text-green-900 dark:text-green-100 font-medium capitalize">
                                        {statusValue}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            color="gray"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="green"
                            loading={isLoading}
                            disabled={isLoading || !isStatusChanged}
                        >
                            {isLoading ? 'Updating Status…' : 'Update Status'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ChangeStatusModal;