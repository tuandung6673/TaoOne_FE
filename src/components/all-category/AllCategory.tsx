import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams } from "react-router-dom";
import {
    BannerDetail,
    CategoryDetail,
    ItemDetail,
} from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";
import classes from "./AllCategory.module.scss";
import { OverlayPanel } from 'primereact/overlaypanel';
        
function AllCategory() {
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const [product, setProduct] = useState<ItemDetail[]>([]);
    const [categoryDetail, setCategoryDetail] = useState<CategoryDetail[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("all")
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
            const slideList = await ApiService.getSlide(queryParams);
            setBanner(slideList.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategory = async (categoryName: string, categoryDetailId: string) => {
        try {
            const productParams = {
                category_code: categoryName || "",
                category_detail_id: categoryDetailId || "",
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
                category_code: categoryName || "", // Gán giá trị categoryName vào category_code
            };
            const queryParams = queryString.stringify(productParams);
            const productList = await ApiService.GetCategoryDetailList(
                queryParams
            );
            const fakeData = [...productList.data.data, ...productList.data.data]
            setCategoryDetail(fakeData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilterClick = (filterId: string) => {
        setActiveFilter(filterId);
        fetchCategory(categoryName || "", filterId === "all" ? "" : filterId);
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
                <div onClick={() => handleFilterClick('all')} className={`${classes.filter_item} ${activeFilter === 'all' ? classes.active : ''}`}>Tất cả</div>
                {categoryDetail.map((detail: CategoryDetail) => (
                    <div className={`${classes.filter_item} ${activeFilter === detail.id ? classes.active : ''}`} key={detail.id} onClick={() => handleFilterClick(detail.id)}>{detail.name}</div>
                ))}
            </div>
            <div className={classes.sort} onClick={(e) => op.current?.toggle(e)}>Xếp theo</div>
            <OverlayPanel ref={op}>
                <img src="/images/product/bamboo-watch.jpg" alt="Bamboo Watch"></img>
            </OverlayPanel>
            <div className={classes.category_wrapper}>
                {product.map((category: ItemDetail) => (
                    <div key={category.id}>
                        <div>
                            <ProductItem productItem={category} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCategory;
