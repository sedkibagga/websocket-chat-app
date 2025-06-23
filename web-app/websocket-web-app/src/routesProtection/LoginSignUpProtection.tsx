import React from 'react'
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const LoginSignUpProtection = ({ children, redirectTo = "/chatMessagePage" }: ProtectedRouteProps) => {
    const user: any = localStorage.getItem('userData') 
        ? JSON.parse(localStorage.getItem('userData')!) 
        : null;
    
    return user ? <Navigate to={redirectTo} replace /> : children;
}

export default LoginSignUpProtection