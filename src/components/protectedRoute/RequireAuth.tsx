import { Navigate, Outlet } from 'react-router-dom';
import { isJwtExpired } from '../../utils/auth';

interface RequireAuthProps {
    redirectPath?: string;
}

const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
};

const RequireAuth: React.FC<RequireAuthProps> = ({
    redirectPath = '/login'
}) => {
    const token = localStorage.getItem('token');

    if (!token || token.trim() === '' || token.length < 10 || isJwtExpired(token)) {
        clearAuthStorage();
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
