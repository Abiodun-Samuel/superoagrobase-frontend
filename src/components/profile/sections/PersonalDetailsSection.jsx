// components/profile/PersonalDetailsSection.jsx
import { Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import IconBadge from '@/components/ui/IconBadge';
import RadioForm from '@/components/form/RadioForm';
import DateForm from '@/components/form/DateForm';
import Button from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { useUpdatePersonalDetails } from '@/queries/profile.query';
import ModalForm from '@/components/modal/ModalForm';
import { personalDetailsSchema } from '@/validation/schema';

// ============================================
// CONSTANTS
// ============================================
const GENDER_OPTIONS = [
    { id: 'Male', name: 'Male' },
    { id: 'Female', name: 'Female' },
    { id: 'Others', name: 'Others' },
];

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
const PersonalDetailsForm = ({ user, onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(personalDetailsSchema),
        defaultValues: {
            gender: user?.gender || '',
            date_of_birth: user?.date_of_birth || '',
        },
    });

    const { mutate: updatePersonalDetails, isPending } = useUpdatePersonalDetails();

    const onSubmit = (data) => {
        updatePersonalDetails(data, {
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
            <RadioForm
                label="Gender"
                name="gender"
                options={GENDER_OPTIONS}
                register={register}
                setValue={setValue}
                watch={watch}
                error={errors.gender?.message}
                required
                layout="horizontal"
                disabled={isPending}
            />

            <DateForm
                label="Date of Birth"
                name="date_of_birth"
                register={register}
                error={errors.date_of_birth?.message}
                required
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
const PersonalDetailsSection = ({ user }) => {
    const { isOpen, openModal, closeModal } = useModal();

    if (!user) return null;

    return (
        <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
                    <IconBadge
                        icon={<Edit2 size={16} />}
                        variant="light"
                        color="green"
                        size="md"
                        onClick={openModal}
                        ariaLabel="Edit personal details"
                    />
                </div>

                <div className="space-y-3">
                    <InfoRow label="Gender" value={user.gender} />
                    <InfoRow label="Date of Birth" value={user.date_of_birth} />
                </div>
            </div>

            <ModalForm
                isOpen={isOpen}
                onClose={closeModal}
                title="Edit Personal Details"
                description="Update your personal information"
            >
                <PersonalDetailsForm user={user} onSuccess={closeModal} onCancel={closeModal} />
            </ModalForm>
        </>
    );
};

export default PersonalDetailsSection;