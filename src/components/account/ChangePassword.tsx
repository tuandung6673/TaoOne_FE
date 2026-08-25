import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useCallback, useRef, useState } from "react";
import ApiService from "../../services/api.service";
import "./ChangePassword.scss";

function ChangePassword() {
    const toast = useRef<Toast>(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newPassword.length < 6) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Mật khẩu mới phải có ít nhất 6 ký tự",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Mật khẩu mới nhập lại không khớp",
            });
            return;
        }

        setSaving(true);
        try {
            const response = await ApiService.postChangePassword({
                old_password: oldPassword,
                new_password: newPassword,
            });
            if (response?.status && response.status !== "success") {
                throw new Error(response.message || "change password failed");
            }
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đổi mật khẩu thành công",
            });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: error?.response?.data?.message || "Mật khẩu cũ không đúng",
            });
        } finally {
            setSaving(false);
        }
    }, [oldPassword, newPassword, confirmPassword]);

    return (
        <div className="change-password">
            <Toast ref={toast} />
            <h2>Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="old-password">Mật khẩu hiện tại</label>
                    <div className="password-input">
                        <input
                            type={showOldPassword ? "text" : "password"}
                            id="old-password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="password-input__toggle"
                            onClick={() => setShowOldPassword((prev) => !prev)}
                            aria-label={showOldPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            <i className={showOldPassword ? "pi pi-eye-slash" : "pi pi-eye"}></i>
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="new-password">Mật khẩu mới</label>
                    <div className="password-input">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="password-input__toggle"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            <i className={showNewPassword ? "pi pi-eye-slash" : "pi pi-eye"}></i>
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Nhập lại mật khẩu mới</label>
                    <div className="password-input">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="password-input__toggle"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            <i className={showConfirmPassword ? "pi pi-eye-slash" : "pi pi-eye"}></i>
                        </button>
                    </div>
                </div>
                <Button type="submit" label="Đổi mật khẩu" loading={saving} />
            </form>
        </div>
    );
}

export default ChangePassword;
