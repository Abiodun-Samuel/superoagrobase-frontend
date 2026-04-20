'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
    Users,
    Search,
    Filter,
    Eye,
    Trash2,
    Phone,
    Calendar,
    Building2,
    Shield,
    Activity,
} from 'lucide-react';
import { useUsers, useDeleteUser, useUpdateUser, useAssignRole } from '@/queries/user.query';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import RoleBadge from '@/components/ui/RoleBadge';
import TextBadge from '@/components/ui/TextBadge';
import IconBadge from '@/components/ui/IconBadge';
import SingleSelectForm from '@/components/form/SingleSelectForm';
import InputForm from '@/components/form/InputForm';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/Table';
import Paginator from '@/components/common/Paginator';
import UserListSkeleton from './UserListSkeleton';
import ChangeStatusModal from './ChangeStatusModal';
import AssignRoleModal from './AssignRoleModal';
import DeleteUserModal from './DeleteUserModal';
import { formatDate, truncateText } from '@/utils/helper';
import { useModal } from '@/hooks/useModal';
import useAuth from '@/hooks/useAuth';

const AdminUserList = () => {
    const { user: authUser, role: authRole } = useAuth();
    console.log({ authRole })
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        status: '',
        sort_by: 'created_at',
        sort_order: 'desc',
    });

    const statusModal = useModal(false);
    const roleModal = useModal(false);
    const deleteModal = useModal(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: filters,
    });

    const searchValue = watch('search');
    const roleValue = watch('role');
    const statusValue = watch('status');

    useEffect(() => {
        if (roleValue !== filters.role) {
            setFilters(prev => ({ ...prev, role: roleValue }));
            setPage(1);
        }
    }, [roleValue, filters.role]);

    useEffect(() => {
        if (statusValue !== filters.status) {
            setFilters(prev => ({ ...prev, status: statusValue }));
            setPage(1);
        }
    }, [statusValue, filters.status]);

    const activeFilters = useMemo(() => ({
        search: filters.search,
        role: filters.role,
        status: filters.status,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        page,
        per_page: 15,
    }), [filters, page]);

    const { data, isLoading, isError, error } = useUsers(activeFilters);
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUser();
    const { mutate: assignRole, isPending: isAssigningRole } = useAssignRole();

    const users = data?.data || [];
    const meta = data?.meta || {};
    const links = data?.links || [];

    /**
     * Determines whether the current auth user can perform privileged
     * actions (change status, assign role, delete) on a given target user.
     *
     * Two conditions must both be true:
     *   1. The current user holds the "super_admin" role.
     *   2. The current user is not the target user (no self-mutation).
     */
    const canActOnUser = useCallback(
        (targetUser) => authRole === 'super_admin' && authUser?.id !== targetUser?.id,
        [authRole, authUser?.id],
    );

    const roleOptions = [
        { value: '', text: 'All Roles' },
        { value: 'super_admin', text: 'Super Admin' },
        { value: 'admin', text: 'Admin' },
        { value: 'vendor', text: 'Vendor' },
        { value: 'user', text: 'User' },
    ];

    const statusOptions = [
        { value: '', text: 'All Statuses' },
        { value: 'pending', text: 'Pending' },
        { value: 'active', text: 'Active' },
        { value: 'inactive', text: 'Inactive' },
        { value: 'suspended', text: 'Suspended' },
        { value: 'deactivated', text: 'Deactivated' },
        { value: 'banned', text: 'Banned' },
        { value: 'online', text: 'Online' },
    ];

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

    const handleSearchSubmit = (data) => {
        setFilters(prev => ({ ...prev, search: data.search }));
        setPage(1);
    };

    const handleClearFilters = () => {
        setValue('search', '');
        setValue('role', '');
        setValue('status', '');
        setFilters({
            search: '',
            role: '',
            status: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        });
        setPage(1);
    };

    // Guard: only open privileged modals when the current user is permitted
    const handleChangeStatus = (user) => {
        if (!canActOnUser(user)) return;
        setSelectedUser(user);
        statusModal.openModal();
    };

    const handleAssignRole = (user) => {
        if (!canActOnUser(user)) return;
        setSelectedUser(user);
        roleModal.openModal();
    };

    const handleDeleteUser = (user) => {
        if (!canActOnUser(user)) return;
        setSelectedUser(user);
        deleteModal.openModal();
    };

    const handleStatusUpdate = useCallback((newStatus) => {
        if (!selectedUser) return;
        updateStatus({ userId: selectedUser.id, status: newStatus }, {
            onSuccess: () => {
                statusModal.closeModal();
                setSelectedUser(null);
            },
        });
    }, [selectedUser, updateStatus, statusModal]);

    const handleRoleAssign = useCallback((data) => {
        if (!selectedUser) return;
        assignRole({ userId: selectedUser.id, role: data.role, roles: data.roles }, {
            onSuccess: () => {
                roleModal.closeModal();
                setSelectedUser(null);
            },
        });
    }, [selectedUser, assignRole, roleModal]);

    const confirmDelete = (userId) => {
        deleteUser(userId, {
            onSuccess: () => {
                deleteModal.closeModal();
                setSelectedUser(null);
            },
        });
    };

    const handlePageChange = (newPage) => {
        setPage(parseInt(newPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                    {(filters.search || filters.role || filters.status) && (
                        <Button
                            variant="outline"
                            color="gray"
                            size="sm"
                            onClick={handleClearFilters}
                            className="ml-auto"
                        >
                            Clear All
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit(handleSearchSubmit)} className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <InputForm
                                name="search"
                                type="text"
                                register={register}
                                error={errors.search?.message}
                                placeholder="Search by name or email..."
                            />
                        </div>
                        <Button
                            type="submit"
                            color="green"
                            size="md"
                            startIcon={<Search className="w-4 h-4" />}
                        >
                            Search
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SingleSelectForm
                            name="role"
                            placeholder="Filter by role"
                            options={roleOptions}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={roleValue}
                        />
                        <SingleSelectForm
                            name="status"
                            placeholder="Filter by status"
                            options={statusOptions}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={statusValue}
                        />
                    </div>
                </form>

                {(filters.search || filters.role || filters.status) && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {filters.search && (
                            <TextBadge variant="light" color="blue" size="sm">
                                Search: {truncateText(filters.search, 20)}
                            </TextBadge>
                        )}
                        {filters.role && (
                            <TextBadge variant="light" color="purple" size="sm">
                                Role: {roleOptions.find(r => r.value === filters.role)?.text}
                            </TextBadge>
                        )}
                        {filters.status && (
                            <TextBadge variant="light" color={getStatusColor(filters.status)} size="sm">
                                Status: {statusOptions.find(s => s.value === filters.status)?.text}
                            </TextBadge>
                        )}
                    </div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading && <UserListSkeleton />}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Users</h3>
                        <p className="text-sm text-gray-600 text-center max-w-md">
                            {error?.response?.data?.message || 'An error occurred while fetching users'}
                        </p>
                    </div>
                )}

                {!isLoading && !isError && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                        <p className="text-sm text-gray-600 text-center max-w-md mb-4">
                            {filters.search || filters.role || filters.status
                                ? 'No users match your current filters. Try adjusting your search criteria.'
                                : 'Get started by adding your first user to the system.'}
                        </p>
                        {(filters.search || filters.role || filters.status) && (
                            <Button variant="outline" color="gray" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}

                {!isLoading && !isError && users.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => {
                                        const permitted = canActOnUser(user); // derived once per row

                                        return (
                                            <TableRow key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            src={user.avatar}
                                                            initials={user.initials}
                                                            size="md"
                                                            showProfileStatus
                                                            isProfileCompleted={user.profile_completed}
                                                        />
                                                        <div>
                                                            <Link
                                                                href={`/dashboard/users/${user.id}`}
                                                                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                                                            >
                                                                {user.full_name}
                                                            </Link>
                                                            <a
                                                                href={`mailto:${user.email}`}
                                                                className="block text-xs text-gray-500 hover:text-blue-600 transition-colors"
                                                            >
                                                                {user.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        {user.phone_number && (
                                                            <a
                                                                href={`tel:${user.phone_number}`}
                                                                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                                                            >
                                                                <Phone className="w-3 h-3" />
                                                                {user.phone_number}
                                                            </a>
                                                        )}
                                                        {user.city && user.state && (
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                                <Building2 className="w-3 h-3" />
                                                                {user.city}, {user.state}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <RoleBadge role={user.roles?.[0] || 'user'} size="sm" />
                                                </TableCell>

                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <TextBadge
                                                        variant="light"
                                                        color={getStatusColor(user.status)}
                                                        size="sm"
                                                        className="capitalize"
                                                    >
                                                        {user.status}
                                                    </TextBadge>
                                                </TableCell>

                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-300 ${user.completion_percent >= 100
                                                                    ? 'bg-green-500'
                                                                    : user.completion_percent >= 50
                                                                        ? 'bg-blue-500'
                                                                        : 'bg-orange-500'
                                                                    }`}
                                                                style={{ width: `${user.completion_percent}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-600">
                                                            {user.completion_percent}%
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(user.created_at)}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* View: always visible to all admins */}
                                                        <IconBadge
                                                            variant="light"
                                                            color="blue"
                                                            size="sm"
                                                            shape="circle"
                                                            icon={<Eye className="w-4 h-4" />}
                                                            href={`/dashboard/users/${user.id}`}
                                                            ariaLabel="View user"
                                                        />

                                                        {/* Change status: super_admin only, not self */}
                                                        <IconBadge
                                                            variant="light"
                                                            color="green"
                                                            size="sm"
                                                            shape="circle"
                                                            icon={<Activity className="w-4 h-4" />}
                                                            onClick={() => handleChangeStatus(user)}
                                                            disabled={!permitted || isUpdatingStatus}
                                                            ariaLabel="Change status"
                                                            title={!permitted ? 'Insufficient permissions' : 'Change status'}
                                                        />

                                                        {/* Assign role: super_admin only, not self */}
                                                        <IconBadge
                                                            variant="light"
                                                            color="purple"
                                                            size="sm"
                                                            shape="circle"
                                                            icon={<Shield className="w-4 h-4" />}
                                                            onClick={() => handleAssignRole(user)}
                                                            disabled={!permitted || isAssigningRole}
                                                            ariaLabel="Assign role"
                                                            title={!permitted ? 'Insufficient permissions' : 'Assign role'}
                                                        />

                                                        {/* Delete: super_admin only, not self */}
                                                        <IconBadge
                                                            variant="light"
                                                            color="red"
                                                            size="sm"
                                                            shape="circle"
                                                            icon={<Trash2 className="w-4 h-4" />}
                                                            onClick={() => handleDeleteUser(user)}
                                                            disabled={!permitted || isDeleting}
                                                            ariaLabel="Delete user"
                                                            title={!permitted ? 'Insufficient permissions' : 'Delete user'}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {meta.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <Paginator
                                    paginationData={meta}
                                    links={links}
                                    setPage={handlePageChange}
                                    limit={3}
                                />
                            </div>
                        )}
                    </>
                )
                }
            </div >

            <ChangeStatusModal
                isOpen={statusModal.isOpen}
                onClose={statusModal.closeModal}
                user={selectedUser}
                onConfirm={handleStatusUpdate}
                isLoading={isUpdatingStatus}
            />

            <AssignRoleModal
                isOpen={roleModal.isOpen}
                onClose={roleModal.closeModal}
                user={selectedUser}
                onConfirm={handleRoleAssign}
                isLoading={isAssigningRole}
            />

            <DeleteUserModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                user={selectedUser}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div >
    );
};

export default AdminUserList;