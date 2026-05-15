import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChartPieIcon, 
  ArchiveBoxIcon, 
  ShoppingCartIcon, 
  BanknotesIcon, 
  BuildingStorefrontIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user")) || {};
  const location = useLocation();

  let navigation = [
    { name: "Dashboard", href: "/", icon: ChartPieIcon },
    { name: "Inventory", href: "/inventory", icon: ArchiveBoxIcon },
    { name: "Purchase Details", href: "/purchase-details", icon: ShoppingCartIcon },
    { name: "Sales", href: "/sales", icon: BanknotesIcon },
    { name: "Manage Store", href: "/manage-store", icon: BuildingStorefrontIcon },
  ];

  if (localStorageData.role === "user") {
    navigation = navigation.filter(item =>
      ["Inventory", "Purchase Details", "Manage Store"].includes(item.name)
    );
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Brand / Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <ArchiveBoxIcon className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">
            InventoryPro
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const isCurrent = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isCurrent
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600",
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                )}
              >
                <item.icon
                  className={classNames(
                    isCurrent ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600",
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Section at Bottom */}
      <Link to="/profile" className="flex shrink-0 border-t border-gray-200 p-4 hover:bg-gray-50 transition-colors">
        <div className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              {localStorageData.imageUrl ? (
                <img
                  className="inline-block h-10 w-10 rounded-full object-cover shadow-sm border border-gray-200"
                  src={localStorageData.imageUrl}
                  alt="Profile"
                />
              ) : (
                <UserCircleIcon className="inline-block h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {localStorageData.firstName} {localStorageData.lastName}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 truncate w-40">
                {localStorageData.email}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default SideMenu;
