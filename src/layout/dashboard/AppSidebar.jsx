"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../context/SidebarContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  FolderTree,
  Layers,
  FileText,
  ChevronDown,
  MoreHorizontal,
  Settings,
  Heart,
  Bell,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import SidebarWidget from "./SidebarWidget";
import { filterMenuByRole } from "../../utils/role.js";
import { ROLE_ENUM } from "@/utils/constant";
import useAuth from "@/hooks/useAuth";

const menuConfig = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/dashboard",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Users",
    path: "/dashboard/users",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <Store className="w-5 h-5" />,
    name: "Vendors",
    path: "/dashboard/vendors",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    name: "Vendor Requests",
    path: "/dashboard/vendor-requests",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    name: "Orders",
    path: "/dashboard/orders",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <Package className="w-5 h-5" />,
    name: "Products",
    path: "/dashboard/products",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <FolderTree className="w-5 h-5" />,
    name: "Categories",
    path: "/dashboard/categories",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <Layers className="w-5 h-5" />,
    name: "Subcategories",
    path: "/dashboard/subcategories",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <FileText className="w-5 h-5" />,
    name: "Blogs",
    path: "/dashboard/blogs",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <Heart className="w-5 h-5" />,
    name: "Wishlists",
    path: "/dashboard/wishlists",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    name: "Messages",
    path: "/dashboard/messages",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <Bell className="w-5 h-5" />,
    name: "Notifications",
    path: "/dashboard/notifications",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    name: "Settings",
    path: "/dashboard/settings",
    roles: [ROLE_ENUM.admin, ROLE_ENUM.super_admin],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const { isAuthenticated, roles } = useAuth();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const filteredMenuItems = useMemo(() => {
    if (!isAuthenticated || !roles) return [];
    return filterMenuByRole(menuConfig, roles);
  }, [isAuthenticated, roles]);

  const isActive = useCallback(
    (path, isParent = false) => {
      if (isParent) {
        return pathname.startsWith(path) && pathname !== path;
      }
      return path === pathname;
    },
    [pathname]
  );

  const handleSubmenuToggle = useCallback((index, menuType) => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  }, []);

  const renderMenuItem = useCallback(
    (item, index) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isMenuActive = isActive(item.path);
      const hasActiveChild = hasSubItems && item.subItems.some((sub) => isActive(sub.path));
      const isSubmenuOpen = openSubmenu?.type === "main" && openSubmenu?.index === index;

      if (hasSubItems) {
        return (
          <li key={`${item.name}-${index}`}>
            <button
              onClick={() => handleSubmenuToggle(index, "main")}
              className={`menu-item group ${isSubmenuOpen || hasActiveChild
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded ? "lg:justify-center" : "lg:justify-start"
                }`}
            >
              <span
                className={`${isSubmenuOpen || hasActiveChild
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {item.icon}
              </span>
              {(isExpanded || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto mr-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      {item.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                      }`}
                  />
                </>
              )}
            </button>
            {(isExpanded || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`main-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={`${subItem.name}-${subIndex}`}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                          }`}
                      >
                        {subItem.name}
                        {subItem.badge && (
                          <span className="flex items-center gap-1 ml-auto">
                            <span
                              className={`${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                            >
                              {subItem.badge}
                            </span>
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      }

      return (
        <li key={`${item.name}-${index}`}>
          <Link
            href={item.path}
            className={`menu-item group ${isMenuActive ? "menu-item-active" : "menu-item-inactive"
              }`}
          >
            <span
              className={`${isMenuActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}
            >
              {item.icon}
            </span>
            {(isExpanded || isMobileOpen) && (
              <>
                <span className="menu-item-text">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        </li>
      );
    },
    [isActive, isExpanded, isMobileOpen, openSubmenu, subMenuHeight, handleSubmenuToggle]
  );

  useEffect(() => {
    let submenuMatched = false;
    filteredMenuItems.forEach((item, index) => {
      if (item.subItems) {
        const hasMatch = item.subItems.some((subItem) => isActive(subItem.path));
        if (hasMatch) {
          setOpenSubmenu({ type: "main", index });
          submenuMatched = true;
        }
      }
    });

    if (!submenuMatched) {
      const isOnSubmenuRoute = filteredMenuItems.some(
        (item) =>
          item.subItems && item.subItems.some((subItem) => pathname.startsWith(subItem.path))
      );
      if (!isOnSubmenuRoute) {
        setOpenSubmenu(null);
      }
    }
  }, [pathname, isActive, filteredMenuItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside
      className={`fixed flex flex-col top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        h-[100dvh] lg:h-screen
        mt-16 lg:mt-0`}
    >
      <div
        className={`hidden lg:flex px-5 py-8 flex-shrink-0 ${!isExpanded ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isMobileOpen ? (
            <Image
              src="/images/logo/logo.jpg"
              alt="SuperoAgrobase Logo"
              width={80}
              height={40}
              priority
              className="h-auto"
            />
          ) : (
            <Image
              src="/images/logo/logo.jpg"
              alt="SuperoAgrobase Logo"
              width={32}
              height={32}
              className="h-auto"
              priority
            />
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 lg:pt-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-600">
        <nav className="pb-4">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal className="w-5 h-5" />
                )}
              </h2>
              <ul className="flex flex-col gap-4">
                {filteredMenuItems.map((item, index) => renderMenuItem(item, index))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {(isExpanded || isMobileOpen) && (
        <div className="flex-shrink-0 px-5 pb-6 pt-4 border-t border-gray-200 dark:border-gray-800 lg:pb-6 pb-safe">
          <SidebarWidget />
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;