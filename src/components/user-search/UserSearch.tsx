import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useSearchParams } from "react-router-dom";
import { SORTFILTER } from "../../constants/constants";
import { BannerDetail, ItemDetail } from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";
import classes from "./UserSearch.module.scss";

const SORT_OPTIONS = [
    SORTFILTER.DEFAULT,
    SORTFILTER.PRICE_ASC,
    SORTFILTER.PRICE_DESC,
];

const UserSearch = () => {
    const [queryParams] = useSearchParams();
    const filter = queryParams.get("filter");
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const toast = useRef<Toast>(null);
    const [sortFilterValue, setSortFilterValue] = useState<string>("");
    const [product, setProduct] = useState<ItemDetail[]>([]);
    const op = useRef<OverlayPanel>(null);

    const sortFilterLabel =
        SORT_OPTIONS.find((option) => option.value === sortFilterValue)
            ?.label ?? SORTFILTER.DEFAULT.label;

    useEffect(() => {
        if (!filter) return;

        const fetchProduct = async () => {
            try {
                const productQueryParams = queryString.stringify({ filter });
                const productList = await ApiService.getProductSearch(
                    productQueryParams
                );
                setProduct(productList.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProduct();
    }, [filter, sortFilterValue]);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const slideQueryParams = queryString.stringify({ screen: "home" });
                const slideList = await ApiService.getSlideList(slideQueryParams);
                setBanner(slideList.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSlides();
    }, []);

    const handleSortClick = useCallback((sortValue: string) => {
        setSortFilterValue(sortValue);
        op.current?.hide();
    }, []);

    const handleAddToCart = useCallback((productName: string) => {
        toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: `Đã thêm ${productName} vào giỏ hàng!`,
        });
    }, []);

    return (
        <div className={classes.main}>
            <Toast ref={toast} position="top-right" />
            <div className={classes.carousel_custom}>
                <Carousel
                    autoPlay={true}
                    interval={6000}
                    infiniteLoop={true}
                    showIndicators={false}
                    showThumbs={false}
                    showStatus={false}
                >
                    {banner.map((sl) => (
                        <div key={sl.id} className={classes.slider}>
                            <img src={sl.img} alt={sl.name} />
                        </div>
                    ))}
                </Carousel>
            </div>
            <div className={classes.filter}>
                <div className={classes.filter_item}>
                    <div className={classes.empty}></div>
                    <div className={classes.filter_item_label}>Từ khóa: <span className={classes.filter_item_label_text}>{filter}</span> <span className={classes.filter_item_label_length}>({product.length} sản phẩm)</span></div>
                </div>
                <div className={classes.sort}>
                    <span onClick={(e) => op.current?.toggle(e)}>
                        Xếp theo: {sortFilterLabel}{" "}
                        <i className="pi pi-chevron-down"></i>
                    </span>
                </div>
            </div>
            <OverlayPanel ref={op}>
                {SORT_OPTIONS.map((option) => (
                    <div
                        key={option.value}
                        className={`${classes.sort_option} ${sortFilterValue === option.value
                            ? classes.sort_active
                            : ""
                            }`}
                        onClick={() => handleSortClick(option.value)}
                    >
                        {sortFilterValue === option.value && (
                            <span style={{ marginRight: "8px" }}>
                                <i className="pi pi-check"></i>
                            </span>
                        )}
                        {option.label}
                    </div>
                ))}
            </OverlayPanel>
            <div className={classes.category_wrapper}>
                {product.map((category: ItemDetail) => (
                    <ProductItem
                        productItem={category}
                        key={category.id}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserSearch;
