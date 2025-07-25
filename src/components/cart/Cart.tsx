import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../custom-hook/CartContext";
import "./cart.scss";

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat("vi-VN").format(number);
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        updateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = (itemId: string) => {
        removeFromCart(itemId);
        if (toast.current) {
            toast.current.show({
                severity: "info",
                summary: "Đã xóa",
                detail: "Sản phẩm đã được xóa khỏi giỏ hàng",
            });
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            if (toast.current) {
                toast.current.show({
                    severity: "warn",
                    summary: "Thông báo",
                    detail: "Giỏ hàng trống!",
                });
            }
            return;
        }
        
        // For now, navigate to payment with the first item
        // In a real app, you might want to create a multi-item checkout
        navigate("/thanh-toan/" + cartItems[0].id);
    };

    const handleClearCart = () => {
        clearCart();
        if (toast.current) {
            toast.current.show({
                severity: "info",
                summary: "Đã xóa",
                detail: "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
            });
        }
    };

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
                        <div key={item.id} className="cart_item">
                            <div className="item_image">
                                <img src={item.img} alt={item.name} />
                            </div>
                            <div className="item_details">
                                <h3>{item.name}</h3>
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
                            </div>
                            <div className="item_quantity">
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <i className="pi pi-minus"></i>
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >
                                    <i className="pi pi-plus"></i>
                                </button>
                            </div>
                            <div className="item_total">
                                <span>{formatNumber(item.salePrice * item.quantity)}đ</span>
                            </div>
                            <div className="item_actions">
                                <button onClick={() => handleRemoveItem(item.id)}>
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
                    <div className="summary_total">
                        <span>Tổng cộng:</span>
                        <span>{formatNumber(getCartTotal())}đ</span>
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