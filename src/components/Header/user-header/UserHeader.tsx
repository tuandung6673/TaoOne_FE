import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllRouteType } from "../../../constants/constants";
import { useCart } from "../../../custom-hook/CartContext";
import headerLogo from "../../../images/Tao one den.png";
import classes from "./UserHeader.module.scss";

import { OverlayPanel } from "primereact/overlaypanel";

function UserHeader() {
  const { clearCart } = useCart();
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
            
            {/* Search Input - Appears to the right when active */}
            {isSearchActive ? (
              <div className={classes.search_container_right}>
                <form onSubmit={handleSearchSubmit} className={classes.search_form}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className={classes.search_input}
                  />
                  <button type="submit" className={classes.search_submit}>
                    <i className="pi pi-search"></i>
                  </button>
                  <button 
                    type="button" 
                    className={classes.search_close}
                    onClick={handleSearchClose}
                  >
                    <i className="pi pi-times"></i>
                  </button>
                </form>
              </div>
            ) : (
              <span 
                className={classes.item}
                onClick={handleSearchClick}
              >
                <i
                  className="pi pi-search"
                  style={{ color: "white" }}
                ></i>
              </span>
            )}
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
        style={{ transform: 'translateX(-50px)' }}
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
                  <div key={item.id + item.size} className={classes.cart_item_overlay}>
                    <div className={classes.item_image_overlay}>
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className={classes.item_details_overlay}>
                      <h4>{item.name}{item.size ? ` - ${item.size}` : ""}</h4>
                      <p className={classes.item_price_overlay}>
                        {formatNumber(item.salePrice)}đ
                      </p>
                      <div className={classes.item_quantity_overlay}>
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
                    <div className={classes.item_total_overlay}>
                      <span>{formatNumber(item.salePrice * item.quantity)}đ</span>
                      <button
                        className={classes.remove_item_overlay}
                        onClick={() => handleRemoveItem(item.id, item.size)}
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