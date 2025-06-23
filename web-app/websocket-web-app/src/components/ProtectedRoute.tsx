// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import type { loginUserResponse } from '../apis/DataResponse/responses';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = "/login" }: ProtectedRouteProps) => {
  const user: loginUserResponse | null = localStorage.getItem('userData') 
    ? JSON.parse(localStorage.getItem('userData')!) 
    : null;

  return user ? children : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;