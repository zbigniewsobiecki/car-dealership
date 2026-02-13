import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { Car } from 'lucide-react';
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            login(response.user, response.token, response.refreshToken);
            navigate('/dashboard');
        }
        catch (err) {
            if (err instanceof Error) {
                setError('Invalid email or password');
            }
            else {
                setError('An error occurred. Please try again.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl", children: [_jsxs("div", { children: [_jsx("div", { className: "flex justify-center", children: _jsx(Car, { className: "h-16 w-16 text-primary-600" }) }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Car Dealership Management" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Sign in to your account" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm", children: error })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "label", children: "Email address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "input", placeholder: "email@example.com", value: email, onChange: (e) => setEmail(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "label", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, className: "input", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value) })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: "w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Signing in...' : 'Sign in' }) }), _jsxs("div", { className: "text-sm text-gray-600 bg-gray-50 p-4 rounded-md", children: [_jsx("p", { className: "font-medium mb-2", children: "Demo Credentials:" }), _jsxs("p", { children: [_jsx("strong", { children: "Admin:" }), " admin@cardealership.com / admin123"] }), _jsxs("p", { children: [_jsx("strong", { children: "Sales:" }), " sales@cardealership.com / sales123"] })] })] })] }) }));
};
//# sourceMappingURL=Login.js.map