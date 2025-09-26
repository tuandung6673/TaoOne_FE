import { Navigate, Outlet } from 'react-router-dom';
import { isJwtExpired } from '../../utils/auth';

interface ProtectedRouteProps {
    redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    redirectPath = '/login'
}) => {
    const token = localStorage.getItem('token');
    
    if (!token || token.trim() === '') {
        if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
        return <Navigate to={redirectPath} replace />;
    }

    if (token.length < 10) { 
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return <Navigate to={redirectPath} replace />;
    }

    // If token is a JWT and expired, force login
    if (isJwtExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;