import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Users, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';
const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
];
export const Sidebar = () => {
    return (_jsx("aside", { className: "fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-20", children: _jsx("nav", { className: "p-4 space-y-2", children: navigation.map((item) => (_jsxs(NavLink, { to: item.href, className: ({ isActive }) => clsx('flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors', isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'), children: [_jsx(item.icon, { className: "h-5 w-5" }), _jsx("span", { children: item.name })] }, item.name))) }) }));
};
//# sourceMappingURL=Sidebar.js.map