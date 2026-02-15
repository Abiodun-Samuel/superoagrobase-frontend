// components/profile/AddressSection.jsx
import { Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import IconBadge from '@/components/ui/IconBadge';
import InputForm from '@/components/form/InputForm';
import Button from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { useUpdateAddress } from '@/queries/profile.query';
import ModalForm from '@/components/modal/ModalForm';
import { addressSchema } from '@/validation/schema';

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
const AddressForm = ({ user, onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(addressSchema),
        defaultValues: {
            address: user?.address || '',
            city: user?.city || '',
            state: user?.state || '',
            postal_code: user?.postal_code || '',
            country: user?.country || '',
        },
    });

    const { mutate: updateAddress, isPending } = useUpdateAddress();

    const onSubmit = (data) => {
        updateAddress(data, {
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
            <InputForm
                label="Street Address"
                name="address"
                register={register}
                error={errors.address?.message}
                required
                placeholder="Enter your street address"
                disabled={isPending}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputForm
                    label="City"
                    name="city"
                    register={register}
                    error={errors.city?.message}
                    required
                    placeholder="Enter city"
                    disabled={isPending}
                />

                <InputForm
                    label="State"
                    name="state"
                    register={register}
                    error={errors.state?.message}
                    required
                    placeholder="Enter state"
                    disabled={isPending}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputForm
                    label="Postal Code"
                    name="postal_code"
                    register={register}
                    error={errors.postal_code?.message}
                    placeholder="Enter postal code"
                    disabled={isPending}
                />

                <InputForm
                    label="Country"
                    name="country"
                    register={register}
                    error={errors.country?.message}
                    required
                    placeholder="Enter country"
                    disabled={isPending}
                />
            </div>

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
const AddressSection = ({ user }) => {
    const { isOpen, openModal, closeModal } = useModal();

    if (!user) return null;

    return (
        <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
                    <IconBadge
                        icon={<Edit2 size={16} />}
                        variant="light"
                        color="green"
                        size="md"
                        onClick={openModal}
                        ariaLabel="Edit address"
                    />
                </div>

                <div className="space-y-3">
                    <InfoRow label="Street Address" value={user.address} />
                    <InfoRow label="City" value={user.city} />
                    <InfoRow label="State" value={user.state} />
                    <InfoRow label="Postal Code" value={user.postal_code} />
                    <InfoRow label="Country" value={user.country} />
                </div>
            </div>

            <ModalForm
                isOpen={isOpen}
                onClose={closeModal}
                title="Edit Address"
                description="Update your address information"
            >
                <AddressForm user={user} onSuccess={closeModal} onCancel={closeModal} />
            </ModalForm>
        </>
    );
};

export default AddressSection;