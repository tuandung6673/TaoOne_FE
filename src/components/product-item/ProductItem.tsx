import { useNavigate } from "react-router";
import { ItemDetail } from "../../constants/interface";
import classes from "./ProductItem.module.scss";
import { useParams } from "react-router-dom";

interface Props {
    productItem: ItemDetail;
}

function ProductItem({ productItem }: Props) {
    const navigate = useNavigate();
    const { categoryName } = useParams<{ categoryName?: string }>();
    const directProductDetail = (productId: string) => {
        if(categoryName) {
            navigate(`${productId}`)
        } else {
            console.log('12312312312');
        }
    }
    return (
        <div className={classes.product} onClick={() => directProductDetail(productItem.id)}>
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
        </div>
    );
}

export default ProductItem;
