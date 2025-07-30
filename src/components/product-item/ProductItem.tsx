import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { ItemDetail } from "../../constants/interface";
import { useCart } from "../../custom-hook/CartContext";
import classes from "./ProductItem.module.scss";

interface Props {
    productItem: ItemDetail;
    categoryCode?: string;
}

function ProductItem({ productItem, categoryCode }: Props) {
    const navigate = useNavigate();
    const { categoryName } = useParams<{ categoryName?: string }>();
    const { addToCart } = useCart();
    const toast = useRef<Toast>(null);
    
    const directProductDetail = (productId: string) => {
        if(categoryName) {
            navigate(`${productId}`)
        } else {
            navigate(`${categoryCode}/${productId}`)
        }
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation to product detail
        addToCart({
            id: productItem.id,
            name: productItem.name || "",
            price: productItem.price,
            salePrice: productItem.salePrice,
            img: productItem.img || "",
            quantity: 1,
            category_code: productItem.category_code,
            category_detail_name: productItem.category_detail_name
        });
        
        if (toast.current) {
            toast.current.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã thêm sản phẩm vào giỏ hàng!",
            });
        }
    };

    return (
        <div className={classes.product} onClick={() => directProductDetail(productItem.id)}>
            <Toast ref={toast} />
            {productItem.price !== productItem.salePrice && (
                <span className={classes.sale_percent}>
                    -{((1 - productItem.salePrice / productItem.price) * 100).toFixed(0)}%
                </span>
            )}
            <div className={classes.product_img}>
                <img src={productItem.img} alt={productItem.name} />
            </div>
            <p className={classes.product_name}>{productItem.name}</p>
            <div className={classes.product_price}>
                {productItem.price !== productItem.salePrice && (
                    <span className={classes.price}>
                        {productItem.price.toLocaleString("vi-VN")}đ
                    </span>
                )}
                <span className={classes.price_sale}>
                    {productItem.salePrice.toLocaleString("vi-VN")}đ
                </span>
            </div>
            <div className={classes.add_to_cart}>
                <Button
                    icon="pi pi-shopping-bag"
                    size="small"
                    onClick={handleAddToCart}
                    className={classes.cart_button}
                />
            </div>
        </div>
    );
}

export default ProductItem;
