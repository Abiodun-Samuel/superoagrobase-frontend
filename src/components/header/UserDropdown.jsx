import { useState } from "react";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownItem } from "../dropdown/DropdownItem";
import { useLogout } from "@/queries/auth.query";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import RoleBadge from "@/components/ui/RoleBadge";
import useAuth from "@/hooks/useAuth";
import { ChevronDown, HomeIcon, LayoutDashboardIcon, LogOutIcon, Package2, User2Icon } from "lucide-react";


export default function UserDropdown() {
  const { user, role } = useAuth();

  const { mutate, isPending } = useLogout();

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <Avatar
          size="sm" src={user?.avatar || ''} initials={user?.initials || ''}
          isProfileCompleted={user?.profile_completed}
          showProfileStatus
        />
        <span className="block mr-1 font-medium text-theme-sm">
          {user?.first_name}
        </span>
        <ChevronDown size={15} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={toggleDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="flex items-start gap-2 font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.first_name} {user?.last_name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <RoleBadge role={role} size="sm" showIcon />
          </div>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={toggleDropdown}
              tag="a"
              to='/'
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <HomeIcon size={20} />
              Home
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={toggleDropdown}
              tag="a"
              to='/account/products'
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Package2 size={20} />
              My Products
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={toggleDropdown}
              tag="a"
              to='/dashboard'
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <LayoutDashboardIcon size={20} />
              Dashboard
            </DropdownItem>
          </li>
        </ul>

        <Button
          loading={isPending}
          onClick={mutate}
          className="mt-3"
          variant="ghost"
          startIcon={<LogOutIcon width={18} height={18} />}
        >
          Sign out
        </Button>
      </Dropdown>
    </div>
  );
}