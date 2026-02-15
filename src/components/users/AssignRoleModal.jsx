'use client';

import { useEffect } from 'react';
import { Info, User, Store, UserCog, ShieldCheck, Star } from 'lucide-react';
import Modal from '@/components/modal/Modal';
import Button from '@/components/ui/Button';
import CardRadioForm from '@/components/form/CardRadioForm';
import { useForm } from 'react-hook-form';

const ROLE_HIERARCHY = {
    user: ['user'],
    vendor: ['vendor', 'user'],
    admin: ['admin', 'vendor', 'user'],
    super_admin: ['super_admin', 'admin', 'vendor', 'user'],
};

const formatRoleName = (role) => {
    return role
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const AssignRoleModal = ({ isOpen, onClose, user, onConfirm, isLoading }) => {
    const { control, watch, handleSubmit, reset } = useForm({
        defaultValues: {
            role: user?.roles?.[0] || 'user',
        },
    });

    const roleValue = watch('role');

    useEffect(() => {
        if (user) {
            reset({
                role: user.roles?.[0] || 'user',
            });
        }
    }, [user, reset]);

    const roleOptions = [
        {
            id: 'user',
            value: 'user',
            title: 'User',
            description: 'Base role with standard access',
            icon: User,
            badge: 'Base Role',
        },
        {
            id: 'vendor',
            value: 'vendor',
            title: 'Vendor',
            description: 'Can manage products and inventory',
            icon: Store,
            badge: '+ User',
        },
        {
            id: 'admin',
            value: 'admin',
            title: 'Admin',
            description: 'Full administrative privileges',
            icon: UserCog,
            badge: '+ Vendor + User',
        },
        {
            id: 'super_admin',
            value: 'super_admin',
            title: 'Super Admin',
            description: 'Complete system control',
            icon: ShieldCheck,
            badge: '+ Admin + Vendor + User',
        },
    ];

    const currentRole = user?.roles?.[0];
    const newRoles = ROLE_HIERARCHY[roleValue] || ['user'];
    const isRoleChanged = roleValue !== currentRole;

    const getPrimaryRole = (role) => role;
    const getSecondaryRoles = (roles) => roles.slice(1);

    const onSubmit = (data) => {
        onConfirm({
            role: data.role,
            roles: ROLE_HIERARCHY[data.role],
        });
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign User Role"
            description={`Update role for ${user.full_name}`}
            maxWidth="max-w-2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Role Hierarchy System
                            </h4>
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                Each role automatically includes all lower-level roles. For example, assigning "Admin"
                                also grants "Vendor" and "User" permissions.
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
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Role Selection */}
                <div>
                    <CardRadioForm
                        label="Select Role"
                        name="role"
                        control={control}
                        options={roleOptions}
                        layout="grid"
                        color="green"
                        required
                    />
                </div>

                {/* Roles Preview */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Roles to be Assigned
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Primary Role */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-700 rounded-lg">
                            <Star className="w-3.5 h-3.5 text-green-700 dark:text-green-300 fill-current" />
                            <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                                {formatRoleName(getPrimaryRole(roleValue))}
                            </span>
                            <span className="text-xs text-green-700 dark:text-green-300 ml-1">
                                (Primary)
                            </span>
                        </div>

                        {/* Secondary Roles */}
                        {getSecondaryRoles(newRoles).map((role) => (
                            <div
                                key={role}
                                className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
                            >
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {formatRoleName(role)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Change Comparison */}
                {isRoleChanged && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                            Role Change
                        </h4>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-amber-700 dark:text-amber-300">Current:</span>
                                <span className="px-3 py-1 bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-900 dark:text-amber-100 font-medium">
                                    {formatRoleName(currentRole)}
                                </span>
                            </div>
                            <div className="text-amber-600 dark:text-amber-400">→</div>
                            <div className="flex items-center gap-2">
                                <span className="text-amber-700 dark:text-amber-300">New:</span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-700 rounded-lg text-green-900 dark:text-green-100 font-medium">
                                    {formatRoleName(roleValue)}
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
                        disabled={isLoading || !isRoleChanged}
                    >
                        {isLoading ? 'Assigning Role...' : 'Assign Role'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AssignRoleModal;