import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Inventory", href: "/inventory" },
  { name: "Purchase Details", href: "/purchase-details" },
  { name: "Sales", href: "/sales" },
  { name: "Manage Store", href: "/manage-store" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user")) || {};
  const location = useLocation();

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200 shadow-sm z-10 relative">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="flex items-center lg:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo (Visible mainly on mobile since sidebar has it on desktop, but keep it centered/left) */}
              <div className="flex flex-1 justify-center lg:justify-start lg:hidden">
                <div className="flex flex-shrink-0 items-center gap-2">
                  <span className="font-bold text-xl text-indigo-600 tracking-tight">
                    InventoryPro
                  </span>
                </div>
              </div>

              {/* Spacer for desktop since sidebar has logo */}
              <div className="hidden lg:block lg:flex-1">
                 <h1 className="text-xl font-semibold text-gray-800">
                    {navigation.find(n => n.href === location.pathname)?.name || "Dashboard"}
                 </h1>
              </div>

              {/* Right section (Notifications & Profile) */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-shadow">
                      <span className="sr-only">Open user menu</span>
                      {localStorageData.imageUrl ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                          src={localStorageData.imageUrl}
                          alt="profile"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-900 font-medium">{localStorageData.firstName} {localStorageData.lastName}</p>
                        <p className="text-sm text-gray-500 truncate">{localStorageData.email}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => authContext.signout()}
                            className={classNames(
                              active ? "bg-gray-50 text-indigo-600" : "text-gray-700",
                              "block w-full text-left px-4 py-2 text-sm transition-colors"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Panel */}
          <Disclosure.Panel className="lg:hidden border-t border-gray-200 bg-white">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => {
                const isCurrent = location.pathname === item.href;
                return (
                  <Link to={item.href} key={item.name}>
                    <Disclosure.Button
                      as="div"
                      className={classNames(
                        isCurrent
                          ? "bg-indigo-50 text-indigo-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600",
                        "block rounded-md px-3 py-2 text-base font-medium transition-colors"
                      )}
                      aria-current={isCurrent ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-5 gap-3">
                <div className="flex-shrink-0">
                  {localStorageData.imageUrl ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={localStorageData.imageUrl}
                      alt="profile"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="text-base font-medium leading-none text-gray-800">
                    {localStorageData.firstName} {localStorageData.lastName}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-500 mt-1">
                    {localStorageData.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Disclosure.Button
                  as="button"
                  onClick={() => authContext.signout()}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
