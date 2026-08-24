import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ACCOUNT_ROUTE, USER_ROLE } from "../../constants/constants";
import { useAuth } from "../../custom-hook/useAuth";
import "./AccountLayout.scss";

const MENU_ITEMS = [
    { path: ACCOUNT_ROUTE.changePassword, label: "Đổi mật khẩu", icon: "pi pi-lock" },
    { path: ACCOUNT_ROUTE.purchaseHistory, label: "Lịch sử mua hàng", icon: "pi pi-shopping-bag" },
    { path: ACCOUNT_ROUTE.addressBook, label: "Sổ địa chỉ", icon: "pi pi-map-marker" },
];

function AccountLayout() {
    const { username, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="account-page">
            <aside className="account-sidebar">
                <div className="account-profile">
                    <div className="account-avatar">
                        <i className="pi pi-user"></i>
                    </div>
                    <div className="account-profile-name">{username}</div>
                    <div className="account-profile-role">
                        {role === USER_ROLE.admin ? "Quản trị viên" : "Khách hàng"}
                    </div>
                </div>
                <nav className="account-menu">
                    {MENU_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `account-menu-item ${isActive ? "account-menu-item-active" : ""}`
                            }
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <button className="account-logout" onClick={handleLogout}>
                    <i className="pi pi-sign-out"></i>
                    Đăng xuất
                </button>
            </aside>
            <div className="account-content">
                <Outlet />
            </div>
        </div>
    );
}

export default AccountLayout;
