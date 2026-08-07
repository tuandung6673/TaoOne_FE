import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../custom-hook/CartContext";
import { useVoucher } from "../../custom-hook/VoucherContext";
import "./cart.scss";

const formatNumber = (number: number) => new Intl.NumberFormat("vi-VN").format(number);

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { appliedCode, result: voucherResult, loading: voucherLoading, error: voucherError, discountAmount, applyVoucher, clearVoucher } = useVoucher();
    const [voucherInput, setVoucherInput] = useState("");
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    const ineligibleReasonByProductId = useMemo(() => {
        const map: Record<string, string> = {};
        voucherResult?.ineligible_products?.forEach((p) => {
            map[p.product_id] = p.reason;
        });
        return map;
    }, [voucherResult]);

    const finalTotal = Math.max(getCartTotal() - discountAmount, 0);

    const handleApplyVoucher = useCallback(async () => {
        await applyVoucher(voucherInput);
    }, [applyVoucher, voucherInput]);

    const handleRemoveVoucher = useCallback(() => {
        setVoucherInput("");
        clearVoucher();
    }, [clearVoucher]);

    const handleRemoveItem = useCallback((itemId: string, size?: string) => {
        removeFromCart(itemId, size);
        toast.current?.show({
            severity: "info",
            summary: "Đã xóa",
            detail: "Sản phẩm đã được xóa khỏi giỏ hàng",
        });
    }, [removeFromCart]);

    const handleCheckout = useCallback(() => {
        if (cartItems.length === 0) {
            toast.current?.show({
                severity: "warn",
                summary: "Thông báo",
                detail: "Giỏ hàng trống!",
            });
            return;
        }

        // For now, navigate to payment with the first item
        // In a real app, you might want to create a multi-item checkout
        navigate("/thanh-toan-gio-hang");
    }, [cartItems.length, navigate]);

    const handleClearCart = useCallback(() => {
        clearCart();
        toast.current?.show({
            severity: "info",
            summary: "Đã xóa",
            detail: "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
        });
    }, [clearCart]);

    if (cartItems.length === 0) {
        return (
            <div className="cart_empty">
                <Toast ref={toast} />
                <div className="empty_content">
                    <i className="pi pi-shopping-bag"></i>
                    <h2>Giỏ hàng trống</h2>
                    <p>Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
                    <Button 
                        label="Tiếp tục mua sắm" 
                        icon="pi pi-arrow-left"
                        onClick={() => navigate("/")}
                        className="continue_shopping"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="cart_container">
            <Toast ref={toast} />
            <div className="cart_header">
                <div className="cart_header_title">
                    <i className="pi pi-shopping-cart"></i>
                    Giỏ hàng của bạn
                </div>
                <div className="cart_header_actions">
                    <button
                        className="clear_btn"
                        onClick={handleClearCart}
                    >
                        <i className="pi pi-trash"></i>
                        Xóa tất cả
                    </button>
                </div>
            </div>
            
            <div className="cart_content">
                <div className="cart_items">
                    {cartItems.map((item) => (
                        <div key={item.id + "_" + item.size} className="cart_item">
                            <div className="item_image">
                                <img src={item.img} alt={item.name} />
                            </div>
                            <div className="item_details">
                                <h3>{item.name}{item.size ? ` - ${item.size}` : ""}</h3>
                                <p className="item_category">
                                    {item.category_detail_name}
                                </p>
                                <div className="item_price">
                                    <span className="sale_price">
                                        {formatNumber(item.salePrice)}đ
                                    </span>
                                    {item.price !== item.salePrice && (
                                        <span className="original_price">
                                            {formatNumber(item.price)}đ
                                        </span>
                                    )}
                                </div>
                                {ineligibleReasonByProductId[item.id] && (
                                    <div className="item_voucher_warning">
                                        <i className="pi pi-exclamation-triangle"></i>
                                        Sản phẩm này không được áp dụng mã giảm giá
                                    </div>
                                )}
                            </div>
                            <div className="item_quantity">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                    disabled={item.quantity <= 1}
                                >
                                    <i className="pi pi-minus"></i>
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                >
                                    <i className="pi pi-plus"></i>
                                </button>
                            </div>
                            <div className="item_total">
                                <span>{formatNumber(item.salePrice * item.quantity)}đ</span>
                            </div>
                            <div className="item_actions">
                                <button onClick={() => handleRemoveItem(item.id, item.size)}>
                                    <i className="pi pi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart_summary">
                    <h2>Tổng quan đơn hàng</h2>
                    <div className="summary_item">
                        <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                        <span>{formatNumber(getCartTotal())}đ</span>
                    </div>
                    <div className="summary_item">
                        <span>Phí vận chuyển:</span>
                        <span>Miễn phí</span>
                    </div>

                    <div className="voucher_box">
                        {appliedCode ? (
                            <div className="voucher_applied">
                                <div className="voucher_applied_info">
                                    <i className="pi pi-tag"></i>
                                    <span>Mã <b>{appliedCode}</b> đã áp dụng</span>
                                </div>
                                <button className="voucher_remove_btn" onClick={handleRemoveVoucher}>
                                    <i className="pi pi-times"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="voucher_input_row">
                                <InputText
                                    placeholder="Nhập mã giảm giá"
                                    value={voucherInput}
                                    onChange={(e) => setVoucherInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
                                />
                                <Button
                                    label="Áp dụng"
                                    onClick={handleApplyVoucher}
                                    loading={voucherLoading}
                                />
                            </div>
                        )}
                        {voucherError && (
                            <div className="voucher_error">
                                <i className="pi pi-times-circle"></i>
                                {voucherError}
                            </div>
                        )}
                        {voucherResult?.valid && voucherResult?.message && (
                            <div className="voucher_success_message">{voucherResult.message}</div>
                        )}
                    </div>

                    {discountAmount > 0 && (
                        <div className="summary_item summary_discount">
                            <span>Giảm giá:</span>
                            <span>-{formatNumber(discountAmount)}đ</span>
                        </div>
                    )}

                    <div className="summary_total">
                        <span>Tổng cộng:</span>
                        <span>{formatNumber(finalTotal)}đ</span>
                    </div>
                    <button
                        className="checkout_button"
                        onClick={handleCheckout}
                    >
                        <i className="pi pi-credit-card"></i>
                        Thanh toán ngay
                    </button>
                    <button
                        className="continue_shopping"
                        onClick={() => navigate("/")}
                    >
                        <i className="pi pi-arrow-left"></i>
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart; 