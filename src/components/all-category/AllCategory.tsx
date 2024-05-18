import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams } from "react-router-dom";
import classes from "./AllCategory.module.scss";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import queryString from "query-string";
import { BannerDetail, ItemDetail } from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";

function AllCategory() {
    const [banner, setBanner] = useState<BannerDetail[]>([]);
    const [product, setProduct] = useState<ItemDetail[]>([]);
    const { categoryName } = useParams<{ categoryName?: string }>();
    
    const slideParams = {
        screen: "category",
    };

    useEffect(() => {
        fetchSlides();
        if (categoryName) {
            fetchCategory(categoryName);
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

    const fetchCategory = async (categoryName: string) => {
        try {
            const productParams = {
                category_code: categoryName || "", // Gán giá trị categoryName vào category_code
                category_detail_id: "",
            };
            const queryParams = queryString.stringify(productParams);
            const productList = await ApiService.getProductList(queryParams);
            setProduct(productList.data.data);
        } catch (error) {
            console.error(error);
        }
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
            <div className={classes.filter}>Lọc theo các Series</div>
            <div className={classes.sort}>Xếp theo</div>
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
