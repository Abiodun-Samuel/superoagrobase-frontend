import Avatar from '@/components/ui/Avatar';
import RoleBadge from '@/components/ui/RoleBadge';
import Toast from '@/lib/toastify';
import { useUpdateAvatar } from '@/queries/profile.query';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const ProfileHeader = ({ user, role }) => {
    const { mutateAsync, isPending } = useUpdateAvatar();

    const handleUpdateAvatar = async (avatar) => {
        try {
            await mutateAsync({ avatar });
        } catch (error) { }
    };

    if (!user) return null;

    const getCompletionStatus = (percent) => {
        if (percent >= 80) return { color: 'emerald', label: 'Excellent', icon: CheckCircle2 };
        if (percent >= 50) return { color: 'amber', label: 'Good', icon: AlertCircle };
        return { color: 'rose', label: 'Needs Attention', icon: AlertCircle };
    };

    const completionStatus = getCompletionStatus(user.completion_percent);
    const StatusIcon = completionStatus.icon;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Main Content */}
            <div className="px-6 py-6 sm:px-8">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <Avatar
                            onError={(error) => Toast.error(error)}
                            src={user.avatar}
                            alt={user.full_name}
                            name={user.initials}
                            size="3xl"
                            onUpload={handleUpdateAvatar}
                            loading={isPending}
                            showProfileStatus
                            isProfileCompleted={user.profile_completed}
                        />
                    </div>

                    {/* User Details */}
                    <div className="flex-1 space-y-3.5 text-center sm:text-left">
                        {/* Name and Role */}
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {user.full_name}
                            </h1>
                            <div className="flex items-center justify-center sm:justify-start">
                                <RoleBadge role={role} size="sm" showIcon />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2">
                            <ContactItem icon={Mail} text={user.email} />
                            <ContactItem icon={Phone} text={user.phone_number} />
                            <ContactItem
                                icon={MapPin}
                                text={`${user.city}, ${user.state}, ${user.country}`}
                            />
                        </div>
                    </div>

                    {/* Completion Stats (Desktop) */}
                    <div className="hidden sm:flex flex-col items-center justify-center px-6 py-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-1.5 mb-1">
                            <StatusIcon size={16} className={`text-${completionStatus.color}-600`} />
                            <span className="text-xs font-medium text-gray-600">
                                Profile
                            </span>
                        </div>
                        <span className="text-3xl font-bold text-gray-900">
                            {user.completion_percent}%
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 bg-${completionStatus.color}-100 text-${completionStatus.color}-700`}>
                            {completionStatus.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Bar Section */}
            <div className="px-6 py-3.5 sm:px-8 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                            Profile Completion
                        </span>
                        <StatusIcon
                            size={15}
                            className={`text-${completionStatus.color}-600 sm:hidden`}
                        />
                    </div>
                    <div className="flex items-center gap-2 sm:hidden">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${completionStatus.color}-100 text-${completionStatus.color}-700`}>
                            {completionStatus.label}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                            {user.completion_percent}%
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
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
    );
};

// Contact Item Component
const ContactItem = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2.5 justify-center sm:justify-start group">
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
            <Icon size={15} className="text-gray-600 group-hover:text-emerald-600 transition-colors" />
        </div>
        <span className="text-sm text-gray-700">{text}</span>
    </div>
);

export default ProfileHeader;