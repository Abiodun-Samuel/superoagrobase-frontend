'use client';

import useAuth from '@/hooks/useAuth';
import ProfileHeader from './sections/ProfileHeader';
import AddressSection from './sections/AddressSection';
import BasicInfoSection from './sections/BasicInfoSection';
import PreferencesSection from './sections/PreferencesSection';
import PersonalDetailsSection from './sections/PersonalDetailsSection';

const UserProfile = () => {
  const { user, role } = useAuth();


  return (
    <div className="bg-gray-50 space-y-10 my-10">
      <ProfileHeader user={user} role={role} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicInfoSection user={user} />
        <PersonalDetailsSection user={user} />
        <AddressSection user={user} />
        <PreferencesSection user={user} />
      </div>
    </div>
  );
};

export default UserProfile;