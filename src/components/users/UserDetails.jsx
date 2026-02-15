'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building2,
    Shield,
    Activity,
    User,
    CheckCircle2,
    Clock,
    Globe,
    Edit2,
    UserCog,
    AlertCircle,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import IconBadge from '@/components/ui/IconBadge';
import RoleBadge from '@/components/ui/RoleBadge';
import TextBadge from '@/components/ui/TextBadge';
import { formatDate } from '@/utils/helper';
import { useUser, useUpdateUser, useAssignRole } from '@/queries/user.query';
import { useModal } from '@/hooks/useModal';
import ChangeStatusModal from './ChangeStatusModal';
import AssignRoleModal from './AssignRoleModal';
import { UserDetailsSkeleton } from '../skeletonloader';

const UserDetails = ({ id }) => {
    const router = useRouter();
    const { data: user, isLoading, isError } = useUser(id);

    // Modal states
    const { isOpen: isStatusModalOpen, openModal: openStatusModal, closeModal: closeStatusModal } = useModal(false);
    const { isOpen: isRoleModalOpen, openModal: openRoleModal, closeModal: closeRoleModal } = useModal(false);

    // Mutations
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUser();
    const { mutate: assignRole, isPending: isAssigningRole } = useAssignRole();

    const handleStatusUpdate = useCallback((newStatus) => {
        updateStatus({
            userId: user.id,
            status: newStatus,
        }, {
            onSuccess: () => {
                closeStatusModal();
            }
        });
    }, [user?.id, updateStatus, closeStatusModal]);

    const handleRoleAssign = useCallback((data) => {
        assignRole({
            userId: user.id,
            role: data.role,
            roles: data.roles,
        }, {
            onSuccess: () => {
                closeRoleModal();
            }
        });
    }, [user?.id, assignRole, closeRoleModal]);

    // Loading State
    if (isLoading) {
        return <UserDetailsSkeleton />;
    }

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

    const getCompletionStatus = (percent) => {
        if (percent >= 80) return { color: 'emerald', label: 'Excellent', icon: CheckCircle2 };
        if (percent >= 50) return { color: 'amber', label: 'Good', icon: AlertCircle };
        return { color: 'rose', label: 'Needs Attention', icon: AlertCircle };
    };

    // Error/Not Found State
    if (isError || !user) {
        return (
            <div className="min-h-[400px] bg-white dark:bg-gray-900 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    {/* Icon Container */}
                    <div className="relative mb-8">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow">
                            <User className="w-10 h-10 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-2 -right-2 w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full blur-2xl opacity-60" />
                        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-2xl opacity-60" />
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                User Not Found
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                The user you're looking for doesn't exist or may have been removed from the system.
                            </p>
                        </div>


                        {/* Action Button */}
                        <div className="pt-2">
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                color="gray"
                                className="w-full sm:w-auto"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const completionStatus = getCompletionStatus(user.completion_percent);
    const StatusIcon = completionStatus.icon;

    return (
        <>
            <div className=" bg-gray-50 dark:bg-gray-900 space-y-10 my-10">
                <div className="mx-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
                        {/* Back Button Bar */}
                        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <TextBadge color='green' onClick={() => router.back()} startIcon={<ArrowLeft />}>Go Back</TextBadge>
                        </div>

                        {/* Main Content */}
                        <div className="px-6 py-6 sm:px-8">
                            <div className="flex flex-col sm:flex-row gap-5 items-start">
                                {/* Avatar */}
                                <div className="flex-shrink-0 mx-auto sm:mx-0">
                                    <Avatar
                                        src={user.avatar}
                                        initials={user.initials}
                                        size="3xl"
                                        showProfileStatus
                                        isProfileCompleted={user.profile_completed}
                                    />
                                </div>

                                {/* User Details */}
                                <div className="flex-1 space-y-3.5 text-center sm:text-left">
                                    {/* Name and Role */}
                                    <div className="space-y-1.5">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                            {user.full_name}
                                        </h1>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                            <RoleBadge role={user.roles?.[0] || 'user'} size="sm" showIcon />
                                            <TextBadge
                                                variant="light"
                                                color={getStatusColor(user?.status)}
                                                size="sm"
                                                className="capitalize"
                                            >
                                                {user.status}
                                            </TextBadge>
                                            {user.profile_completed && (
                                                <TextBadge startIcon={<CheckCircle2 />} variant="light" color="green" size="sm">
                                                    Complete
                                                </TextBadge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-2">
                                        <ContactItem icon={Mail} text={user.email} />
                                        {user.phone_number && (
                                            <ContactItem icon={Phone} text={user.phone_number} />
                                        )}
                                        {(user.city || user.state || user.country) && (
                                            <ContactItem
                                                icon={MapPin}
                                                text={[user.city, user.state, user.country]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons & Stats */}
                                <div className="flex flex-col gap-3 items-center sm:items-end">
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <IconBadge
                                            icon={<Edit2 className="w-4 h-4" />}
                                            size="md"
                                            variant="light"
                                            color="blue"
                                            onClick={openStatusModal}
                                            ariaLabel="Change status"
                                        />
                                        <IconBadge
                                            icon={<UserCog className="w-4 h-4" />}
                                            size="md"
                                            variant="light"
                                            color="purple"
                                            onClick={openRoleModal}
                                            ariaLabel="Assign role"
                                        />
                                    </div>

                                    {/* Completion Stats (Desktop) */}
                                    <div className="hidden sm:flex flex-col items-center justify-center px-6 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <StatusIcon size={16} className={`text-${completionStatus.color}-600`} />
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                Profile
                                            </span>
                                        </div>
                                        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                            {user.completion_percent}%
                                        </span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 bg-${completionStatus.color}-100 text-${completionStatus.color}-700 dark:bg-${completionStatus.color}-900/30 dark:text-${completionStatus.color}-400`}>
                                            {completionStatus.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar Section */}
                        <div className="px-6 py-3.5 sm:px-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Profile Completion
                                    </span>
                                    <StatusIcon
                                        size={15}
                                        className={`text-${completionStatus.color}-600 sm:hidden`}
                                    />
                                </div>
                                <div className="flex items-center gap-2 sm:hidden">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${completionStatus.color}-100 text-${completionStatus.color}-700 dark:bg-${completionStatus.color}-900/30 dark:text-${completionStatus.color}-400`}>
                                        {completionStatus.label}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {user.completion_percent}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${completionStatus.color === 'emerald'
                                        ? 'from-emerald-500 to-green-600'
                                        : completionStatus.color === 'amber'
                                            ? 'from-amber-500 to-orange-600'
                                            : 'from-rose-500 to-red-600'
                                        }`}
                                    style={{ width: `${user.completion_percent}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                Contact Information
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                        <a
                                            href={`mailto:${user.email}`}
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {user.email}
                                        </a>
                                    </div>
                                </div>

                                {user.phone_number && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                                            <a
                                                href={`tel:${user.phone_number}`}
                                                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {user.phone_number}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" />
                                Location
                            </h2>
                            <div className="space-y-4">
                                {user.address && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Address</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">{user.address}</p>
                                        </div>
                                    </div>
                                )}

                                {(user.city || user.state) && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">City & State</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {user.city}{user.city && user.state ? ', ' : ''}{user.state}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {user.country && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Country</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">{user.country}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-600" />
                                Account Information
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Joined</p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {formatDate(user.created_at, 'long')}
                                        </p>
                                    </div>
                                </div>

                                {user.last_login_at && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Login</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">{user.last_login_at}</p>
                                        </div>
                                    </div>
                                )}

                                {user.auth_provider && (
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Auth Provider</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                                                {user.auth_provider}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-orange-600" />
                                Personal Information
                            </h2>
                            <div className="space-y-4">
                                {user.date_of_birth && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                {formatDate(user.date_of_birth)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {user.gender && (
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gender</p>
                                            <p className="text-sm text-gray-900 dark:text-gray-100">{user.gender}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Company Information (if available) */}
                    {user.company?.name && (
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                                Company Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.company.name && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {user.company.name}
                                        </p>
                                    </div>
                                )}
                                {user.company.email && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Email</p>
                                        <a
                                            href={`mailto:${user.company.email}`}
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {user.company.email}
                                        </a>
                                    </div>
                                )}
                                {user.company.phone && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Phone</p>
                                        <a
                                            href={`tel:${user.company.phone}`}
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {user.company.phone}
                                        </a>
                                    </div>
                                )}
                                {user.company.website && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Website</p>
                                        <a
                                            href={user.company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            {user.company.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div >
                    )}
                </div >
            </div >

            {/* Modals */}
            < ChangeStatusModal
                isOpen={isStatusModalOpen}
                onClose={closeStatusModal}
                user={user}
                onConfirm={handleStatusUpdate}
                isLoading={isUpdatingStatus}
            />

            <AssignRoleModal
                isOpen={isRoleModalOpen}
                onClose={closeRoleModal}
                user={user}
                onConfirm={handleRoleAssign}
                isLoading={isAssigningRole}
            />
        </>
    );
};

// Contact Item Component (matching ProfileHeader style)
const ContactItem = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2.5 justify-center sm:justify-start group">
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors">
            <Icon size={15} className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
);

export default UserDetails;