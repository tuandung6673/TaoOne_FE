import { Navigate, Outlet } from 'react-router-dom';
import { USER_ROLE } from '../../constants/constants';
import { isJwtExpired } from '../../utils/auth';

interface ProtectedRouteProps {
    redirectPath?: string;
    forbiddenPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    redirectPath = '/login',
    forbiddenPath = '/'
}) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || token.trim() === '') {
        if (token) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
        }
        return <Navigate to={redirectPath} replace />;
    }

    if (token.length < 10) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        return <Navigate to={redirectPath} replace />;
    }

    // If token is a JWT and expired, force login
    if (isJwtExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        return <Navigate to={redirectPath} replace />;
    }

    // Only admin role can access admin routes
    if (role !== USER_ROLE.admin) {
        return <Navigate to={forbiddenPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;