import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useMemo, useRef, useState } from "react";
import TelebotService from "../../services/telebot.service";
import ApiService from "../../services/api.service";
import "./LeadForm.scss";
import { AdviseForm } from "../../constants/interface";

type LeadFormState = {
    name: string;
    phone: string;
    // email: string;
    note: string;
};

type Props = {
    source: string; // e.g. "event"
};

function isValidPhone(phone: string) {
    const p = phone.replace(/\s|\.|-/g, "");
    // VN-ish: allow 9-11 digits, optional +84 prefix
    return /^(\+?84)?0?\d{8,10}$/.test(p);
}

function LeadForm({ source }: Props) {
    const toast = useRef<Toast>(null);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<LeadFormState>({
        name: "",
        phone: "",
        // email: "",
        note: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LeadFormState, string>>>({});

    const nowText = useMemo(() => new Date().toLocaleString("vi-VN"), []);

    const validate = () => {
        const next: Partial<Record<keyof LeadFormState, string>> = {};
        if (!form.name.trim()) next.name = "(*) Họ và tên là bắt buộc";
        if (!form.phone.trim()) next.phone = "(*) Số điện thoại là bắt buộc";
        else if (!isValidPhone(form.phone)) next.phone = "(*) Số điện thoại chưa đúng định dạng";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (key: keyof LeadFormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const handleSubmit = async () => {
        if (loading) return;
        if (!validate()) return;
        setLoading(true);
        try {
            const route = typeof window !== "undefined" ? window.location.pathname : "";
            const normalizedPhone = form.phone.replace(/\s|\.|-/g, "");
            const advisePayload: AdviseForm = {
                name: form.name,
                phone: normalizedPhone,
                note: form.note,
                source,
                status: 0,
                submitDate: '',
            };

            // 1) Save advise to backend first (but still send Telegram even if it fails)
            let apiError: unknown = null;
            try {
                await ApiService.postAdvise(advisePayload);
            } catch (err) {
                apiError = err;
            }

            const msg =
                `🧾 LEAD EVENT (Apple Watch)\n` +
                `- Thời gian: ${new Date().toLocaleString("vi-VN")}\n` +
                `- Nguồn: ${source}\n` +
                `- Route: ${route}\n\n` +
                `- KH: ${form.name}\n` +
                `- SĐT: ${normalizedPhone}\n` +
                // (form.email ? `- Email: ${form.email}\n` : "") +
                (form.note ? `- Ghi chú: ${form.note}\n` : "");

            // 2) Keep sending Telegram message
            try {
                await TelebotService.postMessage(msg);
            } catch {
                // Telegram errors shouldn't block UX since backend might succeed/fail independently.
            }

            if (apiError) throw apiError;

            setSent(true);
            toast.current?.show({
                severity: "success",
                summary: "Đã ghi nhận",
                detail: "TaoOne sẽ sớm liên hệ với bạn.",
            });
        } catch (e) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không gửi được thông tin. Vui lòng thử lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="lead-form-thanks">
                <Toast ref={toast} position="top-right" />
                <div className="lead-form-thanks-title">Cảm ơn bạn đã đăng ký.</div>
                <div className="lead-form-thanks-desc">
                    TaoOne sẽ liên hệ theo số <b>{form.phone}</b>. (Ghi nhận lúc {nowText})
                </div>
                <div className="lead-form-thanks-actions">
                    <Button
                        label="Gửi thêm 1 đăng ký"
                        className="lead-form-secondary"
                        onClick={() => {
                            setSent(false);
                            setForm({ name: "", phone: "", note: "" });
                            setErrors({});
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="lead-form-wrap">
            <Toast ref={toast} position="top-right" />

            <div className="lead-form-grid">
                <div className="lead-form-field">
                    <div className="lead-form-label">Họ và tên *</div>
                    <InputText
                        className={`w-full ${errors.name ? "lead-form-invalid" : ""}`}
                        placeholder="Họ tên của bạn"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    {errors.name && <div className="lead-form-error">{errors.name}</div>}
                </div>

                <div className="lead-form-field">
                    <div className="lead-form-label">Số điện thoại *</div>
                    <InputText
                        className={`w-full ${errors.phone ? "lead-form-invalid" : ""}`}
                        placeholder="Số điện thoại của bạn"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        inputMode="tel"
                    />
                    {errors.phone && <div className="lead-form-error">{errors.phone}</div>}
                </div>

                {/* <div className="lead-form-field">
                    <div className="lead-form-label">Email</div>
                    <InputText
                        className="w-full"
                        placeholder="Email của bạn (không bắt buộc)"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        inputMode="email"
                    />
                </div> */}

                <div className="lead-form-field-full">
                    <div className="lead-form-label">Ghi chú</div>
                    <InputTextarea
                        className="w-full"
                        placeholder="Ví dụ: muốn tư vấn mẫu/size, ngân sách, khung giờ tiện nghe máy..."
                        value={form.note}
                        onChange={(e) => handleChange("note", e.target.value)}
                        autoResize
                        rows={4}
                    />
                </div>
            </div>

            <div className="lead-form-actions">
                <Button
                    label={loading ? "Đang gửi..." : "Đăng ký nhận ưu đãi"}
                    disabled={loading}
                    className="lead-form-primary"
                    onClick={handleSubmit}
                />
                <div className="lead-form-policy">
                    Bằng việc gửi, bạn đồng ý để TaoOne liên hệ tư vấn và cung cấp thông tin ưu đãi. (Nội dung chính sách sẽ
                    được cập nhật minh bạch.)
                </div>
            </div>
        </div>
    );
}

export default LeadForm;

