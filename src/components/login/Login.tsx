import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '../../constants/constants';
import bg from '../../images/trees.png';
import ApiService from '../../services/api.service';
import './Login.scss';

const LoginForm = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        // Xử lý logic đăng nhập ở đây
        const data = { username, password }
        try {
            const response = await ApiService.postLogin(data);
            if (response.status === "success" && toast.current) {
                localStorage.setItem("token", response.data.token);
                toast.current.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Đăng nhập thành công !",
                });
                navigate(`${ROLE.admin}`);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Lỗi",
                    detail: response.message || "Đăng nhập thất bại!",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='login-container'>
            <Toast ref={toast} />
            <div className="login-bg">
                <img src={bg} alt="bg" />
            </div>
            <div className="login-form">
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
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
