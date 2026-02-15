'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
    Store,
    Search,
    Filter,
    Eye,
    Trash2,
    Phone,
    Calendar,
    Building2,
    Shield,
    Activity,
    Package,
    ShoppingBag,
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
import ChangeStatusModal from '../users/ChangeStatusModal';
import AssignRoleModal from '../users/AssignRoleModal';
import DeleteUserModal from '../users/DeleteUserModal';
import { formatDate, truncateText } from '@/utils/helper';
import { useModal } from '@/hooks/useModal';
import UserListSkeleton from '../users/UserListSkeleton';

const AdminVendorList = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        role: 'vendor', // Default to vendor role
        status: '',
        sort_by: 'created_at',
        sort_order: 'desc',
    });

    // Modal states
    const statusModal = useModal(false);
    const roleModal = useModal(false);
    const deleteModal = useModal(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form for filters
    const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: filters,
    });

    // Watch form values
    const searchValue = watch('search');
    const statusValue = watch('status');

    // Update filters when status changes
    useEffect(() => {
        if (statusValue !== filters.status) {
            setFilters(prev => ({ ...prev, status: statusValue }));
            setPage(1);
        }
    }, [statusValue, filters.status]);

    // Active filters for API
    const activeFilters = useMemo(() => ({
        search: filters.search,
        role: filters.role,
        status: filters.status,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        page,
        per_page: 15,
    }), [filters, page]);

    // Fetch users with filters
    const { data, isLoading, isError, error } = useUsers(activeFilters);
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUser();
    const { mutate: assignRole, isPending: isAssigningRole } = useAssignRole();

    const users = data?.data || [];
    const meta = data?.meta || {};
    const links = data?.links || [];

    // Status options
    const statusOptions = [
        { value: '', text: 'All Statuses' },
        { value: 'pending', text: 'Pending Approval' },
        { value: 'active', text: 'Active Vendors' },
        { value: 'inactive', text: 'Inactive' },
        { value: 'suspended', text: 'Suspended' },
        { value: 'deactivated', text: 'Deactivated' },
        { value: 'banned', text: 'Banned' },
    ];

    // Status color mapping
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

    // Handle search form submit
    const handleSearchSubmit = (data) => {
        setFilters(prev => ({
            ...prev,
            search: data.search,
        }));
        setPage(1);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setValue('search', '');
        setValue('status', '');
        setFilters({
            search: '',
            role: 'vendor',
            status: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        });
        setPage(1);
    };

    // Handle change status
    const handleChangeStatus = (user) => {
        setSelectedUser(user);
        statusModal.openModal();
    };

    // Handle assign role
    const handleAssignRole = (user) => {
        setSelectedUser(user);
        roleModal.openModal();
    };

    // Handle delete user
    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        deleteModal.openModal();
    };

    // Confirm status update
    const handleStatusUpdate = useCallback((newStatus) => {
        if (!selectedUser) return;

        updateStatus({
            userId: selectedUser.id,
            status: newStatus,
        }, {
            onSuccess: () => {
                statusModal.closeModal();
                setSelectedUser(null);
            },
        });
    }, [selectedUser, updateStatus, statusModal]);

    // Confirm role assignment
    const handleRoleAssign = useCallback((data) => {
        if (!selectedUser) return;

        assignRole({
            userId: selectedUser.id,
            role: data.role,
            roles: data.roles,
        }, {
            onSuccess: () => {
                roleModal.closeModal();
                setSelectedUser(null);
            },
        });
    }, [selectedUser, assignRole, roleModal]);

    // Confirm delete
    const confirmDelete = (userId) => {
        deleteUser(userId, {
            onSuccess: () => {
                deleteModal.closeModal();
                setSelectedUser(null);
            },
        });
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(parseInt(newPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Check if user has vendor role
    const hasVendorRole = (roles) => {
        return roles?.some(role => role.toLowerCase() === 'vendor');
    };

    return (
        <div className="space-y-6">
            {/* Vendor-Specific Header Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Store className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-gray-900">Vendor Management</h1>
                        <p className="text-sm text-gray-600">
                            Manage vendor accounts, permissions, and product listings
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{meta.total || 0}</p>
                            <p className="text-xs text-gray-600">Total Vendors</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-green-600" />
                    <h2 className="text-base font-semibold text-gray-900">Filter Vendors</h2>
                    {(filters.search || filters.status) && (
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
                    {/* Search Input */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <InputForm
                                name="search"
                                type="text"
                                register={register}
                                error={errors.search?.message}
                                placeholder="Search vendors by name, email, or company..."
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

                    {/* Status Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SingleSelectForm
                            name="status"
                            placeholder="Filter by vendor status"
                            options={statusOptions}
                            register={register}
                            setValue={setValue}
                            searchable={false}
                            defaultValue={statusValue}
                        />
                    </div>
                </form>

                {/* Active Filters Summary */}
                {(filters.search || filters.status) && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {filters.search && (
                            <TextBadge variant="light" color="blue" size="sm">
                                Search: {truncateText(filters.search, 20)}
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

            {/* Vendors Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Loading State */}
                {isLoading && <UserListSkeleton />}

                {/* Error State */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <Store className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Vendors</h3>
                        <p className="text-sm text-gray-600 text-center max-w-md">
                            {error?.response?.data?.message || 'An error occurred while fetching vendor accounts'}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <Store className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vendors Found</h3>
                        <p className="text-sm text-gray-600 text-center max-w-md mb-4">
                            {filters.search || filters.status
                                ? 'No vendors match your current filters. Try adjusting your search criteria.'
                                : 'No vendor accounts have been created yet. Vendors will appear here once they register.'}
                        </p>
                        {(filters.search || filters.status) && (
                            <Button variant="outline" color="gray" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}

                {/* Table */}
                {!isLoading && !isError && users.length > 0 && (
                    <>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                                <TableHeader className="bg-green-50">
                                    <TableRow>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                                            Vendor
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                                            Company
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                                            Roles
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                                            Status
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                                            Products
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                                            Joined
                                        </TableCell>
                                        <TableCell isHeader className="px-6 py-3 text-right text-xs font-medium text-green-800 uppercase tracking-wider">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-green-50/30 transition-colors duration-150">
                                            {/* Vendor Info */}
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Avatar
                                                            src={user.avatar}
                                                            initials={user.initials}
                                                            size="md"
                                                            showProfileStatus
                                                            isProfileCompleted={user.profile_completed}
                                                        />
                                                        {hasVendorRole(user.roles) && (
                                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                <Store className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/dashboard/users/${user.id}`}
                                                            className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors duration-200"
                                                        >
                                                            {user.full_name}
                                                        </Link>
                                                        <a
                                                            href={`mailto:${user.email}`}
                                                            className="block text-xs text-gray-500 hover:text-green-600 transition-colors"
                                                        >
                                                            {user.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Company Info */}
                                            <TableCell className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {user.company?.name ? (
                                                        <>
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-900">
                                                                <Building2 className="w-3 h-3 text-green-600" />
                                                                {truncateText(user.company.name, 25)}
                                                            </div>
                                                            {user.company?.phone && (
                                                                <a
                                                                    href={`tel:${user.company.phone}`}
                                                                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-green-600 transition-colors"
                                                                >
                                                                    <Phone className="w-3 h-3" />
                                                                    {user.company.phone}
                                                                </a>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">No company info</span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* All Roles */}
                                            <TableCell className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {user.roles && user.roles.length > 0 ? (
                                                        user.roles.map((role, index) => (
                                                            <RoleBadge key={index} role={role} size="sm" />
                                                        ))
                                                    ) : (
                                                        <RoleBadge role="user" size="sm" />
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Status */}
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

                                            {/* Products Link */}
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <TextBadge
                                                    variant="light"
                                                    color="green"
                                                    size="sm"
                                                    href={`/account/products?vendor_id=${user.id}`}
                                                    startIcon={<Package className="w-3.5 h-3.5" />}
                                                    className="cursor-pointer hover:scale-105 transition-transform"
                                                >
                                                    View Products
                                                </TextBadge>
                                            </TableCell>

                                            {/* Joined Date */}
                                            <TableCell className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(user.created_at)}
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <IconBadge
                                                        variant="light"
                                                        color="blue"
                                                        size="sm"
                                                        shape="circle"
                                                        icon={<Eye className="w-4 h-4" />}
                                                        href={`/dashboard/users/${user.id}`}
                                                        ariaLabel="View vendor details"
                                                    />
                                                    <IconBadge
                                                        variant="light"
                                                        color="green"
                                                        size="sm"
                                                        shape="circle"
                                                        icon={<Activity className="w-4 h-4" />}
                                                        onClick={() => handleChangeStatus(user)}
                                                        disabled={isUpdatingStatus}
                                                        ariaLabel="Change vendor status"
                                                    />
                                                    <IconBadge
                                                        variant="light"
                                                        color="purple"
                                                        size="sm"
                                                        shape="circle"
                                                        icon={<Shield className="w-4 h-4" />}
                                                        onClick={() => handleAssignRole(user)}
                                                        disabled={isAssigningRole}
                                                        ariaLabel="Assign vendor role"
                                                    />
                                                    <IconBadge
                                                        variant="light"
                                                        color="red"
                                                        size="sm"
                                                        shape="circle"
                                                        icon={<Trash2 className="w-4 h-4" />}
                                                        onClick={() => handleDeleteUser(user)}
                                                        disabled={isDeleting}
                                                        ariaLabel="Delete vendor"
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {meta.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-green-50/30">
                                <Paginator
                                    paginationData={meta}
                                    links={links}
                                    setPage={handlePageChange}
                                    limit={3}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Change Status Modal */}
            <ChangeStatusModal
                isOpen={statusModal.isOpen}
                onClose={statusModal.closeModal}
                user={selectedUser}
                onConfirm={handleStatusUpdate}
                isLoading={isUpdatingStatus}
            />

            {/* Assign Role Modal */}
            <AssignRoleModal
                isOpen={roleModal.isOpen}
                onClose={roleModal.closeModal}
                user={selectedUser}
                onConfirm={handleRoleAssign}
                isLoading={isAssigningRole}
            />

            {/* Delete User Modal */}
            <DeleteUserModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                user={selectedUser}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default AdminVendorList;