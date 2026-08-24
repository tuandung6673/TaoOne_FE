import { Toast } from 'primereact/toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLE, USER_ROLE } from '../../constants/constants';
import { AuthResponseData } from '../../constants/interface';
import { setAuth } from '../../custom-hook/useAuth';
import bg from '../../images/trees.png';
import ApiService from '../../services/api.service';
import './Login.scss';

type AuthTab = 'login' | 'register';

const redirectByRole = (navigate: ReturnType<typeof useNavigate>, role: string) => {
    if (role === USER_ROLE.admin) {
        navigate(ROLE.admin);
    } else {
        navigate('/');
    }
};

const LoginForm = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [tab, setTab] = useState<AuthTab>('login');

    // Login state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Register state
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && token.trim() !== '') {
            redirectByRole(navigate, role || '');
        } else {
            // Clear any stale data
            localStorage.removeItem('username');
            localStorage.removeItem('role');
        }
    }, [navigate]);

    const handleAuthSuccess = useCallback((data: AuthResponseData, successMessage: string) => {
        setAuth(data);
        toast.current?.show({
            severity: 'success',
            summary: 'Thành công',
            detail: successMessage,
        });
        redirectByRole(navigate, data.role);
    }, [navigate]);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = { username, password };
        try {
            const response = await ApiService.postLogin(data);
            if (response.status === "success") {
                handleAuthSuccess(response.data, "Đăng nhập thành công !");
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Lỗi",
                    detail: response.message || "Đăng nhập thất bại!",
                });
            }
        } catch (error: any) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: error?.response?.data?.message || "Tài khoản hoặc mật khẩu không đúng",
            });
        }
    }, [username, password, handleAuthSuccess]);

    const handleRegisterSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (registerPassword.length < 6) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Mật khẩu phải có ít nhất 6 ký tự",
            });
            return;
        }

        if (registerPassword !== registerConfirmPassword) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Mật khẩu nhập lại không khớp",
            });
            return;
        }

        const data = { username: registerUsername, password: registerPassword };
        try {
            const response = await ApiService.postRegister(data);
            if (response.status === "success") {
                handleAuthSuccess(response.data, "Đăng ký thành công !");
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Lỗi",
                    detail: response.message || "Đăng ký thất bại!",
                });
            }
        } catch (error: any) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: error?.response?.data?.message || "Tài khoản đã tồn tại",
            });
        }
    }, [registerUsername, registerPassword, registerConfirmPassword, handleAuthSuccess]);

    return (
        <div className='login-container'>
            <Toast ref={toast} />
            <div className="login-bg">
                <img src={bg} alt="bg" />
            </div>
            <div className="login-form">
                <div className="login-tabs">
                    <button
                        type="button"
                        className={`login-tab ${tab === 'login' ? 'login-tab-active' : ''}`}
                        onClick={() => setTab('login')}
                    >
                        Đăng nhập
                    </button>
                    <button
                        type="button"
                        className={`login-tab ${tab === 'register' ? 'login-tab-active' : ''}`}
                        onClick={() => setTab('register')}
                    >
                        Đăng ký
                    </button>
                </div>

                {tab === 'login' ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Tài khoản:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Đăng nhập</button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="form-group">
                            <label htmlFor="register-username">Tài khoản:</label>
                            <input
                                type="text"
                                id="register-username"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-password">Mật khẩu:</label>
                            <input
                                type="password"
                                id="register-password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-confirm-password">Nhập lại mật khẩu:</label>
                            <input
                                type="password"
                                id="register-confirm-password"
                                value={registerConfirmPassword}
                                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        <button type="submit">Đăng ký</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
