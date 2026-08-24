import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllRouteType } from "../../../constants/constants";
import { useCart } from "../../../custom-hook/CartContext";
import { useTheme } from "../../../custom-hook/ThemeContext";
import headerLogo from "../../../images/Tao one den.png";
import "./UserHeader.scss";

import { OverlayPanel } from "primereact/overlaypanel";
import { CartItem } from "../../../constants/interface";
import { useAuth } from "../../../custom-hook/useAuth";

function UserHeader() {
  const { clearCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { username, isLoggedIn } = useAuth();
  const [isFixed, setIsFixed] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartCount, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const cartOverlayRef = useRef<OverlayPanel>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      if (window.scrollY > 100) {
        // Change 100 to the desired scroll distance
        setIsFixed(true);
      } else {
        // Add a small delay for smoother transition when scrolling back up
        scrollTimeout = setTimeout(() => {
          setIsFixed(false);
        }, 50); // Small delay for smoother transition
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
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

  const handleQuantityChange = (itemId: string, newQuantity: number, size?: string) => {
    updateQuantity(itemId, newQuantity, size);
  };

  const handleRemoveItem = (itemId: string, size?: string) => {
    removeFromCart(itemId, size);
  };

  const handleClearCart = () => {
    clearCart();
    setTimeout(() => {
      if (cartOverlayRef.current) {
        cartOverlayRef.current.hide();
      }
    }, 200);
  };

  const handleSearchClick = () => {
    setIsSearchActive(true);
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      let queryParams = "";
      if (searchQuery.trim()) {
        queryParams = queryString.stringify({
          filter: searchQuery
        });
      }
      navigate(`/search${queryParams ? "?" + queryParams : ""}`);
      // Hide the search input after navigation
      handleSearchClose();
    }
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleSearchClose();
    }
  };

  const handleItemClick = (item: CartItem) => {
    navigate(`/${item.category_code}/${item.id}`);
    if (cartOverlayRef.current) {
      cartOverlayRef.current.hide();
    }
  };

  const handleAccountClick = () => {
    navigate(isLoggedIn ? "/account" : "/login");
  };

  return (
    <>
      <div className={`user-header ${isFixed ? "user-header-fixed" : ''}`}>
        <div className="user-header-main">
          <div className="user-header-left">
            <a href="/" title="Trang chủ">
              <img
                className="user-header-logo"
                src={headerLogo}
                alt="Logo"
              />
            </a>
          </div>
          <div className="user-header-center">
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
          <div className="user-header-right">
            {/* Search Input - Appears to the right when active */}
            {isSearchActive ? (
              <div className="user-header-search-container-right">
                <form onSubmit={handleSearchSubmit} className="user-header-search-form">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="user-header-search-input"
                  />
                  <button type="submit" className="user-header-search-submit">
                    <i className="pi pi-search"></i>
                  </button>
                  <button
                    type="button"
                    className="user-header-search-close"
                    onClick={handleSearchClose}
                  >
                    <i className="pi pi-times"></i>
                  </button>
                </form>
              </div>
            ) : (
              <span
                className="user-header-item"
                onClick={handleSearchClick}
              >
                <i
                  className="pi pi-search"
                  style={{ color: "white" }}
                ></i>
              </span>
            )}
            <span
              className="user-header-item"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              <i
                className={theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'}
                style={{ color: "white" }}
              ></i>
            </span>
            <span
              className="user-header-item user-header-cart-item"
              onClick={handleCartClick}
            >
              <i
                className="pi pi-shopping-bag"
                style={{ color: "white" }}
              ></i>
              {getCartCount() > 0 && (
                <span className="user-header-cart-badge">
                  {getCartCount()}
                </span>
              )}
            </span>

              <span
              className="user-header-item user-header-account-item"
              onClick={handleAccountClick}
              title={isLoggedIn ? username || "Tài khoản" : "Đăng nhập"}
            >
              <i
                className="pi pi-user"
                style={{ color: "white" }}
              ></i>
            </span>
            
          </div>
          <div className="user-header-cart-mobile">
            <button
              className="user-header-cart-mobile-button"
              onClick={() => navigate("/cart")}
              aria-label="Giỏ hàng"
            >
              <i className="pi pi-shopping-bag"></i>
              {getCartCount() > 0 && (
                <span className="user-header-cart-badge-mobile">{getCartCount()}</span>
              )}
            </button>
          </div>
        </div>
        <div className="user-header-mobile">
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
        className="user-header-cart-overlay-panel"
        dismissable={true}
        showCloseIcon={false}
        style={{ transform: 'translateX(-50px)' }}
      >
        <div className="user-header-cart-overlay-content">
          <div className="user-header-cart-overlay-header">
            <h3>Giỏ hàng ({getCartCount()} sản phẩm)</h3>
          </div>

          {cartItems.length === 0 ? (
            <div className="user-header-cart-empty-overlay">
              <i className="pi pi-shopping-bag"></i>
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            <>
              <div className="user-header-cart-items-overlay">
                {cartItems.map((item) => (
                  <div key={item.id + item.size} className="user-header-cart-item-overlay">
                    <div className="user-header-item-image-overlay">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="user-header-item-details-overlay">
                      <h4 onClick={() => handleItemClick(item)}>{item.name}{item.size ? ` - ${item.size}` : ""}</h4>
                      <p className="user-header-item-price-overlay">
                        {formatNumber(item.salePrice)}đ
                      </p>
                      <div className="user-header-item-quantity-overlay">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size)}
                          disabled={item.quantity <= 1}
                        >
                          <i className="pi pi-minus"></i>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size)}
                        >
                          <i className="pi pi-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="user-header-item-total-overlay">
                      <span>{formatNumber(item.salePrice * item.quantity)}đ</span>
                      <button
                        className="user-header-remove-item-overlay"
                        onClick={() => handleRemoveItem(item.id, item.size)}
                      >
                        <i className="pi pi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="user-header-cart-summary-overlay">
                <div className="user-header-summary-total-overlay">
                  <span>Tổng cộng:</span>
                  <span>{formatNumber(getCartTotal())}đ</span>
                </div>
                <div className="user-header-cart-summary-actions">
                  <button className="user-header-clear-all-overlay" onClick={handleClearCart}>
                    Xóa tất cả
                  </button>
                  <button
                    className="user-header-checkout-overlay"
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