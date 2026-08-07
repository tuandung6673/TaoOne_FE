import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams, useSearchParams } from "react-router-dom";
import { AllRouteType, SORTFILTER } from "../../constants/constants";
import {
    BannerDetail,
    CategoryDetail,
    ItemDetail,
} from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";
import classes from "./AllCategory.module.scss";

const CATEGORY_TITLES: Record<string, string> = {
    [AllRouteType.watch]: "Apple Watch",
    [AllRouteType.ipad]: "iPad",
    [AllRouteType.macbook]: "Macbook",
    [AllRouteType.airpods]: "AirPods",
    [AllRouteType.accessories]: "Phụ kiện",
};

const SORT_OPTIONS = [
    SORTFILTER.DEFAULT,
    SORTFILTER.PRICE_ASC,
    SORTFILTER.PRICE_DESC,
];

interface ProductQueryParams {
    category_code: string;
    category_detail_id: string;
    filter: string;
    offSet: number;
    pageSize: number;
    sort: string;
    status: number;
}

function AllCategory() {
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const [product, setProduct] = useState<ItemDetail[]>([]);
    const [categoryDetail, setCategoryDetail] = useState<CategoryDetail[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [sortFilterValue, setSortFilterValue] = useState<string>("");
    const { categoryName } = useParams<{ categoryName?: string }>();
    const [queryParams] = useSearchParams();
    const ctgDetailId = queryParams.get("ctgDetail");
    const op = useRef<OverlayPanel>(null);
    const toast = useRef<Toast>(null);

    const sortFilterLabel =
        SORT_OPTIONS.find((option) => option.value === sortFilterValue)
            ?.label ?? SORTFILTER.DEFAULT.label;

    useEffect(() => {
        if (!categoryName) return;

        const fetchSlides = async () => {
            try {
                const slideQueryParams = queryString.stringify({
                    screen: categoryName,
                });
                const slideList = await ApiService.getSlideList(slideQueryParams);
                setBanner(slideList.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchCategoryDetail = async () => {
            try {
                const detailQueryParams = queryString.stringify({
                    category_code: categoryName,
                    screen: "",
                });
                const productList = await ApiService.getCategoryDetailList(
                    detailQueryParams
                );
                setCategoryDetail(productList.data.data);
                if (ctgDetailId) {
                    // neu co ctgDetailId tuc la router tren breadcrum, tuc la filter theo category detail
                    setActiveFilter(ctgDetailId);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSlides();
        fetchCategoryDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryName]);

    useEffect(() => {
        if (!categoryName) return;

        const fetchProduct = async () => {
            try {
                const productParams: ProductQueryParams = {
                    category_code: categoryName,
                    category_detail_id: activeFilter === "all" ? "" : activeFilter,
                    filter: "",
                    offSet: 0,
                    pageSize: 100,
                    sort: sortFilterValue,
                    status: 1,
                };
                const productQueryParams = queryString.stringify(productParams);
                const productList = await ApiService.getProductList(
                    productQueryParams
                );
                setProduct(productList.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProduct();
    }, [categoryName, activeFilter, sortFilterValue]);

    const handleFilterClick = useCallback((filterId: string) => {
        setActiveFilter(filterId);
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
            <h1>{categoryName ? CATEGORY_TITLES[categoryName] ?? "" : ""}</h1>
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
                <div
                    onClick={() => handleFilterClick("all")}
                    className={`${classes.filter_item} ${activeFilter === "all" ? classes.active : ""
                        }`}
                >
                    Tất cả
                </div>
                {/* for small/mobile screen */}
                <div className={classes.filter_scrollable}>
                    {categoryDetail.map((detail: CategoryDetail) => (
                        <div
                            className={`${classes.filter_item} ${activeFilter === detail.id ? classes.active : ""
                                }`}
                            key={detail.id}
                            onClick={() => handleFilterClick(detail.id)}
                        >
                            {detail.name}
                        </div>
                    ))}
                </div>
                {/* for large screen */}
                {categoryDetail.map((detail: CategoryDetail) => (
                    <div
                        className={`${classes.filter_item} ${activeFilter === detail.id ? classes.active : ""
                            } ${classes.filter_item_large_screen}`}
                        key={detail.id}
                        onClick={() => handleFilterClick(detail.id)}
                    >
                        {detail.name}
                    </div>
                ))}
            </div>
            <div className={classes.sort}>
                <span onClick={(e) => op.current?.toggle(e)}>
                    Xếp theo: {sortFilterLabel}{" "}
                    <i className="pi pi-chevron-down"></i>
                </span>
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
                {product.map((item: ItemDetail) => (
                    <ProductItem
                        productItem={item}
                        key={item.id}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </div>
    );
}

export default AllCategory;
