// components/profile/PreferencesSection.jsx
import { Edit2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import IconBadge from '@/components/ui/IconBadge';
import TextBadge from '@/components/ui/TextBadge';
import SwitchForm from '@/components/form/SwitchForm';
import Button from '@/components/ui/Button';
import { useModal } from '@/hooks/useModal';
import { useUpdatePreferences } from '@/queries/profile.query';
import ModalForm from '@/components/modal/ModalForm';
import { preferencesSchema } from '@/validation/schema';

// ============================================
// EDIT FORM COMPONENT
// ============================================
const PreferencesForm = ({ user, onSuccess, onCancel }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(preferencesSchema),
        defaultValues: {
            is_marketing_subscribed: user?.is_marketing_subscribed || false,
        },
    });

    const { mutate: updatePreferences, isPending } = useUpdatePreferences();

    const onSubmit = (data) => {
        updatePreferences(data, {
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
            <SwitchForm
                label="Marketing Emails"
                name="is_marketing_subscribed"
                control={control}
                error={errors.is_marketing_subscribed?.message}
                description="Receive updates about new products, features, and special offers"
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
const PreferencesSection = ({ user }) => {
    const { isOpen, openModal, closeModal } = useModal();

    if (!user) return null;

    return (
        <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                    <IconBadge
                        icon={<Edit2 size={16} />}
                        variant="light"
                        color="green"
                        size="md"
                        onClick={openModal}
                        ariaLabel="Edit preferences"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Marketing Emails</span>
                    <TextBadge
                        variant="solid"
                        color={user.is_marketing_subscribed ? 'green' : 'gray'}
                        size="sm"
                    >
                        {user.is_marketing_subscribed ? 'Subscribed' : 'Unsubscribed'}
                    </TextBadge>
                </div>
            </div>

            <ModalForm
                isOpen={isOpen}
                onClose={closeModal}
                title="Edit Preferences"
                description="Manage your communication preferences"
            >
                <PreferencesForm user={user} onSuccess={closeModal} onCancel={closeModal} />
            </ModalForm>
        </>
    );
};

export default PreferencesSection;