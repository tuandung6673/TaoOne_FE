import classes from "./ProductItem.module.scss";

interface CategoryItem {
    name: string;
    image: string;
    price: number;
    salePrice: number;
}

interface Props {
    productItem: CategoryItem;
}

function ProductItem({ productItem }: Props) {
    return (
        <div className={classes.product}>
            {productItem.price !== productItem.salePrice && (
                <span className={classes.sale_percent}>
                    -{((1 - productItem.salePrice / productItem.price) * 100).toFixed(0)}%
                </span>
            )}
            <div className={classes.product_img}>
                <img src={productItem.image} alt={productItem.name} />
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
