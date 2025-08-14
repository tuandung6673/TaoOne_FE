import "./UserSearch.module.scss";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import ApiService from "../../services/api.service";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BannerDetail, ItemDetail } from "../../constants/interface";
import { Toast } from "primereact/toast";
import { OverlayPanel } from "primereact/overlaypanel";
import { SORTFILTER } from "../../constants/constants";
import ProductItem from "../product-item/ProductItem";
import classes from "./UserSearch.module.scss";

const UserSearch = () => {
    const [queryParams] = useSearchParams();
    const filter = queryParams.get('filter');
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const toast = useRef<Toast>(null);
    const [sortFilterLabel, setSortFilterLabel] = useState<string>("Mặc định");
    const [sortFilterValue, setSortFilterValue] = useState<string>("");
    const [product, setProduct] = useState<any[]>([]);
    const op = useRef<OverlayPanel>(null);
    const productParams = {
        filter: filter || "",
        offSet: 0,
        pageSize: 100,
        sort: sortFilterValue,
    };
    const slideParams = {
        screen: "home"
        // screen: "home"
    };

    useEffect(() => {
        if (filter) {
            fetchProduct();
        }
    }, [filter, sortFilterValue]);

    useEffect(() => {
        fetchSlides();
    }, []);


    const fetchProduct = async () => {
        try {
            const queryParams = queryString.stringify(productParams);
            const productList = await ApiService.getProductList(queryParams);
            setProduct(productList.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchSlides = async () => {
        try {
            const queryParams = queryString.stringify(slideParams);
            const slideList = await ApiService.getSlideList(queryParams);
            setBanner(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSortClick = (sortId: any) => {
        setSortFilterLabel(sortId?.label);
        setSortFilterValue(sortId?.value);
    };

    const handleAddToCart = (productName: string) => {
        if (toast.current) {
            toast.current.show({
                severity: "success",
                summary: "Thành công",
                detail: `Đã thêm ${productName} vào giỏ hàng!`,
            });
        }
    };

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
                    {banner.map((sl, index) => (
                        <div key={index} className={classes.slider}>
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
                <div
                    className={`${classes.sort_option} ${sortFilterValue === SORTFILTER.DEFAULT.value
                        ? classes.sort_active
                        : ""
                        }`}
                    onClick={() => handleSortClick(SORTFILTER.DEFAULT)}
                >
                    {sortFilterValue === SORTFILTER.DEFAULT.value && (
                        <span style={{ marginRight: "8px" }}>
                            <i className="pi pi-check"></i>
                        </span>
                    )}
                    {SORTFILTER.DEFAULT.label}
                </div>
                <div
                    className={`${classes.sort_option} ${sortFilterValue === SORTFILTER.PRICE_ASC.value
                        ? classes.sort_active
                        : ""
                        }`}
                    onClick={() => handleSortClick(SORTFILTER.PRICE_ASC)}
                >
                    {sortFilterValue === SORTFILTER.PRICE_ASC.value && (
                        <span style={{ marginRight: "8px" }}>
                            <i className="pi pi-check"></i>
                        </span>
                    )}
                    {SORTFILTER.PRICE_ASC.label}
                </div>
                <div
                    className={`${classes.sort_option} ${sortFilterValue === SORTFILTER.PRICE_DESC.value
                        ? classes.sort_active
                        : ""
                        }`}
                    onClick={() => handleSortClick(SORTFILTER.PRICE_DESC)}
                >
                    {sortFilterValue === SORTFILTER.PRICE_DESC.value && (
                        <span style={{ marginRight: "8px" }}>
                            <i className="pi pi-check"></i>
                        </span>
                    )}
                    {SORTFILTER.PRICE_DESC.label}
                </div>
            </OverlayPanel >
            <div className={classes.category_wrapper}>
                {product.map((category: ItemDetail, index: any) => (
                    <ProductItem
                        productItem={category}
                        key={index}
                        categoryCode={category.category_code}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </div >
    );
};

export default UserSearch;