import React, { useEffect, useState } from 'react';
import apisController from '../apis/services/apisController';
import type { addUserResponse } from '../apis/DataResponse/responses';
import type { addUserDto } from '../apis/DataParam/dtos';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

function SignUpComponent() {
    const {fetchUsers} = useChat();
    const [formData, setFormData] = useState({
        nickName: '',
        fullName: '',
        email: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({
        nickName: '',
        fullName: '',
        email: '',
        password: ''
    });
    
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [darkMode, setDarkMode] = useState(false);
    const [redMode, setRedMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getGradientColors = () => {
        if (darkMode && redMode) return ['#450a0a', '#7f1d1d', '#991b1b'];
        if (darkMode) return ['#0f172a', '#1e293b', '#334155'];
        if (redMode) return ['#fee2e2', '#fecaca', '#fca5a5'];
        return ['#3b82f6', '#8b5cf6', '#ec4899'];
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const validateForm = () => {
        const newErrors = {
            nickName: formData.nickName.trim() ? '' : 'Nickname is required',
            fullName: formData.fullName.trim() ? '' : 'Full name is required',
            email: formData.email.trim() ? 
                  (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '' : 'Invalid email format') 
                  : 'Email is required',
            password: formData.password.length >= 6 ? '' : 'Password must be at least 6 characters'
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            setIsSubmitting(true);
            const user: addUserDto = {
                nickName: formData.nickName,
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            };
            
            const response: addUserResponse = await apisController.addUser(user);
            
            alert(`Account created successfully! Welcome, ${response.nickName}`);
            fetchUsers(); // Refresh user list
            navigate('/login');
            
            // Reset form
            setFormData({
                nickName: '',
                fullName: '',
                email: '',
                password: ''
            });
            
        } catch (error: any) {
            console.error('Signup error:', error);
            setErrors(prev => ({
                ...prev,
                email: error.message || 'Registration failed. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        
        // Clear error when user types
        if (errors[id as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const gradientStyle = {
        background: `radial-gradient(at ${mousePosition.x}% ${mousePosition.y}%, ${getGradientColors().join(', ')})`,
        transition: 'background 0.3s ease-out',
        minHeight: '100vh'
    };

    const formContainerStyle = {
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        color: darkMode ? 'white' : 'inherit'
    };

    return (
        <div className="flex items-center justify-center p-4 flex-col" style={gradientStyle}>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                    }`}
                >
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
                <button
                    onClick={() => setRedMode(!redMode)}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${
                        redMode ? 'bg-red-600 text-white' : 'bg-white text-red-600'
                    }`}
                >
                    {redMode ? '🌈 Normal Colors' : '🔥 Red Theme'}
                </button>
            </div>

            <div className="rounded-lg shadow-xl p-8 w-full max-w-lg" style={formContainerStyle}>
                <h2 className="text-2xl font-bold mb-6">
                    {redMode ? '🔥 ' : ''}
                    Sign Up for Chat
                    {darkMode ? ' 🌙' : ''}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="nickName">
                            Nick Name
                        </label>
                        <input
                            id="nickName"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{
                                borderColor: errors.nickName ? '#ef4444' : darkMode ? '#334155' : '#d1d5db',
                                backgroundColor: darkMode ? '#1e293b' : 'white',
                                color: darkMode ? 'white' : 'inherit'
                            }}
                            value={formData.nickName}
                            onChange={handleChange}
                        />
                        {errors.nickName && <p className="text-red-500 text-sm mt-1">{errors.nickName}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{
                                borderColor: errors.fullName ? '#ef4444' : darkMode ? '#334155' : '#d1d5db',
                                backgroundColor: darkMode ? '#1e293b' : 'white',
                                color: darkMode ? 'white' : 'inherit'
                            }}
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{
                                borderColor: errors.email ? '#ef4444' : darkMode ? '#334155' : '#d1d5db',
                                backgroundColor: darkMode ? '#1e293b' : 'white',
                                color: darkMode ? 'white' : 'inherit'
                            }}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                            style={{
                                borderColor: errors.password ? '#ef4444' : darkMode ? '#334155' : '#d1d5db',
                                backgroundColor: darkMode ? '#1e293b' : 'white',
                                color: darkMode ? 'white' : 'inherit'
                            }}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-all ${
                            isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed'
                                : redMode 
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : darkMode
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUpComponent;