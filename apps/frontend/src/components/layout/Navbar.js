import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Car, LogOut, User } from 'lucide-react';
export const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsx("nav", { className: "fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 h-16", children: _jsxs("div", { className: "flex items-center justify-between h-full px-6", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Car, { className: "h-8 w-8 text-primary-600" }), _jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Car Dealership Management" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2 text-sm", children: [_jsx(User, { className: "h-5 w-5 text-gray-500" }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium text-gray-900", children: [user?.firstName, " ", user?.lastName] }), _jsx("p", { className: "text-xs text-gray-500 capitalize", children: user?.role })] })] }), _jsxs("button", { onClick: handleLogout, className: "btn btn-secondary flex items-center space-x-2", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { children: "Logout" })] })] })] }) }));
};
//# sourceMappingURL=Navbar.js.map