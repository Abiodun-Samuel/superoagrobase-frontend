// components/profile/BasicInfoSection.jsx
import { Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import IconBadge from '@/components/ui/IconBadge';
import InputForm from '@/components/form/InputForm';
import Button from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { useUpdateBasicInfo } from '@/queries/profile.query';
import ModalForm from '@/components/modal/ModalForm';
import { basicInfoSchema } from '@/validation/schema';

// ============================================
// INFO ROW COMPONENT
// ============================================
const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        <span className="text-sm font-medium text-gray-600 w-full sm:w-40">{label}</span>
        <span className="text-sm text-gray-900 font-medium">{value || 'Not provided'}</span>
    </div>
);

// ============================================
// EDIT FORM COMPONENT
// ============================================
const BasicInfoForm = ({ user, onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(basicInfoSchema),
        defaultValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            email: user?.email || '',
            phone_number: user?.phone_number || '',
        },
    });

    const { mutate: updateBasicInfo, isPending } = useUpdateBasicInfo();

    const onSubmit = (data) => {
        updateBasicInfo(data, {
            onSuccess: () => {
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        reset();
        onCancel?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputForm
                    label="First Name"
                    name="first_name"
                    register={register}
                    error={errors.first_name?.message}
                    required
                    placeholder="Enter your first name"
                    disabled={isPending}
                />

                <InputForm
                    label="Last Name"
                    name="last_name"
                    register={register}
                    error={errors.last_name?.message}
                    required
                    placeholder="Enter your last name"
                    disabled={isPending}
                />
            </div>

            <InputForm
                label="Email Address"
                name="email"
                type="email"
                register={register}
                error={errors.email?.message}
                required
                placeholder="Enter your email"
                disabled={isPending}
            />

            <InputForm
                label="Phone Number"
                name="phone_number"
                type="tel"
                register={register}
                error={errors.phone_number?.message}
                required
                placeholder="Enter your phone number"
                disabled={isPending}
            />

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                    type="button"
                    variant="outline"
                    color="gray"
                    onClick={handleCancel}
                    disabled={isPending}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="solid"
                    color="green"
                    loading={isPending}
                    className="flex-1"
                >
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

// ============================================
// MAIN SECTION COMPONENT
// ============================================
const BasicInfoSection = ({ user }) => {
    const { isOpen, openModal, closeModal } = useModal();

    if (!user) return null;

    return (
        <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                    <IconBadge
                        icon={<Edit2 size={16} />}
                        variant="light"
                        color="green"
                        size="md"
                        onClick={openModal}
                        ariaLabel="Edit basic information"
                    />
                </div>

                <div className="space-y-3">
                    <InfoRow label="First Name" value={user.first_name} />
                    <InfoRow label="Last Name" value={user.last_name} />
                    <InfoRow label="Email" value={user.email} />
                    <InfoRow label="Phone Number" value={user.phone_number} />
                </div>
            </div>

            <ModalForm
                isOpen={isOpen}
                onClose={closeModal}
                title="Edit Basic Information"
                description="Update your basic profile information"
            >
                <BasicInfoForm user={user} onSuccess={closeModal} onCancel={closeModal} />
            </ModalForm>
        </>
    );
};

export default BasicInfoSection;