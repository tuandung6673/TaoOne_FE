import { Toast } from "primereact/toast";
import queryString from "query-string";
import { useCallback, useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss/navigation";
import { BannerDetail, HomeCategory } from "../../constants/interface";
import ApiService from "../../services/api.service";
import ProductItem from "../product-item/ProductItem";
import classes from "./Home.module.scss";

const SWIPER_BREAKPOINTS = {
    1200: { slidesPerView: 4, spaceBetween: 25 },
    768: { slidesPerView: 3, spaceBetween: 20 },
    0: { slidesPerView: 2, spaceBetween: 15 },
};

const SWIPER_MODULES = [Navigation, Pagination, Scrollbar, A11y];

function Home() {
    const [slides, setSlides] = useState<BannerDetail[]>([]);
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const queryParams = queryString.stringify({ screen: "home" });
                const { data } = await ApiService.getSlideList(queryParams);
                setSlides(data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchHome = async () => {
            try {
                const { data } = await ApiService.getHome();
                console.log('data', data);
                
                setCategories(data.categories);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSlides();
        fetchHome();
    }, []);

    const handleGoToCategory = useCallback(
        (categoryCode: string) => navigate(`/${categoryCode}`),
        [navigate]
    );

    const handleAddToCart = useCallback((productName: string) => {
        toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: `Đã thêm ${productName} vào giỏ hàng!`,
        });
    }, []);

    return (
        <div className={classes.homeWrapper}>
            <Toast ref={toast} position="top-right" />

            <div className={classes.carousel}>
                <Carousel
                    autoPlay
                    interval={10000}
                    infiniteLoop
                    showIndicators={false}
                    showThumbs={false}
                    showStatus={false}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className={classes.slider}>
                            <img src={slide.img} alt={slide.name} />
                        </div>
                    ))}
                </Carousel>
            </div>

            <div className={classes.main}>
                <div className={classes.category}>
                    {categories.map((ctg) => (
                        <div
                            key={ctg.id}
                            className={classes.category_item}
                            onClick={() => handleGoToCategory(ctg.code)}
                        >
                            <div className={classes.item_img}>
                                <img src={ctg.img} alt={ctg.name} />
                            </div>
                            <p className={classes.item_name}>{ctg.name}</p>
                        </div>
                    ))}
                </div>

                <div className={classes.categories}>
                    {categories.map((category) => (
                        <div key={category.id} className={classes.product_wrapper}>
                            <h2 style={{ textAlign: "center" }}>
                                {category.name}
                            </h2>
                            <Swiper
                                breakpoints={SWIPER_BREAKPOINTS}
                                modules={SWIPER_MODULES}
                            >
                                {category.products.map((product) => (
                                    <SwiperSlide
                                        key={product.id}
                                        className={classes.product}
                                    >
                                        <ProductItem
                                            productItem={product}
                                            onAddToCart={handleAddToCart}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
