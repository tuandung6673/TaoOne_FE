import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { ProductCommentForm, ProductCommentSummary } from "../../constants/interface";
import ApiService from "../../services/api.service";
import "./ProductCommentSection.scss";
import StarRating from "./StarRating";

const INITIAL_VISIBLE_COUNT = 5;
const LOAD_MORE_STEP = 5;

type FormState = {
    name: string;
    phone: string;
    content: string;
    rating: number;
};

const INITIAL_FORM: FormState = { name: "", phone: "", content: "", rating: 5 };

interface Props {
    productId?: string;
    summary: ProductCommentSummary;
    loading: boolean;
    onCommentPosted: () => void;
}

function isValidPhone(phone: string) {
    const p = phone.replace(/\s|\.|-/g, "");
    // VN-ish: allow 9-11 digits, optional +84 prefix
    return /^(\+?84)?0?\d{8,10}$/.test(p);
}

function maskPhone(phone: string) {
    const digits = (phone || "").replace(/\s+/g, "");
    if (digits.length <= 7) return digits;
    return `${digits.slice(0, 4)}****${digits.slice(-2)}`;
}

function formatCommentDate(value: string) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getInitial(name: string) {
    return (name || "?").trim().charAt(0).toUpperCase();
}

function ProductCommentSection({ productId, summary, loading, onCommentPosted }: Props) {
    const toast = useRef<Toast>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    // Reset local UI state when navigating between products (same route/component instance).
    useEffect(() => {
        setShowForm(false);
        setForm(INITIAL_FORM);
        setErrors({});
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    }, [productId]);

    const handleChange = (key: keyof FormState, value: string | number) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const validate = () => {
        const next: Partial<Record<keyof FormState, string>> = {};
        if (!form.name.trim()) next.name = "(*) Họ và tên là bắt buộc";
        if (!form.phone.trim()) next.phone = "(*) Số điện thoại là bắt buộc";
        else if (!isValidPhone(form.phone)) next.phone = "(*) Số điện thoại chưa đúng định dạng";
        if (!form.content.trim()) next.content = "(*) Vui lòng nhập nội dung đánh giá";
        if (!form.rating || form.rating < 1 || form.rating > 5) next.rating = "(*) Vui lòng chọn số sao";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (submitting || !productId) return;
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload: ProductCommentForm = {
                product_id: productId,
                name: form.name.trim(),
                phone: form.phone.replace(/\s|\.|-/g, ""),
                content: form.content.trim(),
                rating: form.rating,
            };
            const res = await ApiService.postProductComment(payload);
            if (res?.status !== "success") {
                throw new Error(res?.message || "post comment failed");
            }

            toast.current?.show({
                severity: "success",
                summary: "Cảm ơn bạn!",
                detail: "Đánh giá của bạn đã được đăng.",
            });
            setForm(INITIAL_FORM);
            setShowForm(false);
            onCommentPosted();
        } catch (err) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không thể gửi đánh giá. Vui lòng thử lại.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const visibleComments = summary.comments.slice(0, visibleCount);
    const hasMore = summary.comments.length > visibleCount;

    return (
        <div className="product-comment-wrap">
            <Toast ref={toast} position="top-right" />

            <div className="product-comment-summary-card">
                <div className="product-comment-summary-score">
                    <div className="product-comment-summary-number">{summary.average_rating.toFixed(1)}</div>
                    <StarRating value={summary.average_rating} size={16} />
                    <div className="product-comment-summary-count">
                        {summary.total_count > 0 ? `${summary.total_count} đánh giá` : "Chưa có đánh giá"}
                    </div>
                </div>
                <div className="product-comment-summary-divider" />
                <div className="product-comment-summary-prompt">
                    <p>Hãy chia sẻ trải nghiệm của bạn để giúp những khách hàng khác lựa chọn tốt hơn.</p>
                    <Button
                        label={showForm ? "Đóng" : "Viết đánh giá"}
                        icon={showForm ? "pi pi-times" : "pi pi-pencil"}
                        className={`product-comment-pill-btn ${showForm ? "product-comment-pill-btn-outlined" : ""}`}
                        onClick={() => setShowForm((prev) => !prev)}
                    />
                </div>
            </div>

            {showForm && (
                <div className="product-comment-form-box">
                    <div className="product-comment-form-field">
                        <label>Đánh giá của bạn *</label>
                        <Rating
                            value={form.rating}
                            onChange={(e) => handleChange("rating", e.value || 0)}
                            cancel={false}
                            className="product-comment-form-rating"
                        />
                        {errors.rating && <div className="product-comment-error">{errors.rating}</div>}
                    </div>
                    <div className="product-comment-form-grid">
                        <div className="product-comment-form-field">
                            <label>Họ và tên *</label>
                            <InputText
                                className={`w-full ${errors.name ? "product-comment-invalid" : ""}`}
                                placeholder="Tên của bạn"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />
                            {errors.name && <div className="product-comment-error">{errors.name}</div>}
                        </div>
                        <div className="product-comment-form-field">
                            <label>Số điện thoại *</label>
                            <InputText
                                className={`w-full ${errors.phone ? "product-comment-invalid" : ""}`}
                                placeholder="Số điện thoại của bạn"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                inputMode="tel"
                            />
                            {errors.phone && <div className="product-comment-error">{errors.phone}</div>}
                        </div>
                    </div>
                    <div className="product-comment-form-field">
                        <label>Nội dung *</label>
                        <InputTextarea
                            className={`w-full ${errors.content ? "product-comment-invalid" : ""}`}
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                            value={form.content}
                            onChange={(e) => handleChange("content", e.target.value)}
                            autoResize
                            rows={3}
                            maxLength={1000}
                        />
                        {errors.content && <div className="product-comment-error">{errors.content}</div>}
                    </div>
                    <div className="product-comment-form-actions">
                        <Button
                            label={submitting ? "Đang gửi..." : "Gửi đánh giá"}
                            disabled={submitting}
                            className="product-comment-pill-btn"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            )}

            <div className="product-comment-list">
                {loading && summary.comments.length === 0 ? (
                    <div className="product-comment-empty">Đang tải đánh giá...</div>
                ) : visibleComments.length === 0 ? (
                    <div className="product-comment-empty">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</div>
                ) : (
                    visibleComments.map((comment) => (
                        <div className="product-comment-item" key={comment.id}>
                            <div className="product-comment-avatar">{getInitial(comment.name)}</div>
                            <div className="product-comment-item-body">
                                <div className="product-comment-item-header">
                                    <span className="product-comment-item-name">
                                        {comment.name}
                                        {comment.is_verified && (
                                            <span
                                                className="product-comment-verified-badge"
                                                title="Đánh giá đã xác thực"
                                            >
                                                <i className="pi pi-check"></i>
                                            </span>
                                        )}
                                    </span>
                                    <span className="product-comment-item-date">{formatCommentDate(comment.created_at)}</span>
                                </div>
                                <div className="product-comment-item-meta">
                                    <StarRating value={comment.rating} size={12} />
                                    <span className="product-comment-item-phone">{maskPhone(comment.phone)}</span>
                                </div>
                                <p className="product-comment-item-content">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {hasMore && (
                <div className="product-comment-load-more">
                    <Button
                        label="Xem thêm đánh giá"
                        className="product-comment-pill-btn product-comment-pill-btn-outlined"
                        onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                    />
                </div>
            )}
        </div>
    );
}

export default ProductCommentSection;
