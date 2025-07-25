import classes from "./UserHeader.module.scss";
import headerLogo from "../../../images/Tao one den.png";
import { AllRouteType } from "../../../constants/constants";
import { useEffect, useState, useRef } from "react";
import { useCart } from "../../../custom-hook/CartContext";
import { useNavigate } from "react-router-dom";
import { OverlayPanel } from "primereact/overlaypanel";

function UserHeader() {
  const { clearCart } = useCart();
  const [isFixed, setIsFixed] = useState(false);
  const { getCartCount, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const cartOverlayRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Change 100 to the desired scroll distance
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCartClick = (event: React.MouseEvent) => {
    if (cartOverlayRef.current) {
      cartOverlayRef.current.toggle(event);
    }
  };

  const handleCheckoutClick = () => {
    navigate("/cart");
    if (cartOverlayRef.current) {
      cartOverlayRef.current.hide();
    }
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
    // if (cartOverlayRef.current) {
    //   cartOverlayRef.current.hide();
    // }
  };

  return (
    <>
      <div className={`${classes.header} ${isFixed ? classes.header_fixed : ''}`}>
        <div className={classes.header_main}>
          <div className={`${classes.header_left}`}>
            <a href="/" title="Trang chủ">
              <img
                className={classes.logo}
                src={headerLogo}
                alt="Logo"
              />
            </a>
          </div>
          <div className={`${classes.header_center}`}>
            <ul>
              <li>
                <a href={"/" + AllRouteType.watch} title="">
                  Watch
                </a>
              </li>
              <li>
                <a href={"/" + AllRouteType.ipad} title="">
                  iPad
                </a>
              </li>
              <li>
                <a href={"/" + AllRouteType.macbook} title="">
                  Macbook
                </a>
              </li>
              <li>
                <a href={"/" + AllRouteType.airpods} title="">
                  Airpods
                </a>
              </li>
              <li>
                <a
                  href={"/" + AllRouteType.accessories}
                  title=""
                >
                  Phụ kiện
                </a>
              </li>
              <li>
                <a
                  href={"/" + AllRouteType.news}
                  title=""
                >
                  Tin tức
                </a>
              </li>
            </ul>
          </div>
          <div className={`${classes.header_right}`}>
            <span className={classes.item}>
              <i
                className="pi pi-search"
                style={{ color: "white" }}
              ></i>
            </span>
            <span
              className={`${classes.item} ${classes.cart_item}`}
              onClick={handleCartClick}
            >
              <i
                className="pi pi-shopping-bag"
                style={{ color: "white" }}
              ></i>
              {getCartCount() > 0 && (
                <span className={classes.cart_badge}>
                  {getCartCount()}
                </span>
              )}
            </span>
          </div>
          <div className={`${classes.cart_mobile}`}>
            <button
              className={classes.cart_mobile_button}
              onClick={() => navigate("/cart")}
              aria-label="Giỏ hàng"
            >
              <i className="pi pi-shopping-bag"></i>
              {getCartCount() > 0 && (
                <span className={classes.cart_badge_mobile}>{getCartCount()}</span>
              )}
            </button>
          </div>
        </div>
        <div className={`${classes.header_mobile}`}>
          <div>
            <a href={"/" + AllRouteType.watch} title="">
              Watch
            </a>
          </div>
          <div>
            <a href={"/" + AllRouteType.ipad} title="">
              iPad
            </a>
          </div>
          <div>
            <a href={"/" + AllRouteType.macbook} title="">
              Macbook
            </a>
          </div>
          <div>
            <a href={"/" + AllRouteType.airpods} title="">
              Airpods
            </a>
          </div>
          <div>
            <a href={"/" + AllRouteType.accessories} title="">
              Phụ kiện
            </a>
          </div>
        </div>
      </div>

      {/* Cart OverlayPanel - Desktop Only */}
      <OverlayPanel
        ref={cartOverlayRef}
        className={classes.cart_overlay_panel}
        dismissable={true}
        showCloseIcon={false}
      >
        <div className={classes.cart_overlay_content}>
          <div className={classes.cart_overlay_header}>
            <h3>Giỏ hàng ({getCartCount()} sản phẩm)</h3>
          </div>

          {cartItems.length === 0 ? (
            <div className={classes.cart_empty_overlay}>
              <i className="pi pi-shopping-bag"></i>
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            <>
              <div className={classes.cart_items_overlay}>
                {cartItems.map((item) => (
                  <div key={item.id} className={classes.cart_item_overlay}>
                    <div className={classes.item_image_overlay}>
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className={classes.item_details_overlay}>
                      <h4>{item.name}</h4>
                      <p className={classes.item_price_overlay}>
                        {formatNumber(item.salePrice)}đ
                      </p>
                      <div className={classes.item_quantity_overlay}>
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
                    </div>
                    <div className={classes.item_total_overlay}>
                      <span>{formatNumber(item.salePrice * item.quantity)}đ</span>
                      <button
                        className={classes.remove_item_overlay}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <i className="pi pi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={classes.cart_summary_overlay}>
                <div className={classes.summary_total_overlay}>
                  <span>Tổng cộng:</span>
                  <span>{formatNumber(getCartTotal())}đ</span>
                </div>
                <div className={classes.cart_summary_actions}>
                  <button className={classes.clear_all_overlay} onClick={handleClearCart}>
                    Xóa tất cả
                  </button>
                  <button
                    className={classes.checkout_overlay}
                    onClick={handleCheckoutClick}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </OverlayPanel>
    </>
  );
}

export default UserHeader;
