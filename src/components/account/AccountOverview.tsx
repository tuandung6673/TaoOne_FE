import { useAuth } from "../../custom-hook/useAuth";

function AccountOverview() {
    const { username } = useAuth();

    return (
        <div className="account-placeholder">
            <i className="pi pi-id-card"></i>
            <h2>Xin chào, {username}</h2>
            <p>Chọn một chức năng ở menu bên trái để tiếp tục.</p>
        </div>
    );
}

export default AccountOverview;
