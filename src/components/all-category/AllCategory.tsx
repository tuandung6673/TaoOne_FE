import { OverlayPanel } from "primereact/overlaypanel";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams } from "react-router-dom";
import { SORTFILTER } from "../../constants/constants";
import {
    BannerDetail,
    CategoryDetail,
    ItemDetail,
} from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";
import classes from "./AllCategory.module.scss";

function AllCategory() {
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const [product, setProduct] = useState<ItemDetail[]>([]);
    const [categoryDetail, setCategoryDetail] = useState<CategoryDetail[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [sortFilterLabel, setSortFilterLabel] =
        useState<string>("Năm ra mắt");
    const [sortFilterValue, setSortFilterValue] = useState<string>("year");
    const { categoryName } = useParams<{ categoryName?: string }>();
    const op = useRef<OverlayPanel>(null);
    const slideParams = {
        screen: "category",
    };

    useEffect(() => {
        fetchSlides();
        if (categoryName) {
            fetchCategory(categoryName, "");
            fetchCategoryDetail(categoryName);
        }
    }, [categoryName]);

    const fetchSlides = async () => {
        try {
            const queryParams = queryString.stringify(slideParams);
            const slideList = await ApiService.getSlideList(queryParams);
            setBanner(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategory = async (
        categoryName: string,
        categoryDetailId: string
    ) => {
        try {
            const productParams = {
                category_code: categoryName || "",
                category_detail_id: categoryDetailId || "",
                filter: '',
                offSet: 0, 
                pageSize: 100
            };
            const queryParams = queryString.stringify(productParams);
            const productList = await ApiService.getProductList(queryParams);
            setProduct(productList.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategoryDetail = async (categoryName: string) => {
        try {
            const productParams = {
                category_code: categoryName || "", // Gán giá trị categoryName vào category_code,
                screen: ""
            };
            const queryParams = queryString.stringify(productParams);
            const productList = await ApiService.getCategoryDetailList(
                queryParams
            );
            setCategoryDetail(productList.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilterClick = (filterId: string) => {
        setActiveFilter(filterId);
        fetchCategory(categoryName || "", filterId === "all" ? "" : filterId);
    };

    const handleSortClick = (sortId: any) => {
        setSortFilterLabel(sortId?.label);
        setSortFilterValue(sortId?.value);
    };

    return (
        <div className={classes.main}>
            <h1>{categoryName}</h1>
            <div className={classes.carousel_custom}>
                <Carousel
                    autoPlay={true}
                    interval={10000}
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
                <div
                    onClick={() => handleFilterClick("all")}
                    className={`${classes.filter_item} ${
                        activeFilter === "all" ? classes.active : ""
                    }`}
                >
                    Tất cả
                </div>
                {categoryDetail.map((detail: CategoryDetail) => (
                    <div
                        className={`${classes.filter_item} ${
                            activeFilter === detail.id ? classes.active : ""
                        }`}
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
                <div
                    className={`${classes.sort_option} ${
                        sortFilterValue === SORTFILTER.YEAR.value
                            ? classes.sort_active
                            : ""
                    }`}
                    onClick={() => handleSortClick(SORTFILTER.YEAR)}
                >
                    {sortFilterValue === SORTFILTER.YEAR.value && <span style={{marginRight: '8px'}}>
                        <i className="pi pi-check"></i></span>}
                    {SORTFILTER.YEAR.label}
                </div>
                <div
                    className={`${classes.sort_option} ${
                        sortFilterValue === SORTFILTER.PRICE_ASC.value
                            ? classes.sort_active
                            : ""
                    }`}
                    onClick={() => handleSortClick(SORTFILTER.PRICE_ASC)}
                >
                    {sortFilterValue === SORTFILTER.PRICE_ASC.value && <span style={{marginRight: '8px'}}>
                        <i className="pi pi-check"></i></span>}
                    {SORTFILTER.PRICE_ASC.label}
                </div>
                <div
                    className={`${classes.sort_option} ${
                        sortFilterValue === SORTFILTER.PRICE_DESC.value
                            ? classes.sort_active
                            : ""
                    }`}
                    onClick={() => handleSortClick(SORTFILTER.PRICE_DESC)}
                >
                    {sortFilterValue === SORTFILTER.PRICE_DESC.value && <span style={{marginRight: '8px'}}>
                        <i className="pi pi-check"></i></span>}
                    {SORTFILTER.PRICE_DESC.label}
                </div>
            </OverlayPanel>
            <div className={classes.category_wrapper}>
                {product.map((category: ItemDetail) => (
                    <ProductItem productItem={category} />
                ))}
            </div>
        </div>
    );
}

export default AllCategory;
