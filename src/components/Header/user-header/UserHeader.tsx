function UserHeader() {
    return (
        <>
  <div id="masthead" className="header-main ">
   <div className="header-inner flex-row container logo-left medium-logo-center" role="navigation">
      <div id="logo" className="flex-col logo">
         <a href="https://manhquanstore.com/" title="Cửa hàng Apple chính hãng Mạnh Quân Store" rel="home">
         <img src="https://manhquanstore.com/wp-content/uploads/2022/08/manh-quan-store-1024x315.png" className="header_logo header-logo" alt="Cửa hàng Apple chính hãng Mạnh Quân Store"/>
         </a>
      </div>
      <div className="flex-col show-for-medium flex-left">
         <ul className="mobile-nav nav nav-left ">
            <li className="html custom html_topbar_right"><span className="tgn"></span></li>
         </ul>
      </div>
      <div className="flex-col hide-for-medium flex-left
         flex-grow">
         <ul className="header-nav header-nav-main nav nav-left  nav-uppercase">
            <li id="menu-item-20" className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-20 menu-item-design-default"><a href="https://manhquanstore.com/watch/" className="nav-top-link">Watch</a></li>
            <li id="menu-item-16" className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-16 menu-item-design-default"><a href="https://manhquanstore.com/ipad/" className="nav-top-link">iPad</a></li>
            <li id="menu-item-18" className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-18 menu-item-design-default"><a href="https://manhquanstore.com/macbook/" className="nav-top-link">Macbook</a></li>
            <li id="menu-item-535" className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-535 menu-item-design-default"><a href="https://manhquanstore.com/airpods/" className="nav-top-link">Airpods</a></li>
            <li id="menu-item-19" className="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-19 menu-item-design-default"><a href="https://manhquanstore.com/phu-kien/" className="nav-top-link">Phụ kiện</a></li>
            <li id="menu-item-536" className="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-536 menu-item-design-default"><a href="https://manhquanstore.com/tin-tuc/" className="nav-top-link">Tin tức</a></li>
         </ul>
      </div>
      <div className="flex-col hide-for-medium flex-right">
         <ul className="header-nav header-nav-main nav nav-right  nav-uppercase">
            <li className="header-search header-search-lightbox has-icon">
               <div className="header-button"> <a href="#search-lightbox" aria-label="Tìm kiếm" data-open="#search-lightbox" data-focus="input.search-field" className="icon primary button circle is-small">
                  <i className="icon-search" ></i></a>
               </div>
               <div id="search-lightbox" className="mfp-hide dark text-center">
                  <div className="searchform-wrapper ux-search-box relative is-large">
                     <form role="search" method="get" className="searchform" action="https://manhquanstore.com/">
                        <div className="flex-row relative">
                           <div className="flex-col flex-grow">
                              <label className="screen-reader-text" >Tìm kiếm:</label>
                              <input type="search" id="woocommerce-product-search-field-0" className="search-field mb-0" placeholder="Tìm kiếm sản phẩm ..." value="" name="s" />
                              <input type="hidden" name="post_type" value="product" />
                           </div>
                           <div className="flex-col">
                              <button type="submit" value="Tìm kiếm" className="ux-search-submit submit-button secondary button icon mb-0" aria-label="Submit">
                              <i className="icon-search"></i> </button>
                           </div>
                        </div>
                        <div className="live-search-results text-left z-top">
                           <div className="autocomplete-suggestions"></div>
                        </div>
                     </form>
                  </div>
               </div>
            </li>
            <li className="cart-item has-icon has-dropdown">
               <div className="header-button">
                  <a href="https://manhquanstore.com/thanh-toan/" title="Giỏ hàng" className="header-cart-link icon button circle is-outline is-small">
                  <span className="image-icon header-cart-icon" data-icon-label="0">
                  <img className="cart-img-icon" alt="Giỏ hàng" src="https://manhquanstore.com/wp-content/uploads/2022/08/cart.png"/>
                  </span>
                  </a>
               </div>
               <ul className="nav-dropdown nav-dropdown-default">
                  <li className="html widget_shopping_cart">
                     <div className="widget_shopping_cart_content">
                        <p className="woocommerce-mini-cart__empty-message">Chưa có sản phẩm trong giỏ hàng.</p>
                     </div>
                  </li>
               </ul>
            </li>
         </ul>
      </div>
      <div className="flex-col show-for-medium flex-right">
         <ul className="mobile-nav nav nav-right ">
            <li className="header-search header-search-lightbox has-icon">
               <div className="header-button"> <a href="#search-lightbox" aria-label="Tìm kiếm" data-open="#search-lightbox" data-focus="input.search-field" className="icon primary button circle is-small">
                  <i className="icon-search"></i></a>
               </div>
               <div id="search-lightbox" className="mfp-hide dark text-center">
                  <div className="searchform-wrapper ux-search-box relative is-large">
                     <form role="search" method="get" className="searchform" action="https://manhquanstore.com/">
                        <div className="flex-row relative">
                           <div className="flex-col flex-grow">
                              <label className="screen-reader-text" >Tìm kiếm:</label>
                              <input type="search" id="woocommerce-product-search-field-1" className="search-field mb-0" placeholder="Tìm kiếm sản phẩm ..." value="" name="s" />
                              <input type="hidden" name="post_type" value="product" />
                           </div>
                           <div className="flex-col">
                              <button type="submit" value="Tìm kiếm" className="ux-search-submit submit-button secondary button icon mb-0" aria-label="Submit">
                              <i className="icon-search"></i> </button>
                           </div>
                        </div>
                        <div className="live-search-results text-left z-top">
                           <div className="autocomplete-suggestions"></div>
                        </div>
                     </form>
                  </div>
               </div>
            </li>
            <li className="cart-item has-icon">
               <div className="header-button"> <a href="https://manhquanstore.com/thanh-toan/" className="header-cart-link off-canvas-toggle nav-top-link icon button circle is-outline is-small" data-open="#cart-popup" data-className="off-canvas-cart" title="Giỏ hàng" data-pos="right">
                  <span className="image-icon header-cart-icon" data-icon-label="0">
                  <img className="cart-img-icon" alt="Giỏ hàng" src="https://manhquanstore.com/wp-content/uploads/2022/08/cart.png" />
                  </span>
                  </a>
               </div>
               <div id="cart-popup" className="mfp-hide widget_shopping_cart">
                  <div className="cart-popup-inner inner-padding">
                     <div className="cart-popup-title text-center">
                        <h4 className="uppercase">Giỏ hàng</h4>
                        <div className="is-divider"></div>
                     </div>
                     <div className="widget_shopping_cart_content">
                        <p className="woocommerce-mini-cart__empty-message">Chưa có sản phẩm trong giỏ hàng.</p>
                     </div>
                     <div className="cart-sidebar-content relative"></div>
                  </div>
               </div>
            </li>
         </ul>
      </div>
   </div>
   <div className="container">
      <div className="top-divider full-width"></div>
   </div>
</div>
        </>
    )
}

export default UserHeader