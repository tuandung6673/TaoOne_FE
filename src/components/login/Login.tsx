import React, { useRef, useState } from 'react';
import './Login.scss';
import ApiService from '../../services/api.service';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '../../constants/constants';

const LoginForm = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event : any) => {
        event.preventDefault();
        // Xử lý logic đăng nhập ở đây
        const data = {username, password}
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
        <div className="login-form">
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
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
    );
};

export default LoginForm;
